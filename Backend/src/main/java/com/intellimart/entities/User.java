package com.intellimart.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String number;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String gender;

    @Enumerated(EnumType.STRING)
    private Roles role;

    private Boolean isDeleted = false;
}
