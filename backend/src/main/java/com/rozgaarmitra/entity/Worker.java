package com.rozgaarmitra.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "workers")
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "worker_id")
    private Long workerId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "qualification", nullable = false)
    private String qualification;

    @Column(name = "experience", nullable = false)
    private Integer experience;

    @Column(name = "availability", nullable = false)
    private String availability;

    @Column(name = "location", nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "hours_work", nullable = false)
    private HoursWork hoursWork;

    @Enumerated(EnumType.STRING)
    @Column(name = "trade", nullable = false)
    private Trade trade;

    public Worker() {
    }

    public Worker(Long workerId, User user, String qualification, Integer experience, String availability, String location, HoursWork hoursWork, Trade trade) {
        this.workerId = workerId;
        this.user = user;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
