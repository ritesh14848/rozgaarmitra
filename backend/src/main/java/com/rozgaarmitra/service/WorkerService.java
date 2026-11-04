package com.rozgaarmitra.service;

import com.rozgaarmitra.dto.WorkerProfileResponse;
import com.rozgaarmitra.dto.WorkerProfileUpdateRequest;
import com.rozgaarmitra.entity.User;
import com.rozgaarmitra.entity.Worker;
import com.rozgaarmitra.exception.ResourceNotFoundException;
import com.rozgaarmitra.repository.UserRepository;
import com.rozgaarmitra.repository.WorkerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;

    public WorkerService(WorkerRepository workerRepository, UserRepository userRepository) {
        this.workerRepository = workerRepository;
        this.userRepository = userRepository;
    }

    public Worker getWorkerByEmail(String email) {
        return workerRepository.findByUser_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found for email: " + email));
    }

    @Transactional(readOnly = true)
    public WorkerProfileResponse getProfile(String email) {
        Worker worker = getWorkerByEmail(email);
        User user = worker.getUser();

        return new WorkerProfileResponse(
                worker.getWorkerId(),
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNo(),
                user.getRole(),
                worker.getQualification(),
                worker.getExperience(),
                worker.getAvailability(),
                worker.getLocation(),
                worker.getHoursWork(),
                worker.getTrade()
        );
    }

    @Transactional
    public WorkerProfileResponse updateProfile(String email, WorkerProfileUpdateRequest request) {
        Worker worker = getWorkerByEmail(email);
        User user = worker.getUser();

        user.setName(request.getName().trim());
        user.setPhoneNo(request.getPhoneNo().trim());
        userRepository.save(user);

        worker.setQualification(request.getQualification().trim());
        worker.setExperience(request.getExperience());
        worker.setAvailability(request.getAvailability().trim());
        worker.setLocation(request.getLocation().trim());
        worker.setHoursWork(request.getHoursWork());
        worker.setTrade(request.getTrade());
        Worker savedWorker = workerRepository.save(worker);

        return new WorkerProfileResponse(
                savedWorker.getWorkerId(),
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNo(),
                user.getRole(),
                savedWorker.getQualification(),
                savedWorker.getExperience(),
                savedWorker.getAvailability(),
                savedWorker.getLocation(),
                savedWorker.getHoursWork(),
                savedWorker.getTrade()
        );
    }
}
