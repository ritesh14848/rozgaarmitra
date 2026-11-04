package com.rozgaarmitra.controller;

import com.rozgaarmitra.dto.WorkerProfileResponse;
import com.rozgaarmitra.dto.WorkerProfileUpdateRequest;
import com.rozgaarmitra.service.WorkerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/worker")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<WorkerProfileResponse> getProfile(Authentication authentication) {
        WorkerProfileResponse response = workerService.getProfile(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<WorkerProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody WorkerProfileUpdateRequest request) {
        WorkerProfileResponse response = workerService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }
}
