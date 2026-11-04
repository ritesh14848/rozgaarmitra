package com.rozgaarmitra.controller;

import com.rozgaarmitra.dto.ApplicationResponse;
import com.rozgaarmitra.dto.ApplicationStatusUpdateRequest;
import com.rozgaarmitra.dto.EmployerProfileResponse;
import com.rozgaarmitra.dto.EmployerProfileUpdateRequest;
import com.rozgaarmitra.dto.JobResponse;
import com.rozgaarmitra.service.ApplicationService;
import com.rozgaarmitra.service.EmployerService;
import com.rozgaarmitra.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employer")
public class EmployerController {

    private final EmployerService employerService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    public EmployerController(EmployerService employerService,
                              JobService jobService,
                              ApplicationService applicationService) {
        this.employerService = employerService;
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<EmployerProfileResponse> getProfile(Authentication authentication) {
        EmployerProfileResponse response = employerService.getProfile(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<EmployerProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody EmployerProfileUpdateRequest request) {
        EmployerProfileResponse response = employerService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/jobs")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<JobResponse>> getMyJobs(Authentication authentication) {
        List<JobResponse> jobs = jobService.getJobsByEmployer(authentication.getName());
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/applications")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<ApplicationResponse>> getAllApplications(Authentication authentication) {
        List<ApplicationResponse> apps = applicationService.getApplicationsByEmployer(authentication.getName());
        return ResponseEntity.ok(apps);
    }

    @GetMapping("/jobs/{jobId}/applications")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsForJob(
            Authentication authentication,
            @PathVariable Long jobId) {
        List<ApplicationResponse> apps = applicationService.getApplicationsForJob(authentication.getName(), jobId);
        return ResponseEntity.ok(apps);
    }

    @PatchMapping("/applications/{applicationId}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            Authentication authentication,
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        ApplicationResponse response = applicationService.updateApplicationStatus(
                authentication.getName(),
                applicationId,
                request.getStatus()
        );
        return ResponseEntity.ok(response);
    }
}
