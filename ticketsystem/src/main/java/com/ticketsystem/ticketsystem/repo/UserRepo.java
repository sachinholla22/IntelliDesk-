package com.ticketsystem.ticketsystem.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ticketsystem.ticketsystem.entity.Users;

@Repository
public interface UserRepo extends JpaRepository<Users,Long>{

}