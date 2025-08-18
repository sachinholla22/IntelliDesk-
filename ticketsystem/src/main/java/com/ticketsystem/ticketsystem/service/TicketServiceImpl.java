package com.ticketsystem.ticketsystem.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ticketsystem.ticketsystem.dto.SingleTicketResponse;
import com.ticketsystem.ticketsystem.dto.TicketResponseDTO;
import com.ticketsystem.ticketsystem.dto.UserDTO;
import com.ticketsystem.ticketsystem.entity.Organization;
import com.ticketsystem.ticketsystem.entity.Ticket;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.enums.OrgPlans;
import com.ticketsystem.ticketsystem.exception.ResourceNotFoundException;
import com.ticketsystem.ticketsystem.repo.CommentRepo;
import com.ticketsystem.ticketsystem.repo.TicketRepository;
import com.ticketsystem.ticketsystem.repo.UserRepo;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepo;
    private final UserRepo userRepo;
    private final FileStorageService fileStore;
    private final CommentRepo commentRepo;

    public TicketServiceImpl(TicketRepository ticketRepo, UserRepo userRepo, FileStorageService fileStore,CommentRepo commentRepo) {
        this.ticketRepo = ticketRepo;
        this.userRepo = userRepo;
        this.fileStore = fileStore;
        this.commentRepo=commentRepo;
    }

    @Override
    public String createTicketService(Ticket ticket, List<MultipartFile> photos, String userId) {
        Users user = userRepo.findById(Long.valueOf(userId))
                .orElseThrow(() -> new UsernameNotFoundException("No particular User"));
        
        Organization org=new Organization();
        OrgPlans plan=org.getOrgPlan();
        int maxPhotos=plan==OrgPlans.BASE ? 2:7;

        if(photos.size()>maxPhotos){
         throw new RuntimeException("You can upload max of "+ maxPhotos+" per ticket as per your plan");
        }

        UserDTO userDto=new UserDTO();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setOrganizationName(user.getOrganization().getOrgName());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setRole(user.getRole());


        ticket.setClient(user);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setOrganization(user.getOrganization());

        List<String> photosUrl = new ArrayList<>();
        for (MultipartFile photo : photos) {
            String paths = fileStore.storeFiles(photo);
            photosUrl.add(paths);
        }

        ticket.setPhotoPath(photosUrl);
        ticketRepo.save(ticket);
        return "Ticket Created Successfully";

    }

    @Override
    public Optional<List<TicketResponseDTO>> getNullOpenTicketService(String status,Long orgId) {

        Optional<List<Ticket>> optionalTickets = ticketRepo.getTicketByAssignToAndStatus(status,orgId);
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
                resp.setAssignedToName(ticket.getAssignedTo().getName());
            } else {
                resp.setAssignedToName(null);
            }

            resp.setCreatedAt(ticket.getCreatedAt());
            resp.setDueDate(ticket.getDueDate());

            // Directly set the list of photo paths
            resp.setPhotoPath(ticket.getPhotoPath() != null ? ticket.getPhotoPath() : Collections.emptyList());
            resp.setAssignedByName(ticket.getAssignedBy().getName());
            responseList.add(resp);
        }

        return Optional.of(responseList);
    }

    @Override
    public String assignTicketService(Long ticketId, Long assignedById, Long assignedToId) {
        // Get existing ticket
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        Users assignedByUser = userRepo.findById(assignedById)
                .orElseThrow(() -> new UsernameNotFoundException("No such Users"));
        Users assignedToUser = userRepo.findById(assignedToId)
                .orElseThrow(() -> new UsernameNotFoundException("No such Users"));

        ticket.setAssignedBy(assignedByUser);
        ticket.setAssignedTo(assignedToUser);

        ticket.setStatus("ASSIGNED");
        ticketRepo.save(ticket);

        return "Ticket Assigned Successfully";

    }

    @Override
    public Optional<List<TicketResponseDTO>> getAllTickets(String priority, String status,Long orgId) {
        List<Ticket> tickets = ticketRepo.findAllByFilters(priority, status,orgId);

        if (tickets.isEmpty()) {
            return Optional.empty();
        }

        List<TicketResponseDTO> dtoList = tickets.stream()
                .map(ticket -> new TicketResponseDTO(
                        ticket.getOrganization().getOrgName(),
                        ticket.getTitle(),
                        ticket.getDescription(),
                        ticket.getStatus(),
                        ticket.getPriority(),
                        ticket.getClient().getName(),
                        ticket.getAssignedTo().getName(),
                        ticket.getCreatedAt(),
                        ticket.getDueDate(),
                        ticket.getPhotoPath(),
                        ticket.getAssignedBy().getName()))
                .collect(Collectors.toList());

        return Optional.of(dtoList);
    }

    @Override
    public List<TicketResponseDTO> sortTicketByPriority(String direction,Long orgId) {
        List<Ticket> response = ticketRepo.sortTicketByPriority(orgId);

        if ("desc".equalsIgnoreCase(direction)) {
            Collections.reverse(response);
        }
        return response.stream().map(ticket -> new TicketResponseDTO(
                ticket.getOrganization().getOrgName(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getStatus(),
                ticket.getPriority(),
                ticket.getClient().getName(),
                ticket.getAssignedTo().getName(),
                ticket.getCreatedAt(),
                ticket.getDueDate(),
                ticket.getPhotoPath(),
                ticket.getAssignedBy().getName())).toList();

    }


    @Override
    public Optional<SingleTicketResponse> getTicketByIds(Long ticketId){
        Ticket getTicket=ticketRepo.findById(ticketId).orElseThrow(()->new ResourceNotFoundException("No such Tickets"));

        List<String> commentTexts = commentRepo.findByTicketId(ticketId)
        .orElse(Collections.emptyList())
        .stream()
        .map(c-> "By : "+(c.getCommentedBy().getName()!=null ? c.getCommentedBy().getName() : "Unknown" )
                +" - "+c.getComment())
        .toList();
        String assignedToName = getTicket.getAssignedTo() != null ? getTicket.getAssignedTo().getName() : null;
        String assignedByName = getTicket.getAssignedBy() != null ? getTicket.getAssignedBy().getName() : null;

        SingleTicketResponse response=new SingleTicketResponse(
            getTicket.getTitle(),
            getTicket.getDescription(),
            getTicket.getStatus(),
            getTicket.getPriority(),
            getTicket.getClient().getName(),
            assignedToName,
            getTicket.getCreatedAt(),
            getTicket.getDueDate(),
            getTicket.getPhotoPath(),
            assignedByName,
            commentTexts
            
        );
        return Optional.of(response);
    }


    public List<TicketResponseDTO> getOverDuesController(Long orgId){
        List<Ticket> tickets=ticketRepo.findByDues(orgId);

    List<TicketResponseDTO>response= tickets.stream().map(ticket->new TicketResponseDTO(
        ticket.getOrganization().getOrgName(),
        ticket.getTitle(),
        ticket.getDescription(),
        ticket.getStatus(),
        ticket.getPriority(),
        ticket.getClient().getName(),
        ticket.getAssignedTo().getName(),
        ticket.getCreatedAt(),
        ticket.getDueDate(),
        ticket.getPhotoPath(),
        ticket.getAssignedBy().getName())).toList();

        return response;
           
    }

}
