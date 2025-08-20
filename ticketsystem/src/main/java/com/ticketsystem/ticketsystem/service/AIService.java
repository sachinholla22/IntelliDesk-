package com.ticketsystem.ticketsystem.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ticketsystem.ticketsystem.dto.AiResponse;

@Service
public class AIService {

    private final RestTemplate template;
    private final String aiUrl="http://localhost:5000/ask";

    public AIService(RestTemplate template){
        this.template=template;
    }

    public AiResponse sendAiPrompt(String prompt,Long orgId,Long userId,String role){
        AiResponse response=new AiResponse();
        return response;
    }

    
}
