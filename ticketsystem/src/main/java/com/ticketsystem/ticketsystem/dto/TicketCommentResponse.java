package com.ticketsystem.ticketsystem.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ticketsystem.ticketsystem.entity.Comments;
import com.ticketsystem.ticketsystem.enums.Priority;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketCommentResponse {

    private Long ticketId;
    private String title;
    private String description;
    private String status;
    private Priority priority;
    private UserDTO createdBy;
    private UserDTO assignedTo;
    private UserDTO assignedBy;
    private LocalDateTime duedate;
    private List<String>photoPath;
    private List<Comments> comments;




}
