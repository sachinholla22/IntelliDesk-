package com.ticketsystem.ticketsystem.service;

import java.util.List;
import java.util.Optional;

import com.ticketsystem.ticketsystem.entity.Users;

public interface UserService {
    Optional<List<Users>> getDevelopersService(String role,Long orgId);
}
