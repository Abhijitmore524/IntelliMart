package com.intellimart.service;

import java.util.List;

import com.intellimart.dto.AddressDto;

public interface AddressServiceInterface {

    AddressDto addAddress(Long customerId, AddressDto dto);

    List<AddressDto> getCustomerAddresses(Long customerId);
    AddressDto addAddressByEmail(String email, AddressDto dto);

    List<AddressDto> getCustomerAddressesByEmail(String email);

	String deleteAddress(Long addressId);

}
