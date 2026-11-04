package com.rozgaarmitra.controller;

import com.rozgaarmitra.dto.ApplicationRequest;
import com.rozgaarmitra.dto.ApplicationResponse;
import com.rozgaarmitra.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<ApplicationResponse> applyForJob(
            Authentication authentication,
            @Valid @RequestBody ApplicationRequest request) {
        ApplicationResponse response = applicationService.applyForJob(authentication.getName(), request.getJobId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(Authentication authentication) {
        List<ApplicationResponse> applications = applicationService.getApplicationsByWorker(authentication.getName());
        return ResponseEntity.ok(applications);
    }
}
