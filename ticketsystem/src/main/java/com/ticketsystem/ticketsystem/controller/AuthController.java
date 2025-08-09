package com.ticketsystem.ticketsystem.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ticketsystem.ticketsystem.dto.ApiWrapper;
import com.ticketsystem.ticketsystem.dto.LoginResponse;
import com.ticketsystem.ticketsystem.dto.UserLoginRequest;
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
    public ResponseEntity<ApiWrapper<?>> registerUserController(@RequestParam("orgname") String orgName,@RequestParam("orgid") Long id,@Valid @RequestBody Users request){
       
      String  response=service.registerUserService(orgName,id,request);
      return ResponseEntity.ok(ApiWrapper.success(response,HttpStatus.CREATED));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiWrapper<?>>  loginUserController(@Valid @RequestBody UserLoginRequest request){
      if(request==null){
        throw new IllegalArgumentException("Credentials should not empty");
      }
      LoginResponse response=service.loginService(request);
      return ResponseEntity.status(HttpStatus.OK).body(ApiWrapper.success(response,HttpStatus.OK));
    }

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/test")
    public String greet(){
      return "welcome";
    }

}
