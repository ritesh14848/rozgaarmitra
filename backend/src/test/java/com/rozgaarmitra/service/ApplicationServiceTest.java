package com.rozgaarmitra.service;

import com.rozgaarmitra.dto.ApplicationResponse;
import com.rozgaarmitra.entity.*;
import com.rozgaarmitra.exception.BadRequestException;
import com.rozgaarmitra.exception.DuplicateResourceException;
import com.rozgaarmitra.exception.UnauthorizedException;
import com.rozgaarmitra.repository.ApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private WorkerService workerService;

    @Mock
    private EmployerService employerService;

    @Mock
    private JobService jobService;

    @InjectMocks
    private ApplicationService applicationService;

    private Worker worker;
    private User workerUser;
    private Employer employer;
    private User employerUser;
    private Job openJob;
    private Job closedJob;
    private Job expiredJob;

    @BeforeEach
    void setUp() {
        workerUser = new User(1L, "Ramesh Kumar", "ramesh@example.com", "pass123", "9812345678", Role.WORKER);
        worker = new Worker(10L, workerUser, "ITI Electrician", 4, "IMMEDIATE", "Delhi", HoursWork.FULL_TIME, Trade.ELECTRICIAN);

        employerUser = new User(2L, "Anil Sharma", "anil@example.com", "pass123", "9812345679", Role.EMPLOYER);
        employer = new Employer(20L, employerUser, "Sharma Works", "Electrical", "Delhi");

        openJob = new Job(100L, employer, "Need Plumber", "PLUMBER", "Fix residential pipe leakage",
                20000.0, "Delhi", 2, 1, LocalDate.now(), LocalDate.now().plusDays(10), JobStatus.OPEN);

        closedJob = new Job(101L, employer, "Need Welder", "WELDER", "Gate fabrication",
                22000.0, "Delhi", 3, 1, LocalDate.now().minusDays(5), LocalDate.now().plusDays(5), JobStatus.CLOSED);

        expiredJob = new Job(102L, employer, "Need Painter", "PAINTER", "House painting",
                18000.0, "Delhi", 1, 2, LocalDate.now().minusDays(20), LocalDate.now().minusDays(1), JobStatus.OPEN);
    }

    @Test
    @DisplayName("Should successfully submit application when eligible")
    void testApplyForJob_Success() {
        when(workerService.getWorkerByEmail("ramesh@example.com")).thenReturn(worker);
        when(jobService.findEntityById(100L)).thenReturn(openJob);
        when(applicationRepository.existsByWorker_WorkerIdAndJob_JobId(10L, 100L)).thenReturn(false);

        Application application = new Application(500L, worker, openJob, LocalDate.now(), ApplicationStatus.PENDING);
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        ApplicationResponse response = applicationService.applyForJob("ramesh@example.com", 100L);

        assertNotNull(response);
        assertEquals(500L, response.getApplicationId());
        assertEquals(ApplicationStatus.PENDING, response.getStatus());
        assertEquals("Need Plumber", response.getJobTitle());
        assertEquals("Ramesh Kumar", response.getWorkerName());
        verify(applicationRepository, times(1)).save(any(Application.class));
    }

    @Test
    @DisplayName("Should REJECT duplicate application from same worker for the same job")
    void testApplyForJob_DuplicateApplicationRejected() {
        when(workerService.getWorkerByEmail("ramesh@example.com")).thenReturn(worker);
        when(jobService.findEntityById(100L)).thenReturn(openJob);
        when(applicationRepository.existsByWorker_WorkerIdAndJob_JobId(10L, 100L)).thenReturn(true);

        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class, () -> {
            applicationService.applyForJob("ramesh@example.com", 100L);
        });

        assertEquals("You have already submitted an application for this job.", exception.getMessage());
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Should REJECT application when job status is CLOSED")
    void testApplyForJob_ClosedJobRejected() {
        when(workerService.getWorkerByEmail("ramesh@example.com")).thenReturn(worker);
        when(jobService.findEntityById(101L)).thenReturn(closedJob);

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            applicationService.applyForJob("ramesh@example.com", 101L);
        });

        assertEquals("This job is currently closed and no longer accepting applications.", exception.getMessage());
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Should REJECT application when deadline has passed")
    void testApplyForJob_DeadlinePassedRejected() {
        when(workerService.getWorkerByEmail("ramesh@example.com")).thenReturn(worker);
        when(jobService.findEntityById(102L)).thenReturn(expiredJob);

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            applicationService.applyForJob("ramesh@example.com", 102L);
        });

        assertEquals("The deadline to apply for this job has passed.", exception.getMessage());
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Should REJECT updating application status if employer does not own the job")
    void testUpdateApplicationStatus_Unauthorized() {
        Employer intruderEmployer = new Employer(99L, new User(99L, "Intruder", "intruder@example.com", "p", "999", Role.EMPLOYER), null, "None", "Nowhere");
        Application application = new Application(500L, worker, openJob, LocalDate.now(), ApplicationStatus.PENDING);

        when(employerService.getEmployerByEmail("intruder@example.com")).thenReturn(intruderEmployer);
        when(applicationRepository.findById(500L)).thenReturn(Optional.of(application));

        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> {
            applicationService.updateApplicationStatus("intruder@example.com", 500L, ApplicationStatus.ACCEPTED);
        });

        assertEquals("You are not authorized to update this application.", exception.getMessage());
        verify(applicationRepository, never()).save(any(Application.class));
    }
}
