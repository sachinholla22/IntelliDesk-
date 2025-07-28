package com.ticketsystem.ticketsystem.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketsystem.ticketsystem.dto.ApiResponse;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.service.AuthService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    

    private final AuthService service;
    public AuthController(AuthService service){
        this.service=service;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUserController(@Valid @RequestBody Users request){
       
      ApiResponse response=service.registerUserService(request);
      return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

}
