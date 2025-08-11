package com.ticketsystem.ticketsystem.service;

import java.time.LocalDateTime;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ticketsystem.ticketsystem.entity.Comments;
import com.ticketsystem.ticketsystem.entity.Ticket;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.exception.TicketNotFoundException;
import com.ticketsystem.ticketsystem.repo.CommentRepo;
import com.ticketsystem.ticketsystem.repo.TicketRepository;
import com.ticketsystem.ticketsystem.repo.UserRepo;

@Service
public class CommentService {
    
    private final CommentRepo commentRepo;
    private final TicketRepository ticketRepo;
    private final UserRepo userRepo;

    public CommentService(CommentRepo commentRepo, TicketRepository ticketRepo,UserRepo userRepo){
        this.commentRepo=commentRepo;
        this.ticketRepo=ticketRepo;
        this.userRepo=userRepo;
    }

    public String addCommentService(Long ticketId, Long userId,Comments comment){

        Users user=userRepo.findById(userId).orElseThrow(()-> new UsernameNotFoundException("No such users"));
        
        Ticket ticket=ticketRepo.findById(ticketId).orElseThrow(()-> new UsernameNotFoundException("No such Tickets"));
        comment.setCommentedBy(user);
        comment.setTicket(ticket);
        comment.setLastUpdated(LocalDateTime.now());
        commentRepo.save(comment);
        
        return "Comments Added Successfully";
        

    }

}
