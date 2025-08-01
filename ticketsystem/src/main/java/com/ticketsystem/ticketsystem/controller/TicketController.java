package com.ticketsystem.ticketsystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ticketsystem.ticketsystem.dto.ApiWrapper;
import com.ticketsystem.ticketsystem.entity.Ticket;
import com.ticketsystem.ticketsystem.service.TicketService;
import com.ticketsystem.ticketsystem.utils.JwtUtils;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/ticket")
public class TicketController {
    
    private JwtUtils jwtUtils;
    private TicketService ticketService;

    public TicketController(JwtUtils jwtUtils, TicketService ticketService){
        this.jwtUtils=jwtUtils;
        this.ticketService=ticketService;
    }

    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping("/createticket")
    public ResponseEntity<ApiWrapper<?>> createTicketController( @RequestHeader("Authorization")String authHeader,@Valid @RequestPart("ticket") Ticket ticket, @RequestPart("photo") List <MultipartFile> photos){
        String jwt=authHeader.replace("Bearer ","");
        String userId=jwtUtils.extractUserId(jwt);
        if(!jwtUtils.isTokenValid(jwt, userId, "CLIENT")){
         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiWrapper.error(HttpStatus.UNAUTHORIZED,"Not valid user","UnAuthorized"));
        }
        String response = ticketService. createTicketService(ticket, photos, userId);
        return ResponseEntity.ok(ApiWrapper.success(response,HttpStatus.CREATED));
    }
    
}
