package com.banking.system.controller;

import com.banking.system.dto.UpdateProfileResponse;
import com.banking.system.dto.UserProfileDTO;
import com.banking.system.model.User;
import com.banking.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public String userDashboard() {
        return "Welcome to USER Dashboard 👤!";
    }

    @GetMapping("/profile")
    public ResponseEntity<?> userProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserProfileDTO profileDTO = new UserProfileDTO(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole()
        );

        return ResponseEntity.ok(profileDTO);
    }


    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, Authentication authentication) {
        String email = authentication.getName();

        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        existingUser.setFullName(updatedUser.getFullName());
        userRepository.save(existingUser);

        UpdateProfileResponse response = new UpdateProfileResponse(
            "✅ Profile updated successfully!",
            existingUser.getFullName(),
            existingUser.getEmail()
        );

        return ResponseEntity.ok(response);
    }
} 
