package com.rozgaarmitra.repository;

import com.rozgaarmitra.entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, Long> {
    Optional<Employer> findByUser_UserId(Long userId);
    Optional<Employer> findByUser_Email(String email);
}
