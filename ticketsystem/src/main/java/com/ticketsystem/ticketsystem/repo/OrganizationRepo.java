package com.ticketsystem.ticketsystem.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ticketsystem.ticketsystem.entity.Organization;

@Repository
public interface OrganizationRepo extends JpaRepository<Organization,Long> {
    Optional<Organization> findByOrgName(String name);
}
