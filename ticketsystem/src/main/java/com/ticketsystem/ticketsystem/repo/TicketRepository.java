package com.ticketsystem.ticketsystem.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ticketsystem.ticketsystem.entity.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {
    @Query(value="SELECT * FROM ticket WHERE assign_to_id IS NULL AND status=:status",nativeQuery=true)
    Optional<Ticket> getTicketByAssignToAndStatus(@Param("status" )String status);
}
