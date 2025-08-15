package com.ticketsystem.ticketsystem.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ticketsystem.ticketsystem.entity.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query(value = "SELECT * FROM ticket WHERE assigned_to_id IS NULL AND status=:status AND org_id = :orgId", nativeQuery = true)
    Optional<List<Ticket>> getTicketByAssignToAndStatus(@Param("status") String status,@Param("orgId") Long orgId);

    @Query(value = "SELECT * FROM ticket " +
            "WHERE (:priority IS NULL OR priority = :priority) " +
            "AND (:status IS NULL OR status = :status) AND org_id = :orgId", nativeQuery = true)
    List<Ticket> findAllByFilters(@Param("priority") String priority, @Param("status") String status,@Param("orgId") Long orgId);

    @Query(value = "SELECT * FROM ticket " +
            " WHERE org_id = :orgId ORDER BY  CASE priority " +
            "WHEN 'URGENT' THEN 1" +
            "WHEN 'IMPORTANT' THEN 2" +
            "WHEN 'MEDIUM' THEN 3" +
            "WHEN 'LOW' THEN 4 ELSE 5 END ASC ", nativeQuery = true)
    List<Ticket> sortTicketByPriority(@Param("orgId") Long orgId);

    @Query(value="SELECT * FROM ticket WHERE due_date<CURRENT_DATE AND status!='RESOLVED' AND org_id = :orgId",nativeQuery=true)
    List<Ticket> findByDues(@Param("orgId") Long orgId);
}
