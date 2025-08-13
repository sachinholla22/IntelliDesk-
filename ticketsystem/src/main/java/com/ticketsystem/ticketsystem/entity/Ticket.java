package com.ticketsystem.ticketsystem.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.ticketsystem.ticketsystem.dto.UserDTO;
import com.ticketsystem.ticketsystem.enums.Priority;
import com.ticketsystem.ticketsystem.enums.TicketStatus;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Ticket {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name="org_id")
    private Organization organization;

    @Column(nullable=false)
    private String title;

    private String description;

    @Column(nullable=false)
    private String status; // OPEN, ASSIGNED, RESOLVED
    
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    @ManyToOne
    private Users client;

    @ManyToOne
    private Users assignedTo;

    @ManyToOne
    @JoinColumn(name="assigned_by")
    private Users assignedBy;

    private LocalDateTime createdAt;

    @Column(name="due_date")
    private LocalDateTime dueDate;

    private List<String> photoPath; // Path or URL to the uploaded photo (optional)


}
