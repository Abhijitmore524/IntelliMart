package com.intellimart.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtUtils {
    @Value("${jwt.expiration.time}")
    private long jwtExpirationTime;
    @Value("${jwt.secret}")
    private String jwtSecret;
    private SecretKey secretKey;
    
    @PostConstruct
    public void myInit() {
        secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    
    public String generateToken(UserPrincipal principal) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + jwtExpirationTime);
        
        return Jwts.builder()
                .setSubject(principal.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiresAt)
                .addClaims(Map.of("user_id", String.valueOf(principal.getUserId()), 
                                 "user_role", principal.getRole()))
                .signWith(secretKey)
                .compact();
    }

    public Claims validateToken(String jwt) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(jwt)
                .getBody();
    }
}
