package com.ticketsystem.ticketsystem.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.ticketsystem.ticketsystem.dto.TicketResponseDTO;
import com.ticketsystem.ticketsystem.entity.Ticket;

public interface TicketService {
   public String createTicketService(Ticket ticket, List<MultipartFile> photos, String userId);
   public Optional<List<TicketResponseDTO>> getNullOpenTicketService( String status);
}
