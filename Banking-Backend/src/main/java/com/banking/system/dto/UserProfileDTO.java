package com.banking.system.dto;

import com.banking.system.model.Role;

public class UserProfileDTO {
    private Long id;
    private String fullName;
    private String email;
    private Role role;

    public UserProfileDTO(Long id, String fullName, String email, Role role) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}
