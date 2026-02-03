package com.intellimart.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApiResponse {
    private boolean success; // Changed from String status to boolean success
    private String message;
    private LocalDateTime timestamp;

    // Manual constructor to handle the (boolean, String) call
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}