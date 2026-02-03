package com.intellimart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SigninResponse {
    private String token;
    private String message;
    private String role;
    private Long userId; 
}