package com.ticketsystem.ticketsystem.entity;

import java.time.LocalDateTime;

import com.ticketsystem.ticketsystem.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users",uniqueConstraints=@UniqueConstraint(columnNames={"org_id","email"}))
public class Users {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name="org_id")
    private Organization organization;

    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Invalid email")
    @Column(nullable = false)
    private String email;
    
    @NotNull
    private String password;

    private LocalDateTime createdAt;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    private Role role;
    

}

