	package com.intellimart.entities;
	
	import com.fasterxml.jackson.annotation.JsonIgnore;
	import jakarta.persistence.*;
	import lombok.*;
	
	@Entity
	@Table(name = "order_items")
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	public class OrderLineItem {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	
	    private Integer quantity;
	
	    private Double unitPrice;
	
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "order_id")
	    @JsonIgnore
	    @ToString.Exclude
	    private Orders order;
	
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "product_id")
	    private Product product;
	}
