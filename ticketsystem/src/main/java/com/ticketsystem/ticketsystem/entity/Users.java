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
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Users {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
   
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Invalid email")
    @Column(nullable = false, unique = true)
    private String email;
    private String password;

    private LocalDateTime createdAt;
    @Enumerated(EnumType.STRING)
    private Role role;
    

}

