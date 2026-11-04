package com.rozgaarmitra.service;

import com.rozgaarmitra.dto.JobRequest;
import com.rozgaarmitra.dto.JobResponse;
import com.rozgaarmitra.entity.*;
import com.rozgaarmitra.exception.UnauthorizedException;
import com.rozgaarmitra.repository.ApplicationRepository;
import com.rozgaarmitra.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private EmployerService employerService;

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private JobService jobService;

    private Employer employer1;
    private Employer employer2;
    private User employerUser1;
    private User employerUser2;
    private Job job1;

    @BeforeEach
    void setUp() {
        employerUser1 = new User(1L, "Contractor Sharma", "sharma@example.com", "pass123", "9876543210", Role.EMPLOYER);
        employer1 = new Employer(10L, employerUser1, "Sharma Constructions", "Construction", "Delhi");

        employerUser2 = new User(2L, "Builder Verma", "verma@example.com", "pass123", "9876543211", Role.EMPLOYER);
        employer2 = new Employer(20L, employerUser2, "Verma Enterprises", "Contracting", "Mumbai");

        job1 = new Job(100L, employer1, "Senior Electrician Required", "ELECTRICIAN",
                "Wiring for residential flats", 25000.0, "Delhi", 3, 2,
                LocalDate.now(), LocalDate.now().plusDays(15), JobStatus.OPEN);
    }

    @Test
    @DisplayName("Should successfully create a job for an authenticated employer")
    void testCreateJob_Success() {
        JobRequest request = new JobRequest();
        request.setJobTitle("Senior Electrician Required");
        request.setJobCategory("ELECTRICIAN");
        request.setDescription("Wiring for residential flats");
        request.setSalary(25000.0);
        request.setLocation("Delhi");
        request.setExperienceRequired(3);
        request.setVacancyCount(2);
        request.setLastDateToApply(LocalDate.now().plusDays(15));

        when(employerService.getEmployerByEmail("sharma@example.com")).thenReturn(employer1);
        when(jobRepository.save(any(Job.class))).thenReturn(job1);

        JobResponse response = jobService.createJob("sharma@example.com", request);

        assertNotNull(response);
        assertEquals("Senior Electrician Required", response.getJobTitle());
        assertEquals(JobStatus.OPEN, response.getStatus());
        assertEquals(10L, response.getEmployerId());
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    @DisplayName("Should reject job update when employer is NOT the owner")
    void testUpdateJob_Unauthorized() {
        JobRequest updateRequest = new JobRequest();
        updateRequest.setJobTitle("Hacked Job Title");
        updateRequest.setJobCategory("ELECTRICIAN");
        updateRequest.setDescription("Malicious edit");
        updateRequest.setSalary(50000.0);
        updateRequest.setLocation("Delhi");
        updateRequest.setExperienceRequired(5);
        updateRequest.setVacancyCount(1);
        updateRequest.setLastDateToApply(LocalDate.now().plusDays(10));

        // employer2 (ID 20) tries to update job1 owned by employer1 (ID 10)
        when(employerService.getEmployerByEmail("verma@example.com")).thenReturn(employer2);
        when(jobRepository.findById(100L)).thenReturn(Optional.of(job1));

        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> {
            jobService.updateJob("verma@example.com", 100L, updateRequest);
        });

        assertEquals("You are not authorized to edit this job.", exception.getMessage());
        verify(jobRepository, never()).save(any(Job.class));
    }

    @Test
    @DisplayName("Should successfully update job when owner employer performs update")
    void testUpdateJob_Success() {
        JobRequest updateRequest = new JobRequest();
        updateRequest.setJobTitle("Updated Electrician Title");
        updateRequest.setJobCategory("ELECTRICIAN");
        updateRequest.setDescription("Updated description");
        updateRequest.setSalary(28000.0);
        updateRequest.setLocation("Delhi NCR");
        updateRequest.setExperienceRequired(4);
        updateRequest.setVacancyCount(3);
        updateRequest.setLastDateToApply(LocalDate.now().plusDays(20));

        when(employerService.getEmployerByEmail("sharma@example.com")).thenReturn(employer1);
        when(jobRepository.findById(100L)).thenReturn(Optional.of(job1));
        when(jobRepository.save(any(Job.class))).thenReturn(job1);
        when(applicationRepository.findByJob_JobIdOrderByApplyDateDesc(100L)).thenReturn(Collections.emptyList());

        JobResponse response = jobService.updateJob("sharma@example.com", 100L, updateRequest);

        assertNotNull(response);
        verify(jobRepository, times(1)).save(any(Job.class));
    }
}
