package com.ticketsystem.ticketsystem.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ticketsystem.ticketsystem.entity.Ticket;

public interface TicketService {
   public String createTicketService(Ticket ticket, List<MultipartFile> photos, String userId);
}
