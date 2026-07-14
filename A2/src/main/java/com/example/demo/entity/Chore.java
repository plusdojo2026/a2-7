package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "chores")
public class Chore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chores_id")
    private Integer choresId;

    @Column(name = "chores_name")
    private String choresName;

    @Column(name = "priority")
    private String priority;

    @Column(name = "estimated_time")
    private Integer estimatedTime;

    @Column(name = "point")
    private Integer point;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Integer getChoresId() {
        return choresId;
    }

    public void setChoresId(Integer choresId) {
        this.choresId = choresId;
    }

    public String getChoresName() {
        return choresName;
    }

    public void setChoresName(String choresName) {
        this.choresName = choresName;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Integer getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Integer estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public Integer getPoint() {
        return point;
    }

    public void setPoint(Integer point) {
        this.point = point;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}