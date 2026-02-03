package com.intellimart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long aid;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Detail address is required")
    private String detailAddress; // Matches React state exactly

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Street is required")
    private String street;

    @NotBlank(message = "Zipcode is required")
    private String zipcode;
    
    @NotNull(message = "Customer ID cannot be null")
    private Long customerId; 
}