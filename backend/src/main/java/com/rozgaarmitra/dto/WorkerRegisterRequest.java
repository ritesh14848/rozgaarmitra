package com.rozgaarmitra.dto;

import com.rozgaarmitra.entity.HoursWork;
import com.rozgaarmitra.entity.Trade;
import jakarta.validation.constraints.*;

public class WorkerRegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9+ -]{8,15}$", message = "Phone number must be valid (8 to 15 digits)")
    private String phoneNo;

    @NotBlank(message = "Qualification is required")
    private String qualification;

    @NotNull(message = "Experience is required")
    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience;

    @NotBlank(message = "Availability is required (e.g. Immediate, Weekdays)")
    private String availability;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Hours of work is required (FULL_TIME or PART_TIME)")
    private HoursWork hoursWork;

    @NotNull(message = "Trade is required")
    private Trade trade;

    public WorkerRegisterRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public HoursWork getHoursWork() {
        return hoursWork;
    }

    public void setHoursWork(HoursWork hoursWork) {
        this.hoursWork = hoursWork;
    }

    public Trade getTrade() {
        return trade;
    }

    public void setTrade(Trade trade) {
        this.trade = trade;
    }
}
