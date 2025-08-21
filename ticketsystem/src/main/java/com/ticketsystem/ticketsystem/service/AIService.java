package com.ticketsystem.ticketsystem.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ticketsystem.ticketsystem.dto.AiRequest;
import com.ticketsystem.ticketsystem.dto.AiResponse;

@Service
public class AIService {

    private final RestTemplate template;
    private final String aiUrl="http://localhost:5000/ask";

    public AIService(RestTemplate template){
        this.template=template;
    }

    public AiResponse sendAiPrompt(String question,Long orgId,Long userId,String role){
        
        AiRequest request = new AiRequest(orgId, userId, role, question);

        HttpEntity<AiRequest> entity=new HttpEntity<>(request);
        
        ResponseEntity<AiResponse> response=template.exchange(aiUrl,HttpMethod.POST,entity,AiResponse.class);

        return response.getBody();
    }

    
}
