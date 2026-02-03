package com.intellimart.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.intellimart.dto.AddressDto;
import com.intellimart.entities.Address;
import com.intellimart.entities.Customer;
import com.intellimart.repos.AddressRepo;
import com.intellimart.repos.CustomerRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressServiceInterface {

    private final AddressRepo addressRepo;
    private final CustomerRepo customerRepo;

    @Override
    public AddressDto addAddress(Long userId, AddressDto dto) {
        // Resolve Customer 207 using User ID 120
        Customer customer = customerRepo.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("No customer profile found for User ID: " + userId));

        Address a = new Address();
        a.setCity(dto.getCity());
        a.setDetailAddress(dto.getDetailAddress());
        a.setState(dto.getState());
        a.setStreet(dto.getStreet());
        a.setZipcode(dto.getZipcode());
        a.setCustomer(customer); // Map the relationship correctly

        Address saved = addressRepo.save(a);
        return toDto(saved);
    }

    @Override
    public List<AddressDto> getCustomerAddresses(Long userId) {
        // Fetch addresses using the relationship bridge
        return addressRepo.findByCustomer_User_Id(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public String deleteAddress(Long addressId) {
        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        addressRepo.delete(address);
        return "Address deleted successfully";
    }

    @Override
    public AddressDto addAddressByEmail(String email, AddressDto dto) {
        Customer customer = customerRepo.findByUser_Email(email)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));
        return addAddress(customer.getUser().getId(), dto);
    }

    @Override
    public List<AddressDto> getCustomerAddressesByEmail(String email) {
        Customer customer = customerRepo.findByUser_Email(email)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));
        return getCustomerAddresses(customer.getUser().getId());
    }

    private AddressDto toDto(Address a) {
        return new AddressDto(
                a.getAid(),
                a.getCity(),
                a.getDetailAddress(),
                a.getState(),
                a.getStreet(),
                a.getZipcode(),
                a.getCustomer().getUser().getId() // Returns userId (120)
        );
    }
}