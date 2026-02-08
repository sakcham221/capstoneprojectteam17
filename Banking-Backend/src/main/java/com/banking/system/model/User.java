package com.banking.system.model;
import com.fasterxml.jackson.annotation.JsonProperty;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    

    @Column(name = "full_name", nullable = false)
    @JsonProperty("fullName")
    private String fullName;

    @Column(nullable = false, unique = true)
    @JsonProperty("email")
    private String email;

    @Column(nullable = false)
    @JsonProperty("password")
    private String password;
    
    @OneToMany(mappedBy = "manager")
    @JsonBackReference
    private List<Account> managedAccounts;  // ✅ Ensure this exists

    
    public List<Account> getManagedAccounts() {
		return managedAccounts;
	}

	public void setManagedAccounts(List<Account> managedAccounts) {
		this.managedAccounts = managedAccounts;
	}

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
    private Role role;
    
    @ManyToOne
    @JoinColumn(name = "manager_id") // This should exist!
    private User manager;

	public User getManager() {
		return manager;
	}

	public void setManager(User manager) {
		this.manager = manager;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
