package com.rozgaarmitra.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long jobId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "job_category", nullable = false)
    private String jobCategory;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "salary", nullable = false)
    private Double salary;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "experience_required", nullable = false)
    private Integer experienceRequired;

    @Column(name = "vacancy_count", nullable = false)
    private Integer vacancyCount;

    @Column(name = "posted_date", nullable = false)
    private LocalDate postedDate;

    @Column(name = "last_date_to_apply", nullable = false)
    private LocalDate lastDateToApply;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private JobStatus status;

    public Job() {
    }

    public Job(Long jobId, Employer employer, String jobTitle, String jobCategory, String description,
               Double salary, String location, Integer experienceRequired, Integer vacancyCount,
               LocalDate postedDate, LocalDate lastDateToApply, JobStatus status) {
        this.jobId = jobId;
        this.employer = employer;
        this.jobTitle = jobTitle;
        this.jobCategory = jobCategory;
        this.description = description;
        this.salary = salary;
        this.location = location;
        this.experienceRequired = experienceRequired;
        this.vacancyCount = vacancyCount;
        this.postedDate = postedDate;
        this.lastDateToApply = lastDateToApply;
        this.status = status;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Employer getEmployer() {
        return employer;
    }

    public void setEmployer(Employer employer) {
        this.employer = employer;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobCategory() {
        return jobCategory;
    }

    public void setJobCategory(String jobCategory) {
        this.jobCategory = jobCategory;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getExperienceRequired() {
        return experienceRequired;
    }

    public void setExperienceRequired(Integer experienceRequired) {
        this.experienceRequired = experienceRequired;
    }

    public Integer getVacancyCount() {
        return vacancyCount;
    }

    public void setVacancyCount(Integer vacancyCount) {
        this.vacancyCount = vacancyCount;
    }

    public LocalDate getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(LocalDate postedDate) {
        this.postedDate = postedDate;
    }

    public LocalDate getLastDateToApply() {
        return lastDateToApply;
    }

    public void setLastDateToApply(LocalDate lastDateToApply) {
        this.lastDateToApply = lastDateToApply;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }
}
