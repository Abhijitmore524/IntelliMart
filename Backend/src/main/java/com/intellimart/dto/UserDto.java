package com.intellimart.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data 
@NoArgsConstructor 
@AllArgsConstructor
public class UserDto {
    private Long id; 

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String number;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Password is required")
    @Size(min = 4, message = "Password must be at least 4 characters")
    private String password;
}