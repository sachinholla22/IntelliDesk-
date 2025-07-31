package com.ticketsystem.ticketsystem.utils;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {
    
    private JwtUtils jwtUtil;

    public JwtFilter(JwtUtils jwtUtil){
        this.jwtUtil=jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,FilterChain filterChain) throws ServletException,IOException{
        String authHeader=request.getHeader("Authorization");
        String token=null;
        String email=null;
        
    if(authHeader!=null && authHeader.startsWith("Bearer")){
        token=authHeader.substring(7);

        try{
            email=jwtUtil.extractUserId(token);
        }catch(Exception e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        request.setAttribute("email",email);
        request.setAttribute("role",jwtUtil.extractRole(token));
    }
       // continue the filter chain
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request){
        String path=request.getRequestURI();
        return path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register");
    }
}