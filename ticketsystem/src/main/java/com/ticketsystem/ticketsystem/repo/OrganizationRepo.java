package com.ticketsystem.ticketsystem.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ticketsystem.ticketsystem.entity.Organization;

@Repository
public interface OrganizationRepo extends JpaRepository<Organization,Long> {
    Optional<Organization> findByOrgName(String name);

  @Query(value = "SELECT COUNT(*) FROM users u WHERE u.org_id = :id", nativeQuery = true)
   int countUsersByOrganization(@Param("id") Long id);

}
