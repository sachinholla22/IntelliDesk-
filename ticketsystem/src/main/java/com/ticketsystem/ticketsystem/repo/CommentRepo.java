package com.ticketsystem.ticketsystem.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ticketsystem.ticketsystem.entity.Comments;

@Repository
public interface CommentRepo extends JpaRepository<Comments,Long> {
    @Query(value="SELECT * FROM comments WHERE ticket_id =:ticketId",nativeQuery=true)
    Optional<List<Comments>> findByTicketId(Long ticketId);

}
