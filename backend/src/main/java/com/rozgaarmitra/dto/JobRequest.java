package com.rozgaarmitra.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(min = 3, max = 150, message = "Job title must be between 3 and 150 characters")
    private String jobTitle;

    @NotBlank(message = "Job category / trade is required")
    private String jobCategory;

    @NotBlank(message = "Job description is required")
    @Size(min = 10, message = "Job description must be at least 10 characters")
    private String description;

    @NotNull(message = "Salary is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be greater than 0")
    private Double salary;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Experience required is mandatory")
    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experienceRequired;

    @NotNull(message = "Vacancy count is required")
    @Min(value = 1, message = "Vacancy count must be at least 1")
    private Integer vacancyCount;

    @NotNull(message = "Last date to apply is required")
    @FutureOrPresent(message = "Last date to apply cannot be in the past")
    private LocalDate lastDateToApply;

    public JobRequest() {
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

    public LocalDate getLastDateToApply() {
        return lastDateToApply;
    }

    public void setLastDateToApply(LocalDate lastDateToApply) {
        this.lastDateToApply = lastDateToApply;
    }
}
