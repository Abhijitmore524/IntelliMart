package com.intellimart.entities;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private Set<Address> addresses = new HashSet<>();

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    @ToString.Exclude
    private List<Orders> orders = new ArrayList<>();

    @Column(name = "is_deleted")
    private boolean isDeleted = false;
}
