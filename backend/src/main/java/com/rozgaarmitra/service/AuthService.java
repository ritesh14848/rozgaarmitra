package com.rozgaarmitra.service;

import com.rozgaarmitra.dto.*;
import com.rozgaarmitra.entity.Employer;
import com.rozgaarmitra.entity.Role;
import com.rozgaarmitra.entity.User;
import com.rozgaarmitra.entity.Worker;
import com.rozgaarmitra.exception.BadRequestException;
import com.rozgaarmitra.exception.DuplicateResourceException;
import com.rozgaarmitra.exception.ResourceNotFoundException;
import com.rozgaarmitra.repository.EmployerRepository;
import com.rozgaarmitra.repository.UserRepository;
import com.rozgaarmitra.repository.WorkerRepository;
import com.rozgaarmitra.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final EmployerRepository employerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       WorkerRepository workerRepository,
                       EmployerRepository employerRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.employerRepository = employerRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse registerWorker(WorkerRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new DuplicateResourceException("An account with this email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNo(request.getPhoneNo().trim());
        user.setRole(Role.WORKER);
        User savedUser = userRepository.save(user);

        Worker worker = new Worker();
        worker.setUser(savedUser);
        worker.setQualification(request.getQualification().trim());
        worker.setExperience(request.getExperience());
        worker.setAvailability(request.getAvailability().trim());
        worker.setLocation(request.getLocation().trim());
        worker.setHoursWork(request.getHoursWork());
        worker.setTrade(request.getTrade());
        Worker savedWorker = workerRepository.save(worker);

        String token = jwtUtils.generateTokenFromEmail(savedUser.getEmail(), savedUser.getUserId(), savedUser.getRole().name());

        return new AuthResponse(
                token,
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedWorker.getWorkerId()
        );
    }

    @Transactional
    public AuthResponse registerEmployer(EmployerRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new DuplicateResourceException("An account with this email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNo(request.getPhoneNo().trim());
        user.setRole(Role.EMPLOYER);
        User savedUser = userRepository.save(user);

        Employer employer = new Employer();
        employer.setUser(savedUser);
        employer.setCompanyName(request.getCompanyName() != null ? request.getCompanyName().trim() : null);
        employer.setIndustryType(request.getIndustryType().trim());
        employer.setAddress(request.getAddress().trim());
        Employer savedEmployer = employerRepository.save(employer);

        String token = jwtUtils.generateTokenFromEmail(savedUser.getEmail(), savedUser.getUserId(), savedUser.getRole().name());

        return new AuthResponse(
                token,
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedEmployer.getEmployerId()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        Long profileId = null;
        if (user.getRole() == Role.WORKER) {
            Worker worker = workerRepository.findByUser_UserId(user.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found"));
            profileId = worker.getWorkerId();
        } else if (user.getRole() == Role.EMPLOYER) {
            Employer employer = employerRepository.findByUser_UserId(user.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));
            profileId = employer.getEmployerId();
        }

        String token = jwtUtils.generateTokenFromEmail(user.getEmail(), user.getUserId(), user.getRole().name());

        return new AuthResponse(
                token,
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                profileId
        );
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Long profileId = null;
        if (user.getRole() == Role.WORKER) {
            profileId = workerRepository.findByUser_UserId(user.getUserId())
                    .map(Worker::getWorkerId)
                    .orElse(null);
        } else if (user.getRole() == Role.EMPLOYER) {
            profileId = employerRepository.findByUser_UserId(user.getUserId())
                    .map(Employer::getEmployerId)
                    .orElse(null);
        }

        return new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNo(),
                user.getRole(),
                profileId
        );
    }
}
