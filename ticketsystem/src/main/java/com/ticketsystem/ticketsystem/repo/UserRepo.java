package com.ticketsystem.ticketsystem.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.enums.Role;

@Repository
public interface UserRepo extends JpaRepository<Users,Long>{
    Optional<Users> findByEmail(String email);
    Optional<Users> findByOrganizationId(Long orgId);

   @Query(
    value = "SELECT * FROM users WHERE role = :role AND org_id = :orgId",
    nativeQuery = true
)
Optional<List<Users>> findByRole(String role, Long orgId);
}