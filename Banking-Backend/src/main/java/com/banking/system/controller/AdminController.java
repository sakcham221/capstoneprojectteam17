package com.banking.system.controller;

import com.banking.system.dto.AssignUserRequest;
import com.banking.system.model.User;
import com.banking.system.repository.UserRepository;
import com.banking.system.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	@Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    // 🔸 Existing: Dashboard
    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "Welcome to ADMIN Dashboard 👑!";
    }
    
 // Create a new user (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create-user")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    
    // Existing: Statistics
    @GetMapping("/stats")
    public String adminStats() {
        return "Here are some ADMIN statistics.";
    }

    // Get All Users (Admin + Manager Access)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // Delete User by ID (Admin + Manager Access)
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("❌ User not found with ID: " + id);
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("✅ User deleted successfully with ID: " + id);
    }

    // Create Manager (Admin only)
    @PostMapping("/create-manager")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createManager(@RequestBody User manager) {
        return userService.createManager(manager);
    }

    
    // Assign User to Manager (Admin only)
    @PutMapping("/assign-manager")
    public ResponseEntity<String> assignUserToManager(@RequestBody AssignUserRequest request) {
        userService.assignUserToManager(request.getUserId(), request.getManagerId());
        return ResponseEntity.ok("✅ User assigned to Manager successfully!");
    }


}
