package com.ticketsystem.ticketsystem.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ticketsystem.ticketsystem.entity.Ticket;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.repo.TicketRepository;
import com.ticketsystem.ticketsystem.repo.UserRepo;

@Service
public class TicketServiceImpl extends TicketService{
    
    private final TicketRepository ticketRepo;
    private final UserRepo userRepo;
    public TicketServiceImpl(TicketRepository ticketRepo,UserRepo userRepo){
    this.ticketRepo=ticketRepo;
    this.userRepo=userRepo;
    }


    @Override
    public String createTicketService(Ticket ticket, List<MultipartFile> photos,String userId){
        Users user=userRepo.findById(Long.valueOf(userId)).orElseThrow(()->new UsernameNotFoundException("No particular User"));
        ticket.setClient(user);
        ticket.setCreatedAt(LocalDateTime.now());
        
    }

}
