package com.ticketsystem.ticketsystem.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaMessageProducer {
    
    private final KafkaTemplate<String,String> kafkaTemplate;

    public KafkaMessageProducer(KafkaTemplate<String,String> kafkaTemplate){
        this.kafkaTemplate=kafkaTemplate;
    }

    public void sendMessage(Long orgId){
        String topic="organization-events";
        kafkaTemplate.send(topic,orgId.toString());
         System.out.println("Sent OrgCreated event for orgId=" + orgId);
    }
}
