package com.ticketsystem.ticketsystem.service;

import java.time.LocalDateTime;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ticketsystem.ticketsystem.dto.LoginResponse;
import com.ticketsystem.ticketsystem.dto.UserLoginRequest;
import com.ticketsystem.ticketsystem.entity.Organization;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.repo.OrganizationRepo;
import com.ticketsystem.ticketsystem.repo.UserRepo;
import com.ticketsystem.ticketsystem.utils.JwtUtils;

@Service
public class AuthService {
    private PasswordEncoder encoder;
    private final UserRepo repo;
    private JwtUtils jwtUtils;
    private OrganizationRepo orgRepo;
    public AuthService(UserRepo repo,PasswordEncoder encoder,JwtUtils jwtUtils,OrganizationRepo orgRepo){
        this.repo=repo;
        this.encoder=encoder;
        this.jwtUtils=jwtUtils;
        this.orgRepo=orgRepo;

    }

    public String registerUserService(String orgName,Long id,Users request){
       Organization org=orgRepo.findById(id).orElseThrow(()->new UsernameNotFoundException("No Such Organization"));
        String hashedPass=encoder.encode(request.getPassword());
        request.setPassword(hashedPass);
        request.setCreatedAt(LocalDateTime.now());
        request.setOrganization(org);
        repo.save(request);
        return "User SuccessFully Created";

    }

    public LoginResponse loginService(UserLoginRequest request){
        Users user=repo.findByEmail(request.getEmail()).orElseThrow(()->new UsernameNotFoundException("No Such Users"));
          if(!encoder.matches(request.getPassword(),user.getPassword())){
            throw new BadCredentialsException("Username and Password dont match");
          }
            String jwt=jwtUtils.generateToken(String.valueOf(user.getId()), user.getRole().name(),user.getOrganization().getId());
            LoginResponse response=new LoginResponse(user.getId(),jwt,true);
            return response;
        
    }


}
