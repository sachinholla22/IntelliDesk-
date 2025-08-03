package com.ticketsystem.ticketsystem.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.ticketsystem.ticketsystem.enums.Priority;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    private String title;
    private String description;
    private String status; // OPEN, ASSIGNED, RESOLVED
    private Priority priority;
    @ManyToOne
    private Users client;

    @ManyToOne
    private Users assignedTo;

    private LocalDateTime createdAt;

    @Column(name="due_date")
    private LocalDateTime dueDate;

    private List<String> photoPath; // Path or URL to the uploaded photo (optional)


}
