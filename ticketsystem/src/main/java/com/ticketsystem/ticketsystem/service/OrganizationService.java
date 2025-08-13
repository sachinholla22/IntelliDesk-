package com.ticketsystem.ticketsystem.service;


import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ticketsystem.ticketsystem.dto.OrganizationResponseDTO;
import com.ticketsystem.ticketsystem.entity.Organization;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.enums.Role;
import com.ticketsystem.ticketsystem.repo.OrganizationRepo;
import com.ticketsystem.ticketsystem.repo.UserRepo;

import jakarta.transaction.Transactional;

@Service
public class OrganizationService {
    

    private final OrganizationRepo orgRepo;
    private final UserRepo userRepo;
    private final PasswordEncoder encoder;

    public OrganizationService(OrganizationRepo orgRepo, UserRepo userRepo, PasswordEncoder encoder){
        this.orgRepo=orgRepo;
        this.userRepo=userRepo;
        this.encoder=encoder;
    }


    @Transactional
    public OrganizationResponseDTO organizationResgisterService(Organization request){
    
        String pass=encoder.encode(request.getOrgPassword());
        request.setOrgPassword(pass);
        request.setCreatedAt(LocalDateTime.now());
        orgRepo.save(request);
        Users user=new Users();
        
        user.setName(request.getOrgName());
        user.setEmail(request.getOrgEmail());
        user.setOrganization(request);
        user.setPassword(pass);
        user.setRole(Role.ADMIN);
        user.setCreatedAt(LocalDateTime.now());
        userRepo.save(user);

        OrganizationResponseDTO response=new OrganizationResponseDTO();
        response.setId(request.getId());
        response.setName(request.getOrgName());
       return response;
    }
}
