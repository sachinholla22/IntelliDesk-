package com.ticketsystem.ticketsystem.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ticketsystem.ticketsystem.entity.Comments;

@Repository
public interface CommentRepo extends JpaRepository<Comments,Long> {
    
}
