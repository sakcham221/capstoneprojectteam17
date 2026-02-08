package com.banking.system.controller;

import com.banking.system.model.User;
import com.banking.system.dto.LoginRequest;
import com.banking.system.model.Role;
import com.banking.system.repository.UserRepository;
import com.banking.system.security.JwtUtil;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        System.out.println("DEBUG USER: " + user.getEmail());
        System.out.println("DEBUG NAME: " + user.getFullName());

        // 1. Validate email
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        // 2. Check duplicate
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered"));
        }

        try {
            // 3. Encrypt password
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // 4. Set role
            if (user.getRole() == null) {
                user.setRole(Role.USER);
            }

            // 5. Save
            userRepository.save(user);

            // 6. SUCCESS response
            return ResponseEntity.ok(
                    Map.of("message", "Registration successful")
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body(Map.of("message", "Server error"));
        }
    }



    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdminOrManager(@RequestBody User user,
                                                    @RequestParam Role role,
                                                    @RequestHeader("Authorization") String authHeader) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("❌ Email is already registered.");
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(403).body("❌ Unauthorized: Only ADMIN can register MANAGER/ADMIN.");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        Optional<User> adminUser = userRepository.findByEmail(email);

        if (adminUser.isEmpty() || adminUser.get().getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body("❌ Unauthorized: Only ADMIN can register MANAGER/ADMIN.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok("✅ " + role + " registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("❌ Invalid email or password.");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("❌ Invalid email or password.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "userId", user.getId(),
            "role", user.getRole().toString(),
            "email", user.getEmail(),
            "message", "✅ Login successful!"
        ));
    }
}
