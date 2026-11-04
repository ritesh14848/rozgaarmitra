package com.rozgaarmitra.service;

import com.rozgaarmitra.dto.EmployerProfileResponse;
import com.rozgaarmitra.dto.EmployerProfileUpdateRequest;
import com.rozgaarmitra.entity.Employer;
import com.rozgaarmitra.entity.User;
import com.rozgaarmitra.exception.ResourceNotFoundException;
import com.rozgaarmitra.repository.EmployerRepository;
import com.rozgaarmitra.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployerService {

    private final EmployerRepository employerRepository;
    private final UserRepository userRepository;

    public EmployerService(EmployerRepository employerRepository, UserRepository userRepository) {
        this.employerRepository = employerRepository;
        this.userRepository = userRepository;
    }

    public Employer getEmployerByEmail(String email) {
        return employerRepository.findByUser_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found for email: " + email));
    }

    @Transactional(readOnly = true)
    public EmployerProfileResponse getProfile(String email) {
        Employer employer = getEmployerByEmail(email);
        User user = employer.getUser();

        return new EmployerProfileResponse(
                employer.getEmployerId(),
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNo(),
                user.getRole(),
                employer.getCompanyName(),
                employer.getIndustryType(),
                employer.getAddress()
        );
    }

    @Transactional
    public EmployerProfileResponse updateProfile(String email, EmployerProfileUpdateRequest request) {
        Employer employer = getEmployerByEmail(email);
        User user = employer.getUser();

        user.setName(request.getName().trim());
        user.setPhoneNo(request.getPhoneNo().trim());
        userRepository.save(user);

        employer.setCompanyName(request.getCompanyName() != null ? request.getCompanyName().trim() : null);
        employer.setIndustryType(request.getIndustryType().trim());
        employer.setAddress(request.getAddress().trim());
        Employer savedEmployer = employerRepository.save(employer);

        return new EmployerProfileResponse(
                savedEmployer.getEmployerId(),
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNo(),
                user.getRole(),
                savedEmployer.getCompanyName(),
                savedEmployer.getIndustryType(),
                savedEmployer.getAddress()
        );
    }
}
