package com.ticketsystem.ticketsystem.controller;

import org.springframework.web.bind.annotation.RestController;

import com.ticketsystem.ticketsystem.repo.UserRepo;
import com.ticketsystem.ticketsystem.service.TicketService;
import com.ticketsystem.ticketsystem.service.UserService;
import com.ticketsystem.ticketsystem.utils.JwtUtils;


@RestController
public class ManageTicketsController {


    private final JwtUtils jwtUtils;
    private final TicketService ticketService;
    private final UserService userService;
    private final UserRepo userRepo;

    public ManageTicketsController(JwtUtils jwtUtils, TicketService ticketService, UserService userService,UserRepo userRepo){
        this.jwtUtils=jwtUtils;
        this.ticketService=ticketService;
        this.userService=userService;
        this.userRepo=userRepo;
    }


}
