package com.ticketsystem.ticketsystem.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketsystem.ticketsystem.dto.AiResponse;
import com.ticketsystem.ticketsystem.dto.ApiWrapper;
import com.ticketsystem.ticketsystem.exception.InvalidRoleException;
import com.ticketsystem.ticketsystem.repo.OrganizationRepo;
import com.ticketsystem.ticketsystem.repo.UserRepo;
import com.ticketsystem.ticketsystem.service.AIService;
import com.ticketsystem.ticketsystem.utils.JwtUtils;

@RestController
@RequestMapping("/aichats")
public class AiChatController {
    
    private final UserRepo userRepo;
    private final JwtUtils jwtUtils;
    private final OrganizationRepo orgRepo;
    private final AIService aiService;

    public AiChatController(UserRepo userRepo,JwtUtils jwtUtils, OrganizationRepo orgRepo,AIService aiService){
        this.userRepo=userRepo;
        this.jwtUtils=jwtUtils;
        this.orgRepo=orgRepo;
        this.aiService=aiService;
    }


    @PostMapping("/ask")
    public ResponseEntity<ApiWrapper<?>> sendAiPromptController(@RequestHeader("Authorization")String authHeader,@RequestBody String question){
        String jwt=authHeader.replace("Bearer","");
        String plan=jwtUtils.extractOrgPLan(jwt);
        if(!plan.equalsIgnoreCase("PREMIUM")){
            throw new InvalidRoleException("Please purchase the plan PREMIUM to access");
        }

        String userRole=jwtUtils.extractRole(jwt);
        Long orgId=jwtUtils.extractOrganizationId(jwt);
        String userId=jwtUtils.extractUserId(jwt);

        AiResponse response=aiService.sendAiPrompt(question, orgId, Long.valueOf(userId), userRole);
        return ResponseEntity.ok(ApiWrapper.success(response,HttpStatus.OK));
    }

}
