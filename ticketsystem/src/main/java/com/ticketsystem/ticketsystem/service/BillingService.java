package com.ticketsystem.ticketsystem.service;

import org.springframework.stereotype.Service;

@Service
public class BillingService {
    

    public String processPayment(Long id){
        return "Success";
    }
}
