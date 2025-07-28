package com.ticketsystem.ticketsystem.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ticketsystem.ticketsystem.dto.ApiResponse;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.repo.UserRepo;

@Service
public class AuthService {
    private PasswordEncoder encoder;
    private final UserRepo repo;

    public AuthService(UserRepo repo,PasswordEncoder encoder){
        this.repo=repo;
        this.encoder=encoder;
    }

    public ApiResponse registerUserService(Users request){
        String hashedPass=encoder.encode(request.getPassword());
        request.setPassword(hashedPass);
        Users savedUser=repo.save(request);
    return new ApiResponse(true, "User successfully registered", savedUser);
    }


}
