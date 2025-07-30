package com.ticketsystem.ticketsystem.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketsystem.ticketsystem.dto.ApiWrapper;
import com.ticketsystem.ticketsystem.entity.Ticket;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/ticket")
public class TicketController {
    
    private TicketService ticketService;

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/createticket")
    public ResponseEntity<ApiWrapper<?>> createTicketController( @RequestHeader("Authorization")String authHeader,@Valid @RequestBody Ticket ticket){
        return ResponseEntity.ok(ApiWrapper.success(response,HttpStatus.CREATED));
    }
    
}
