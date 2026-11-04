package com.rozgaarmitra.repository;

import com.rozgaarmitra.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByWorker_WorkerIdAndJob_JobId(Long workerId, Long jobId);

    List<Application> findByWorker_WorkerIdOrderByApplyDateDesc(Long workerId);

    List<Application> findByJob_JobIdOrderByApplyDateDesc(Long jobId);

    List<Application> findByJob_Employer_EmployerIdOrderByApplyDateDesc(Long employerId);

    Optional<Application> findByApplicationIdAndJob_Employer_EmployerId(Long applicationId, Long employerId);
}
