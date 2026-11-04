package com.rozgaarmitra.dto;

import com.rozgaarmitra.entity.Role;

public class EmployerProfileResponse {
    private Long employerId;
    private Long userId;
    private String name;
    private String email;
    private String phoneNo;
    private Role role;
    private String companyName;
    private String industryType;
    private String address;

    public EmployerProfileResponse() {
    }

    public EmployerProfileResponse(Long employerId, Long userId, String name, String email, String phoneNo,
                                   Role role, String companyName, String industryType, String address) {
        this.employerId = employerId;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phoneNo = phoneNo;
        this.role = role;
        this.companyName = companyName;
        this.industryType = industryType;
        this.address = address;
    }

    public Long getEmployerId() {
        return employerId;
    }

    public void setEmployerId(Long employerId) {
        this.employerId = employerId;
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getIndustryType() {
        return industryType;
    }

    public void setIndustryType(String industryType) {
        this.industryType = industryType;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
