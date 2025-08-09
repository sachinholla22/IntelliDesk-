package com.ticketsystem.ticketsystem.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketsystem.ticketsystem.dto.ApiWrapper;
import com.ticketsystem.ticketsystem.dto.OrganizationResponseDTO;
import com.ticketsystem.ticketsystem.entity.Organization;
import com.ticketsystem.ticketsystem.service.OrganizationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/organization")
public class OrganizationRegister {
    
    private final OrganizationService orgService;

    public OrganizationRegister(OrganizationService orgService){
        this.orgService=orgService;
    }

    @PostMapping("/create-organization")
    public ResponseEntity<ApiWrapper<?>> createOrganizationController(@Valid @RequestBody Organization request){
        
        OrganizationResponseDTO response=orgService.organizationResgisterService(request);
        return ResponseEntity.ok(ApiWrapper.success(response,HttpStatus.CREATED));
    }

}
