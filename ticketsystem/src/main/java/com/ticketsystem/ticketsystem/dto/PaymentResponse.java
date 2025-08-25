package com.ticketsystem.ticketsystem.dto;

public class PaymentResponse {
    private String status;
    private Double amount;
    private String method;
    private String transactionId;

    public PaymentResponse(String status, Double amount, String method, String transactionId) {
        this.status = status;
        this.amount = amount;
        this.method = method;
        this.transactionId = transactionId;
    }

    // getters
    public String getStatus() { return status; }
    public Double getAmount() { return amount; }
    public String getMethod() { return method; }
    public String getTransactionId() { return transactionId; }
}
