package com.intellimart.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SellerDto {

    private Long id;

    private String companyName;

    private UserDto user;   // <-- ADD THIS
}
