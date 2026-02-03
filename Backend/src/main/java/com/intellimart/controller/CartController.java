	package com.intellimart.controller;
	
	import java.security.Principal;
	import java.util.List;
	
	import org.springframework.http.ResponseEntity;
	import org.springframework.security.access.prepost.PreAuthorize;
	import org.springframework.security.core.Authentication;
	import org.springframework.web.bind.annotation.*;
	
	import com.intellimart.dto.CartItemDto;
	import com.intellimart.service.CartServiceInterface;
	
	import lombok.RequiredArgsConstructor;
	
	@RestController
	@RequestMapping("/api/cart")
	@RequiredArgsConstructor
	public class CartController {
	
	    private final CartServiceInterface cartService;
	
	    // ================= OLD (userId based – KEEP) =================
	
	    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
	    @PostMapping("/add/{userId}/{productId}/{quantity}")
	    public ResponseEntity<String> addToCart(
	            @PathVariable Long userId,
	            @PathVariable Long productId,
	            @PathVariable int quantity) {
	
	        return ResponseEntity.ok(cartService.addItemToCart(userId, productId, quantity));
	    }
	
	    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
	    @GetMapping("/{userId}")
	    public ResponseEntity<List<CartItemDto>> getCart(@PathVariable Long userId) {
	        return ResponseEntity.ok(cartService.getCartDtos(userId));
	    }
	
	    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
	    @DeleteMapping("/clear/{userId}")
	    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
	        return ResponseEntity.ok(cartService.clearCart(userId));
	    }
	
	    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
	    @PutMapping("/update/{cartItemId}")
	    public ResponseEntity<String> updateQuantity(
	            @PathVariable Long cartItemId,
	            @RequestParam int quantity) {
	        return ResponseEntity.ok(cartService.updateQuantity(cartItemId, quantity));
	    }
	
	    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
	    @DeleteMapping("/remove/{cartItemId}")
	    public ResponseEntity<String> removeItem(@PathVariable Long cartItemId) {
	        return ResponseEntity.ok(cartService.removeItemFromCart(cartItemId));
	    }
	
	    // ================= NEW (JWT based – ADD) =================
	
	    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
	    @PostMapping("/add/{productId}")
	    public ResponseEntity<String> addToCartJwt(
	            Authentication auth,
	            @PathVariable Long productId) {
	
	        return ResponseEntity.ok(cartService.addItemToCart(auth, productId, 1));
	    }
	
	    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
	    @GetMapping("/me")
	    public ResponseEntity<List<CartItemDto>> getMyCart(Authentication auth) {
	        return ResponseEntity.ok(cartService.getCartDtos(auth));
	    }
	
	    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
	    @DeleteMapping("/clear")
	    public ResponseEntity<String> clearMyCart(Authentication auth) {
	        return ResponseEntity.ok(cartService.clearCart(auth));
	    }
	}
