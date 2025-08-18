package com.ticketsystem.ticketsystem.entity;

import java.time.LocalDateTime;

import com.ticketsystem.ticketsystem.enums.OrgPlans;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="organization")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Organization {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name="org_name")
    @NotBlank
    private String orgName;

    @Column(name="org_email",unique=true)
    @NotBlank
    @Email(message="Please maintain the Email format")
    private String orgEmail;

    @Column(name="org_address")
    @NotBlank
    private String orgAddr;

    @Column(name="org_password")
    @NotBlank
    private String orgPassword;

    @Column(name="org_phone")
    @NotBlank
    private Long orgPhone;

    @Column(name="industry_type")
    @NotBlank
    private String industryType;
    
    @Column(name="org_plan")
    @NotBlank
    @Enumerated(EnumType.STRING)
    private OrgPlans orgPlan;


    @Column(name="created_at")
    private LocalDateTime createdAt;

}
