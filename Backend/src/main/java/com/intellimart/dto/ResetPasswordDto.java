package com.intellimart.dto;

import lombok.Data;

@Data
public class ResetPasswordDto {

    private String email;
    private String newPassword;
}
