package com.ticketsystem.ticketsystem.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.enums.Role;
import com.ticketsystem.ticketsystem.repo.UserRepo;

@Service
public class UserServiceImpl implements UserService{
    
    private final  UserRepo userRepo;

    public UserServiceImpl(UserRepo userRepo){
        this.userRepo=userRepo;
    }

    @Override
    public Optional<List<Users>> getDevelopersService(String role,Long orgId){
        Optional<List<Users>> getUsers=userRepo.findByRole(role,orgId);
        return getUsers;
    }

    
}
