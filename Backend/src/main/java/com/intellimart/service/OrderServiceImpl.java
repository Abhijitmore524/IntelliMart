package com.intellimart.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.OrderDto;
import com.intellimart.dto.SellerOrderDto;
import com.intellimart.entities.*;
import com.intellimart.repos.*;
import com.intellimart.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderServiceInterface {

    private final OrderRepo orderRepo;
    private final CustomerRepo customerRepo;
    private final CartRepo cartRepo;
    private final AddressRepo addressRepo;
    private final SellerRepo sellerRepo;

    @Override
    public OrderDto placeOrder(Long customerId, Long addressId) {
        Customer customer = customerRepo.findByUser_Id(customerId).orElseThrow();
        Address address = addressRepo.findByAidAndCustomer_Id(addressId, customer.getId())
                        .orElseThrow(() -> new RuntimeException("Invalid address"));
        return internalPlaceOrder(customer, address);
    }

    @Override
    public OrderDto placeOrder(Authentication auth, Long addressId) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        Customer customer = customerRepo.findByUser_Id(principal.getId()).orElseThrow();
        Address address = addressRepo.findByAidAndCustomer_Id(addressId, customer.getId())
                        .orElseThrow(() -> new RuntimeException("Invalid address"));
        return internalPlaceOrder(customer, address);
    }

    private OrderDto internalPlaceOrder(Customer customer, Address address) {
        // Fetch items where is_deleted is 0x00
        List<CartItem> cartItems = cartRepo.findByCustomer_IdAndIsDeletedFalse(customer.getId());

        if (cartItems.isEmpty()) throw new RuntimeException("Cart empty");

        Orders order = new Orders();
        order.setCustomer(customer);
        order.setAddress(address);
        order.setOrderDate(LocalDate.now());
        order.setStatus(Status.PENDING);
        order.setTotalAmount(BigDecimal.ZERO);
        order.setLineItems(new HashSet<>());

        for (CartItem c : cartItems) {
            Product p = c.getProduct();

            OrderLineItem li = new OrderLineItem();
            li.setOrder(order);
            li.setProduct(p);
            li.setQuantity(c.getQuantity());
            li.setUnitPrice(p.getPrice().doubleValue());

            order.getLineItems().add(li);
            order.setTotalAmount(
                    order.getTotalAmount().add(
                            p.getPrice().multiply(BigDecimal.valueOf(c.getQuantity()))
                    )
            );

            // ✅ LOGIC UPDATE: We REMOVED c.setDeleted(true) from here.
            // Items remain in cart (0x00) until Razorpay verification confirms payment.
        }

        return toDto(orderRepo.save(order));
    }

    /**
     * ✅ NEW ENHANCEMENT: Call this from PaymentServiceImpl only after successful payment verification.
     */
    public void confirmOrderAndClearCart(Long orderId) {
        Orders order = orderRepo.findById(orderId).orElseThrow();
        order.setStatus(Status.CONFIRMED);
        
        // Find the active cart items for the customer who placed this order
        List<CartItem> cartItems = cartRepo.findByCustomer_IdAndIsDeletedFalse(order.getCustomer().getId());
        
        // Mark them as deleted (0x01) now that payment is done
        for (CartItem item : cartItems) {
            item.setDeleted(true);
        }
        
        cartRepo.saveAll(cartItems);
        orderRepo.save(order);
    }

    @Override
    public List<OrderDto> getCustomerOrdersByEmail(String email) {
        Customer customer = customerRepo.findByUser_Email(email).orElseThrow();
        return orderRepo.findByCustomer_IdAndIsDeletedFalse(customer.getId())
                .stream().map(this::toDto).toList();
    }

    @Override
    public List<OrderDto> getCustomerOrdersById(Long customerId) {
        return orderRepo.findByCustomerId(customerId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepo.findByIsDeletedFalse()
                .stream().map(this::toDto).toList();
    }

    @Override
    public OrderDto getOrderById(Long orderId) {
        return toDto(orderRepo.findById(orderId).orElseThrow());
    }

    @Override
    public OrderDto updateOrderStatus(Long orderId, Status status) {
        Orders o = orderRepo.findById(orderId).orElseThrow();
        o.setStatus(status);
        return toDto(orderRepo.save(o));
    }

    @Override
    public List<SellerOrderDto> getSellerOrders(Long sellerId) {
        return orderRepo.findOrdersBySeller(sellerId).stream()
                .flatMap(o -> o.getLineItems().stream()
                        .filter(li -> li.getProduct().getSeller().getId().equals(sellerId))
                        .map(li -> {
                            SellerOrderDto dto = new SellerOrderDto();
                            dto.setOrderId(o.getOrderId());
                            dto.setProductName(li.getProduct().getName());
                            dto.setQuantity(li.getQuantity());
                            dto.setAmount(li.getProduct().getPrice().multiply(BigDecimal.valueOf(li.getQuantity())));
                            dto.setStatus(o.getStatus());
                            dto.setOrderDate(o.getOrderDate());
                            return dto;
                        })
                ).toList();
    }

    @Override
    public List<SellerOrderDto> getSellerOrdersByAuth(Authentication auth) {
        Seller seller = sellerRepo.findByUser_Email(auth.getName()).orElseThrow();
        return getSellerOrders(seller.getId());
    }

    private OrderDto toDto(Orders o) {
        OrderDto dto = new OrderDto();
        dto.setOrderId(o.getOrderId());
        dto.setCustomerId(o.getCustomer().getUser().getId());
        dto.setStatus(o.getStatus());
        dto.setOrderDate(o.getOrderDate());
        dto.setTotalAmount(o.getTotalAmount());
        return dto;
    }
}