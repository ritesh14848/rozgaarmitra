package com.rozgaarmitra.service;

import com.rozgaarmitra.dto.JobRequest;
import com.rozgaarmitra.dto.JobResponse;
import com.rozgaarmitra.entity.Employer;
import com.rozgaarmitra.entity.Job;
import com.rozgaarmitra.entity.JobStatus;
import com.rozgaarmitra.exception.BadRequestException;
import com.rozgaarmitra.exception.ResourceNotFoundException;
import com.rozgaarmitra.exception.UnauthorizedException;
import com.rozgaarmitra.repository.ApplicationRepository;
import com.rozgaarmitra.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final EmployerService employerService;
    private final ApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository,
                      EmployerService employerService,
                      ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.employerService = employerService;
        this.applicationRepository = applicationRepository;
    }

    @Transactional
    public JobResponse createJob(String employerEmail, JobRequest request) {
        Employer employer = employerService.getEmployerByEmail(employerEmail);

        if (request.getLastDateToApply().isBefore(LocalDate.now())) {
            throw new BadRequestException("Last date to apply cannot be in the past.");
        }

        Job job = new Job();
        job.setEmployer(employer);
        job.setJobTitle(request.getJobTitle().trim());
        job.setJobCategory(request.getJobCategory().trim());
        job.setDescription(request.getDescription().trim());
        job.setSalary(request.getSalary());
        job.setLocation(request.getLocation().trim());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setVacancyCount(request.getVacancyCount());
        job.setPostedDate(LocalDate.now());
        job.setLastDateToApply(request.getLastDateToApply());
        job.setStatus(JobStatus.OPEN);

        Job savedJob = jobRepository.save(job);
        return mapToResponse(savedJob, 0);
    }

    @Transactional
    public JobResponse updateJob(String employerEmail, Long jobId, JobRequest request) {
        Employer employer = employerService.getEmployerByEmail(employerEmail);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        if (!job.getEmployer().getEmployerId().equals(employer.getEmployerId())) {
            throw new UnauthorizedException("You are not authorized to edit this job.");
        }

        if (request.getLastDateToApply().isBefore(job.getPostedDate())) {
            throw new BadRequestException("Last date to apply cannot be before the original posted date.");
        }

        job.setJobTitle(request.getJobTitle().trim());
        job.setJobCategory(request.getJobCategory().trim());
        job.setDescription(request.getDescription().trim());
        job.setSalary(request.getSalary());
        job.setLocation(request.getLocation().trim());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setVacancyCount(request.getVacancyCount());
        job.setLastDateToApply(request.getLastDateToApply());

        Job updated = jobRepository.save(job);
        int appCount = applicationRepository.findByJob_JobIdOrderByApplyDateDesc(jobId).size();
        return mapToResponse(updated, appCount);
    }

    @Transactional
    public JobResponse updateJobStatus(String employerEmail, Long jobId, JobStatus status) {
        Employer employer = employerService.getEmployerByEmail(employerEmail);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        if (!job.getEmployer().getEmployerId().equals(employer.getEmployerId())) {
            throw new UnauthorizedException("You are not authorized to update status for this job.");
        }

        job.setStatus(status);
        Job updated = jobRepository.save(job);
        int appCount = applicationRepository.findByJob_JobIdOrderByApplyDateDesc(jobId).size();
        return mapToResponse(updated, appCount);
    }

    @Transactional(readOnly = true)
    public JobResponse getJobById(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));
        int appCount = applicationRepository.findByJob_JobIdOrderByApplyDateDesc(jobId).size();
        return mapToResponse(job, appCount);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getAllOpenJobs() {
        return jobRepository.findByStatusOrderByPostedDateDesc(JobStatus.OPEN)
                .stream()
                .map(job -> {
                    int count = applicationRepository.findByJob_JobIdOrderByApplyDateDesc(job.getJobId()).size();
                    return mapToResponse(job, count);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobResponse> searchJobs(String category, String location) {
        String catParam = (category != null && !category.trim().isEmpty()) ? category.trim() : null;
        String locParam = (location != null && !location.trim().isEmpty()) ? location.trim() : null;

        return jobRepository.searchJobs(JobStatus.OPEN, catParam, locParam)
                .stream()
                .map(job -> {
                    int count = applicationRepository.findByJob_JobIdOrderByApplyDateDesc(job.getJobId()).size();
                    return mapToResponse(job, count);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getJobsByEmployer(String employerEmail) {
        Employer employer = employerService.getEmployerByEmail(employerEmail);
        return jobRepository.findByEmployer_EmployerIdOrderByPostedDateDesc(employer.getEmployerId())
                .stream()
                .map(job -> {
                    int count = applicationRepository.findByJob_JobIdOrderByApplyDateDesc(job.getJobId()).size();
                    return mapToResponse(job, count);
                })
                .collect(Collectors.toList());
    }

    public Job findEntityById(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));
    }

    public JobResponse mapToResponse(Job job, int applicationCount) {
        JobResponse response = new JobResponse();
        response.setJobId(job.getJobId());
        response.setEmployerId(job.getEmployer().getEmployerId());
        response.setEmployerName(job.getEmployer().getUser().getName());
        response.setCompanyName(job.getEmployer().getCompanyName());
        response.setEmployerPhone(job.getEmployer().getUser().getPhoneNo());
        response.setJobTitle(job.getJobTitle());
        response.setJobCategory(job.getJobCategory());
        response.setDescription(job.getDescription());
        response.setSalary(job.getSalary());
        response.setLocation(job.getLocation());
        response.setExperienceRequired(job.getExperienceRequired());
        response.setVacancyCount(job.getVacancyCount());
        response.setPostedDate(job.getPostedDate());
        response.setLastDateToApply(job.getLastDateToApply());
        response.setStatus(job.getStatus());
        response.setApplicationCount(applicationCount);
        return response;
    }
}
