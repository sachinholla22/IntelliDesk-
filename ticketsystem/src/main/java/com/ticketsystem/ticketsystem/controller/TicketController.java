package com.ticketsystem.ticketsystem.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ticketsystem.ticketsystem.dto.ApiError;
import com.ticketsystem.ticketsystem.dto.ApiWrapper;
import com.ticketsystem.ticketsystem.dto.TicketResponseDTO;
import com.ticketsystem.ticketsystem.entity.Ticket;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.repo.UserRepo;
import com.ticketsystem.ticketsystem.service.TicketService;
import com.ticketsystem.ticketsystem.utils.JwtUtils;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/ticket")
public class TicketController {
    
    private JwtUtils jwtUtils;
    private TicketService ticketService;
    private UserRepo userRepo;
    public TicketController(JwtUtils jwtUtils, TicketService ticketService, UserRepo userRepo){
        this.jwtUtils=jwtUtils;
        this.ticketService=ticketService;
        this.userRepo=userRepo;
    }

    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping(value="/createticket",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiWrapper<?>> createTicketController( @RequestHeader("Authorization")String authHeader,@Valid @RequestPart("ticket") Ticket ticket, @RequestPart("photo") List <MultipartFile> photos){
        String jwt=authHeader.replace("Bearer ","");
        String userId=jwtUtils.extractUserId(jwt);
        
        Users getOrgId=userRepo.findById(Long.valueOf(userId)).orElseThrow(()->new IllegalArgumentException("No such Users"));
        Long orgId=getOrgId.getOrganization().getId();
        if(!jwtUtils.isTokenValid(jwt, userId, "CLIENT",orgId)){
         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiWrapper.error(HttpStatus.UNAUTHORIZED,"Not valid user","UnAuthorized"));
        }
        String response = ticketService. createTicketService(ticket, photos, userId);
        return ResponseEntity.ok(ApiWrapper.success(response,HttpStatus.CREATED));
    }
    

    @GetMapping("/getTickets")
    public ResponseEntity<ApiWrapper<?>> getNullOpenTicketsController(@RequestParam("status") String status){
        Optional<List<TicketResponseDTO>> ticket=ticketService.getNullOpenTicketService(status);
        if(ticket.isPresent()){
            return ResponseEntity.ok(ApiWrapper.success(ticket.get(),HttpStatus.OK));
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiWrapper.error(HttpStatus.NOT_FOUND,"No Open Tickets","No Open Tickets"));
        }
        

    }
}
