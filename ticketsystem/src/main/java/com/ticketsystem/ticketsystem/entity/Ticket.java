package com.ticketsystem.ticketsystem.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    private String title;
    private String description;
    private String status; // OPEN, ASSIGNED, RESOLVED
    @ManyToOne
    private Users client;

    @ManyToOne
    private Users assignedTo;

    private LocalDate createdAt;

    private List<String> photoPath; // Path or URL to the uploaded photo (optional)


}
