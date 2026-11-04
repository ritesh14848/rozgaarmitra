package com.rozgaarmitra.repository;

import com.rozgaarmitra.entity.Job;
import com.rozgaarmitra.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatusOrderByPostedDateDesc(JobStatus status);

    List<Job> findByEmployer_EmployerIdOrderByPostedDateDesc(Long employerId);

    @Query("SELECT j FROM Job j WHERE j.status = :status " +
           "AND (:category IS NULL OR LOWER(j.jobCategory) LIKE LOWER(CONCAT('%', :category, '%')) OR LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :category, '%'))) " +
           "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "ORDER BY j.postedDate DESC")
    List<Job> searchJobs(
        @Param("status") JobStatus status,
        @Param("category") String category,
        @Param("location") String location
    );
}
