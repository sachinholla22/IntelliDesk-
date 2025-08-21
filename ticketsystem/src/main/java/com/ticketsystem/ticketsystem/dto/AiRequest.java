package com.ticketsystem.ticketsystem.dto;

public class AiRequest {
    private Long orgId;
    private Long userId;
    private String role;
    private String question;

    public AiRequest(Long orgId, Long userId, String role, String question) {
        this.orgId = orgId;
        this.userId = userId;
        this.role = role;
        this.question = question;
    }

    // getters & setters
    public Long getOrgId() { return orgId; }
    public void setOrgId(Long orgId) { this.orgId = orgId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}

