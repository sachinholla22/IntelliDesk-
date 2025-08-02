package com.ticketsystem.ticketsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    

    private Long userId;
    private String jwt;
    private boolean isCorrectCredentials;
}
