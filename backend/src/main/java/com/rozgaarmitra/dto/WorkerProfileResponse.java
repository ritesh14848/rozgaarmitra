package com.rozgaarmitra.dto;

import com.rozgaarmitra.entity.HoursWork;
import com.rozgaarmitra.entity.Role;
import com.rozgaarmitra.entity.Trade;

public class WorkerProfileResponse {
    private Long workerId;
    private Long userId;
    private String name;
    private String email;
    private String phoneNo;
    private Role role;
    private String qualification;
    private Integer experience;
    private String availability;
    private String location;
    private HoursWork hoursWork;
    private Trade trade;

    public WorkerProfileResponse() {
    }

    public WorkerProfileResponse(Long workerId, Long userId, String name, String email, String phoneNo,
                                 Role role, String qualification, Integer experience, String availability,
                                 String location, HoursWork hoursWork, Trade trade) {
        this.workerId = workerId;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phoneNo = phoneNo;
        this.role = role;
        this.qualification = qualification;
        this.experience = experience;
        this.availability = availability;
        this.location = location;
        this.hoursWork = hoursWork;
        this.trade = trade;
    }

    public Long getWorkerId() {
        return workerId;
    }

    public void setWorkerId(Long workerId) {
        this.workerId = workerId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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
