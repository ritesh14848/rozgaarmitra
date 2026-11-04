package com.rozgaarmitra.controller;

import com.rozgaarmitra.dto.JobRequest;
import com.rozgaarmitra.dto.JobResponse;
import com.rozgaarmitra.dto.JobStatusUpdateRequest;
import com.rozgaarmitra.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getJobs(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        if ((category != null && !category.trim().isEmpty()) || (location != null && !location.trim().isEmpty())) {
            return ResponseEntity.ok(jobService.searchJobs(category, location));
        }
        return ResponseEntity.ok(jobService.getAllOpenJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponse> createJob(
            Authentication authentication,
            @Valid @RequestBody JobRequest request) {
        JobResponse response = jobService.createJob(authentication.getName(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponse> updateJob(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request) {
        JobResponse response = jobService.updateJob(authentication.getName(), id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponse> updateJobStatus(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody JobStatusUpdateRequest request) {
        JobResponse response = jobService.updateJobStatus(authentication.getName(), id, request.getStatus());
        return ResponseEntity.ok(response);
    }
}
