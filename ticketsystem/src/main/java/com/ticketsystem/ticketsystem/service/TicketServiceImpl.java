package com.ticketsystem.ticketsystem.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ticketsystem.ticketsystem.dto.TicketResponseDTO;
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
public Optional<List<TicketResponseDTO>> getNullOpenTicketService(String status) {
    Optional<List<Ticket>> optionalTickets = ticketRepo.getTicketByAssignToAndStatus(status);

    if (optionalTickets.isEmpty()) {
        return Optional.of(Collections.emptyList());
    }

    List<Ticket> tickets = optionalTickets.get();
    List<TicketResponseDTO> responseList = new ArrayList<>();

    for (Ticket ticket : tickets) {
        TicketResponseDTO resp = new TicketResponseDTO();

        // Set basic fields
        if (ticket.getOrganization() != null) {
            resp.setOrganizationName(ticket.getOrganization().getOrgName());
        } else {
            resp.setOrganizationName(null);
        }

        resp.setTitle(ticket.getTitle());
        resp.setDescription(ticket.getDescription());
        resp.setStatus(ticket.getStatus());
        resp.setPriority(ticket.getPriority());

        if (ticket.getClient() != null) {
            resp.setClientName(ticket.getClient().getName());
        }

        if (ticket.getAssignedTo() != null) {
            resp.setAssignedToId(ticket.getAssignedTo());
        } else {
            resp.setAssignedToId(null);
        }

        resp.setCreatedAt(ticket.getCreatedAt());
        resp.setDueDate(ticket.getDueDate());

        // Directly set the list of photo paths
        resp.setPhotoPath(ticket.getPhotoPath() != null ? ticket.getPhotoPath() : Collections.emptyList());

        responseList.add(resp);
    }

    return Optional.of(responseList);
}

@Override
public String assignTicketService(Long ticketId, Long assignedById,Long assignedToId){
  // Get existing ticket
    Ticket ticket = ticketRepo.findById(ticketId)
        .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

Users assignedByUser=userRepo.findById(assignedById).orElseThrow(()-> new UsernameNotFoundException("No such Users"));
Users assignedToUser=userRepo.findById(assignedToId).orElseThrow(()-> new UsernameNotFoundException("No such Users"));

ticket.setAssignedBy(assignedByUser);
ticket.setAssignedTo(assignedToUser);
ticketRepo.save(ticket);

return "Ticket Assigned Successfully";

}
}
