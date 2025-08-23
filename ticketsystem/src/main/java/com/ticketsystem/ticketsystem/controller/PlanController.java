package com.ticketsystem.ticketsystem.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketsystem.ticketsystem.service.BillingService;

@RestController
@RequestMapping("/billing")
public class PlanController {
    
    private final BillingService billingService;

    public PlanController(BillingService billingService){
        this.billingService=billingService;
    }

    
}
