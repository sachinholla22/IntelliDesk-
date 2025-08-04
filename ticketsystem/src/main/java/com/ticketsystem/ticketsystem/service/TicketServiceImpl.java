package com.ticketsystem.ticketsystem.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ticketsystem.ticketsystem.entity.Ticket;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.repo.TicketRepository;
import com.ticketsystem.ticketsystem.repo.UserRepo;

@Service
public class TicketServiceImpl implements TicketService{
    
    private final TicketRepository ticketRepo;
    private final UserRepo userRepo;
    private final FileStorageService fileStore;
    
    public TicketServiceImpl(TicketRepository ticketRepo,UserRepo userRepo,FileStorageService fileStore){
    this.ticketRepo=ticketRepo;
    this.userRepo=userRepo;
    this.fileStore=fileStore;
    }


    @Override
    public String createTicketService(Ticket ticket, List<MultipartFile> photos,String userId){
        Users user=userRepo.findById(Long.valueOf(userId)).orElseThrow(()->new UsernameNotFoundException("No particular User"));
        ticket.setClient(user);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setOrganization(user.getOrganization());

        List<String>photosUrl=new ArrayList<>();
        for(MultipartFile photo:photos){
        String paths=fileStore.storeFiles(photo);
        photosUrl.add(paths);
        }

        ticket.setPhotoPath(photosUrl);
        ticketRepo.save(ticket);
        return "Ticket Created Successfully";
        
    }

    @Override
    public Ticket getNullOpenTicketService(String status){
        Optional<Ticket> ticket=ticketRepo.
    }

}
