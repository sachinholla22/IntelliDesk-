package com.ticketsystem.ticketsystem.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ticketsystem.ticketsystem.entity.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {
    
}
