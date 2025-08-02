package com.ticketsystem.ticketsystem.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ticketsystem.ticketsystem.dto.LoginResponse;
import com.ticketsystem.ticketsystem.dto.UserLoginRequest;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.repo.UserRepo;
import com.ticketsystem.ticketsystem.utils.JwtUtils;

@Service
public class AuthService {
    private PasswordEncoder encoder;
    private final UserRepo repo;
    private JwtUtils jwtUtils;
    public AuthService(UserRepo repo,PasswordEncoder encoder,JwtUtils jwtUtils){
        this.repo=repo;
        this.encoder=encoder;
        this.jwtUtils=jwtUtils;

    }

    public String registerUserService(Users request){
        String hashedPass=encoder.encode(request.getPassword());
        request.setPassword(hashedPass);
        request.setCreatedAt(LocalDateTime.now());
        Users savedUser=repo.save(request);
        return "User SuccessFully Created";

    }

    public LoginResponse loginService(UserLoginRequest request){
        Users user=repo.findByEmail(request.getEmail()).orElseThrow(()->new UsernameNotFoundException("No Such Users"));
        System.out.println(user.getPassword());
        System.out.println(request.getPassword());
          if(!encoder.matches(request.getPassword(),user.getPassword())){
            throw new BadCredentialsException("Username and Password dont match");
          }
            String jwt=jwtUtils.generateToken(String.valueOf(user.getId()), user.getRole().name());
            LoginResponse response=new LoginResponse(user.getId(),jwt,true);
            return response;
        
    }


}
