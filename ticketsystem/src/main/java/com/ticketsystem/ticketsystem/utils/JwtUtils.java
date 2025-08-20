package com.ticketsystem.ticketsystem.utils;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;


@Component
public class JwtUtils {
    
    @Value("${jwt.secret}")
    private String secret;

    private final long JWT_EXPIRATION=60*60*1000;

    private Key getSignKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String userId,String role,Long organizationId,String orgPlan){
        return Jwts.builder()
                .setSubject(userId)
                .claim("role",role)
                .claim("orgId",organizationId)
                .claim("orgPlan",orgPlan)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+JWT_EXPIRATION))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUserId(String token){
        return extractClaim(token,Claims::getSubject);
    }

    public String extractRole(String token){
        return extractAllClaims(token).get("role",String.class);
    }

    public String extractOrgPLan(String token){
        return extractAllClaims(token).get("orgPlan",String.class);
    }
    public Long extractOrganizationId(String token){
        return extractAllClaims(token).get("orgId",Long.class);
    }

    public boolean validateToken(String token, String userId){
     try{
        final String email=extractUserId(token);
        return (email.equals(userId) && !isTokenExpired(token));
     }catch( Exception e){
        return false;
     }
    }

public boolean isTokenValid(String token, String expectedUserId, String expectedRole,Long expectedOrgId) {
    try {
        Claims claims = Jwts.parserBuilder()
                            .setSigningKey(getSignKey())
                            .build()
                            .parseClaimsJws(token)
                            .getBody();

        String tokenUserId = claims.getSubject();  // assuming userId is set as subject
        String tokenRole = claims.get("role", String.class);
        Long orgId=claims.get("orgId",Long.class);

        return tokenUserId.equals(expectedUserId)
               && tokenRole.equals(expectedRole)
               && orgId.equals(expectedOrgId)
               && !claims.getExpiration().before(new Date());
    } catch (Exception e) {
        return false;
    }
}

    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
