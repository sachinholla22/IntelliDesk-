package com.ticketsystem.ticketsystem.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketsystem.ticketsystem.dto.ApiWrapper;
import com.ticketsystem.ticketsystem.entity.Comments;
import com.ticketsystem.ticketsystem.service.CommentService;
import com.ticketsystem.ticketsystem.utils.JwtUtils;

@RestController
@RequestMapping("/ticket")
public class CommentController {
    
    private final CommentService commentService;
    private final JwtUtils jwtUtils;

    public CommentController(CommentService commentService,JwtUtils jwtUtils){
        this.commentService=commentService;
        this.jwtUtils=jwtUtils;
    }


    @PostMapping("/{ticketId}/comment")
    public ResponseEntity<ApiWrapper<?>> addCommentController(@RequestHeader("Authorization") String authHeader, @PathVariable("ticketId") Long ticketId,@RequestBody Comments comment){
        
        String jwt=authHeader.replace("Bearer","");
        String userId=jwtUtils.extractUserId(jwt);
        String response=commentService.addCommentService(ticketId,Long.valueOf(userId),comment);
        
        return ResponseEntity.ok(ApiWrapper.success(response,HttpStatus.CREATED));
    }
}
