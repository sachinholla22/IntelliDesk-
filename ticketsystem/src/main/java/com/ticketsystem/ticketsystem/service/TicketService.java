package com.ticketsystem.ticketsystem.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.ticketsystem.ticketsystem.dto.SingleTicketResponse;
import com.ticketsystem.ticketsystem.dto.TicketResponseDTO;
import com.ticketsystem.ticketsystem.entity.Ticket;

public interface TicketService {
   public String createTicketService(Ticket ticket, List<MultipartFile> photos, String userId);
   public Optional<List<TicketResponseDTO>> getNullOpenTicketService( String status,Long orgId);
   public String assignTicketService(Long ticketId,Long assignedById,Long assignedToId);
   public Optional<List<TicketResponseDTO>> getAllTickets(String priority,String status,Long orgId);
   public List<TicketResponseDTO> sortTicketByPriority(String direction,Long orgId);
   public Optional<SingleTicketResponse> getTicketByIds(Long ticketId);
   public List<TicketResponseDTO> getOverDuesController(Long orgId);
}
