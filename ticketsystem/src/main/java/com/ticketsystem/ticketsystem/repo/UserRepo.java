package com.ticketsystem.ticketsystem.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.enums.Role;

@Repository
public interface UserRepo extends JpaRepository<Users,Long>{
    Optional<Users> findByEmail(String email);
    Optional<Users> findByOrganizationId(Long orgId);
    Optional<List<Users>> findByRole(Role role);
}