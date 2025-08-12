package com.ticketsystem.ticketsystem.dto;

import java.time.LocalDateTime;

import com.ticketsystem.ticketsystem.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private String organizationName; // Extracted from Organization entity
    private LocalDateTime createdAt;
    private Role role;
}

