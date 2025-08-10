package com.ticketsystem.ticketsystem.controller;


import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketsystem.ticketsystem.dto.ApiWrapper;
import com.ticketsystem.ticketsystem.dto.TicketResponseDTO;
import com.ticketsystem.ticketsystem.repo.UserRepo;
import com.ticketsystem.ticketsystem.service.TicketService;
import com.ticketsystem.ticketsystem.service.UserService;
import com.ticketsystem.ticketsystem.utils.JwtUtils;


@RestController
@RequestMapping("/ticket")
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

    @GetMapping("/getalltickets")
    public ResponseEntity<ApiWrapper<?>> getAllTickets(){
    Optional<List<TicketResponseDTO>> list=ticketService.getAllTickets();
     if(list.isEmpty()){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiWrapper.error(HttpStatus.NOT_FOUND,"No tickets","Not Found"));
     }
     return ResponseEntity.status(HttpStatus.OK).body(ApiWrapper.success(list,HttpStatus.OK));
}

}