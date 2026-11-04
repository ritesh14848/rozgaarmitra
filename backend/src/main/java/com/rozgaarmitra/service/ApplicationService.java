package com.rozgaarmitra.service;

import com.rozgaarmitra.dto.ApplicationResponse;
import com.rozgaarmitra.entity.*;
import com.rozgaarmitra.exception.BadRequestException;
import com.rozgaarmitra.exception.DuplicateResourceException;
import com.rozgaarmitra.exception.ResourceNotFoundException;
import com.rozgaarmitra.exception.UnauthorizedException;
import com.rozgaarmitra.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final WorkerService workerService;
    private final EmployerService employerService;
    private final JobService jobService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              WorkerService workerService,
                              EmployerService employerService,
                              JobService jobService) {
        this.applicationRepository = applicationRepository;
        this.workerService = workerService;
        this.employerService = employerService;
        this.jobService = jobService;
    }

    @Transactional
    public ApplicationResponse applyForJob(String workerEmail, Long jobId) {
        Worker worker = workerService.getWorkerByEmail(workerEmail);
        Job job = jobService.findEntityById(jobId);

        // Check if job is open
        if (job.getStatus() == JobStatus.CLOSED) {
            throw new BadRequestException("This job is currently closed and no longer accepting applications.");
        }

        // Check if deadline has passed
        if (job.getLastDateToApply().isBefore(LocalDate.now())) {
            throw new BadRequestException("The deadline to apply for this job has passed.");
        }

        // Check if worker already applied
        if (applicationRepository.existsByWorker_WorkerIdAndJob_JobId(worker.getWorkerId(), job.getJobId())) {
            throw new DuplicateResourceException("You have already submitted an application for this job.");
        }

        Application application = new Application();
        application.setWorker(worker);
        application.setJob(job);
        application.setApplyDate(LocalDate.now());
        application.setStatus(ApplicationStatus.PENDING);

        Application saved = applicationRepository.save(application);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByWorker(String workerEmail) {
        Worker worker = workerService.getWorkerByEmail(workerEmail);
        return applicationRepository.findByWorker_WorkerIdOrderByApplyDateDesc(worker.getWorkerId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsForJob(String employerEmail, Long jobId) {
        Employer employer = employerService.getEmployerByEmail(employerEmail);
        Job job = jobService.findEntityById(jobId);

        if (!job.getEmployer().getEmployerId().equals(employer.getEmployerId())) {
            throw new UnauthorizedException("You are not authorized to view applications for this job.");
        }

        return applicationRepository.findByJob_JobIdOrderByApplyDateDesc(jobId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByEmployer(String employerEmail) {
        Employer employer = employerService.getEmployerByEmail(employerEmail);
        return applicationRepository.findByJob_Employer_EmployerIdOrderByApplyDateDesc(employer.getEmployerId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(String employerEmail, Long applicationId, ApplicationStatus status) {
        Employer employer = employerService.getEmployerByEmail(employerEmail);
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        if (!application.getJob().getEmployer().getEmployerId().equals(employer.getEmployerId())) {
            throw new UnauthorizedException("You are not authorized to update this application.");
        }

        application.setStatus(status);
        Application updated = applicationRepository.save(application);
        return mapToResponse(updated);
    }

    private ApplicationResponse mapToResponse(Application app) {
        ApplicationResponse response = new ApplicationResponse();
        response.setApplicationId(app.getApplicationId());

        Job job = app.getJob();
        response.setJobId(job.getJobId());
        response.setJobTitle(job.getJobTitle());
        response.setJobCategory(job.getJobCategory());
        response.setJobLocation(job.getLocation());
        response.setSalary(job.getSalary());

        Employer employer = job.getEmployer();
        response.setEmployerId(employer.getEmployerId());
        response.setEmployerName(employer.getUser().getName());
        response.setCompanyName(employer.getCompanyName());

        Worker worker = app.getWorker();
        response.setWorkerId(worker.getWorkerId());
        response.setWorkerName(worker.getUser().getName());
        response.setWorkerEmail(worker.getUser().getEmail());
        response.setWorkerPhone(worker.getUser().getPhoneNo());
        response.setQualification(worker.getQualification());
        response.setExperience(worker.getExperience());
        response.setAvailability(worker.getAvailability());
        response.setWorkerLocation(worker.getLocation());
        response.setHoursWork(worker.getHoursWork());
        response.setTrade(worker.getTrade());

        response.setApplyDate(app.getApplyDate());
        response.setStatus(app.getStatus());

        return response;
    }
}
