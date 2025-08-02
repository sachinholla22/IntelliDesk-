package com.ticketsystem.ticketsystem.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginRequest {

    @NotBlank(message="Email Shouln't be blank")
    @Email(message="Please maintain correct email format")
    public String email;

    @NotBlank(message="Password shouldn't be empty")
    public String password;

    private LocalDateTime loggedTime;
}
