package com.ticketsystem.ticketsystem.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class BillingService {
    

   public PaymentResponse processPayment(Long orgId, Double amount, String method) {
        // Fake processing
        String transactionId = UUID.randomUUID().toString();
        String status = "SUCCESS";  // Always success for now

        return new PaymentResponse(status, amount, method, transactionId);
    }
}
