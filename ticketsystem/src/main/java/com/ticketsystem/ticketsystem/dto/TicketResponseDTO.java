package com.ticketsystem.ticketsystem.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.enums.Priority;
import com.ticketsystem.ticketsystem.enums.TicketStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketResponseDTO {
    private String organizationName;
    private String title;
    private String description;
    private String status;
    private Priority priority;
    private String clientName;
    private Users assignedToId;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private List<String> photoPath;
}
