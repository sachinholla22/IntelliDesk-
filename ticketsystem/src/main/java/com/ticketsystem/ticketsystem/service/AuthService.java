package com.ticketsystem.ticketsystem.service;

import org.springframework.stereotype.Service;

import com.ticketsystem.ticketsystem.dto.ApiResponse;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.repo.UserRepo;

@Service
public class AuthService {
    
    private final UserRepo repo;

    public AuthService(UserRepo repo){
        this.repo=repo;
    }

    public ApiResponse registerUserService(Users request){
        Users savedUser=repo.save(request);
    return new ApiResponse(true, "User successfully registered", savedUser);
    }


}
