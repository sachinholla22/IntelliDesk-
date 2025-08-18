package com.ticketsystem.ticketsystem.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketsystem.ticketsystem.repo.OrganizationRepo;
import com.ticketsystem.ticketsystem.repo.UserRepo;
import com.ticketsystem.ticketsystem.utils.JwtUtils;

@RestController
@RequestMapping("/aichats")
public class AiChatController {
    
    private final UserRepo userRepo;
    private final JwtUtils jwtUtils;
    private final OrganizationRepo orgRepo;

    public AiChatController(UserRepo userRepo,JwtUtils jwtUtils, OrganizationRepo orgRepo){
        this.userRepo=userRepo;
        this.jwtUtils=jwtUtils;
        this.orgRepo=orgRepo;
    }


    

}
