package com.intellimart.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.CartItemDto;
import com.intellimart.entities.CartItem;
import com.intellimart.entities.Customer;
import com.intellimart.entities.Product;
import com.intellimart.repos.CartRepo;
import com.intellimart.repos.CustomerRepo;
import com.intellimart.repos.ProductRepo;
import com.intellimart.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartServiceInterface {

    private final CartRepo cartRepo;
    private final ProductRepo productRepo;
    private final CustomerRepo customerRepo;

    // ================= HELPERS =================

    private Customer getCustomer(Authentication auth) {
        UserPrincipal p = (UserPrincipal) auth.getPrincipal();
        return customerRepo.findByUser_Id(p.getId()).orElseThrow();
    }

    // ================= OLD (userId based – FIXED) =================

    @Override
    public String addItemToCart(Long userId, Long productId, int quantity) {

        if (quantity <= 0) throw new RuntimeException("Invalid quantity");

        Customer customer = customerRepo.findByUser_Id(userId).orElseThrow();

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing =
                cartRepo.findByCustomerAndProductAndIsDeletedFalse(customer, product);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartRepo.save(item);
            return "Updated";
        }

        CartItem item = new CartItem();
        item.setCustomer(customer);
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setDeleted(false);

        cartRepo.save(item);
        return "Added";
    }

    @Override
    public List<CartItemDto> getCartDtos(Long userId) {
        Customer c = customerRepo.findByUser_Id(userId).orElseThrow();

        return cartRepo.findByCustomer_IdAndIsDeletedFalse(c.getId())
                .stream()
                .map(i -> new CartItemDto(
                        i.getCartItemId(),
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getProduct().getPrice().doubleValue(),
                        i.getProduct().getImageUrl(),
                        i.getQuantity()
                )).collect(Collectors.toList());
    }

    @Override
    public List<CartItem> getCartByCustomer(Long userId) {
        Customer c = customerRepo.findByUser_Id(userId).orElseThrow();
        return cartRepo.findByCustomer_IdAndIsDeletedFalse(c.getId());
    }

    @Override
    public String clearCart(Long userId) {
        Customer c = customerRepo.findByUser_Id(userId).orElseThrow();

        cartRepo.findByCustomer_IdAndIsDeletedFalse(c.getId())
                .forEach(i -> {
                    i.setDeleted(true);
                    cartRepo.save(i);
                });

        return "Cleared";
    }

    @Override
    public String updateQuantity(Long cartItemId, int quantity) {
        CartItem i = cartRepo.findById(cartItemId).orElseThrow();
        i.setQuantity(quantity);
        cartRepo.save(i);
        return "Updated";
    }

    @Override
    public String removeItemFromCart(Long cartItemId) {
        CartItem i = cartRepo.findById(cartItemId).orElseThrow();
        i.setDeleted(true);
        cartRepo.save(i);
        return "Removed";
    }

    // ================= JWT BASED (UNCHANGED) =================

    @Override
    public String addItemToCart(Authentication auth, Long productId, int quantity) {

        if (quantity <= 0) throw new RuntimeException("Invalid quantity");

        Customer customer = getCustomer(auth);

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing =
                cartRepo.findByCustomerAndProductAndIsDeletedFalse(customer, product);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartRepo.save(item);
            return "Updated";
        }

        CartItem item = new CartItem();
        item.setCustomer(customer);
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setDeleted(false);

        cartRepo.save(item);
        return "Added";
    }

    @Override
    public List<CartItemDto> getCartDtos(Authentication auth) {

        Customer customer = getCustomer(auth);

        return cartRepo.findByCustomer_IdAndIsDeletedFalse(customer.getId())
                .stream()
                .map(i -> new CartItemDto(
                        i.getCartItemId(),
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getProduct().getPrice().doubleValue(),
                        i.getProduct().getImageUrl(),
                        i.getQuantity()
                )).collect(Collectors.toList());
    }

    @Override
    public String removeItemFromCart(Authentication auth, Long cartItemId) {

        Customer customer = getCustomer(auth);

        CartItem item = cartRepo.findById(cartItemId).orElseThrow();

        if (!item.getCustomer().getId().equals(customer.getId()))
            throw new RuntimeException("Forbidden");

        item.setDeleted(true);
        cartRepo.save(item);

        return "Removed";
    }

    @Override
    public String updateQuantity(Authentication auth, Long cartItemId, int quantity) {

        if (quantity <= 0) throw new RuntimeException("Invalid");

        Customer customer = getCustomer(auth);

        CartItem item = cartRepo.findById(cartItemId).orElseThrow();

        if (!item.getCustomer().getId().equals(customer.getId()))
            throw new RuntimeException("Forbidden");

        item.setQuantity(quantity);
        cartRepo.save(item);

        return "Updated";
    }

    @Override
    public String clearCart(Authentication auth) {

        Customer customer = getCustomer(auth);

        cartRepo.findByCustomer_IdAndIsDeletedFalse(customer.getId())
                .forEach(i -> {
                    i.setDeleted(true);
                    cartRepo.save(i);
                });

        return "Cleared";
    }
}
