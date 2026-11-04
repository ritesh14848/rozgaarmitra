package com.rozgaarmitra.controller;

import com.rozgaarmitra.dto.AuthResponse;
import com.rozgaarmitra.dto.EmployerRegisterRequest;
import com.rozgaarmitra.dto.LoginRequest;
import com.rozgaarmitra.dto.UserResponse;
import com.rozgaarmitra.dto.WorkerRegisterRequest;
import com.rozgaarmitra.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/worker")
    public ResponseEntity<AuthResponse> registerWorker(@Valid @RequestBody WorkerRegisterRequest request) {
        AuthResponse response = authService.registerWorker(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/register/employer")
    public ResponseEntity<AuthResponse> registerEmployer(@Valid @RequestBody EmployerRegisterRequest request) {
        AuthResponse response = authService.registerEmployer(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        UserResponse response = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(response);
    }
}
