package com.intellimart.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // ✅ Added for identity extraction
import org.springframework.web.bind.annotation.*;
import com.intellimart.dto.AddressDto;
import com.intellimart.dto.ApiResponse;
import com.intellimart.service.AddressServiceInterface;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressServiceInterface addressService;

    // ================= CUSTOMER → ADD OWN ADDRESS =================
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @PostMapping("/customer/{customerId}")
    public ResponseEntity<AddressDto> addAddress(@PathVariable Long customerId, @RequestBody AddressDto dto) {
        dto.setCustomerId(customerId);
        return ResponseEntity.ok(addressService.addAddress(customerId, dto));
    }

    // ================= CUSTOMER → GET OWN ADDRESSES =================
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<AddressDto>> getAddresses(@PathVariable Long customerId) {
        return ResponseEntity.ok(addressService.getCustomerAddresses(customerId));
    }

    // ================= DELETE ADDRESS =================
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse> deleteAddress(@PathVariable Long addressId) {
        String message = addressService.deleteAddress(addressId);
        return ResponseEntity.ok(new ApiResponse(true, message));
    }
}