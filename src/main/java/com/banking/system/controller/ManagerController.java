package com.banking.system.controller;

import com.banking.system.model.Account;
import com.banking.system.model.User;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
 // 🔹 Ensures only MANAGER role can access these endpoints
public class ManagerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    // ✅ Get all users assigned under the logged-in manager
    @GetMapping("/assigned-users")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<User>> getAssignedUsers(Authentication authentication) {
        String managerEmail = authentication.getName();
        System.out.println("🔹 Extracted Manager Email: " + managerEmail);

        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new RuntimeException("❌ Manager not found!"));

        System.out.println("✅ Manager Found: " + manager.getFullName() + " (ID: " + manager.getId() + ")");

        // Fetch accounts using manager ID instead of object reference
        List<Account> accounts = accountRepository.findByManager(manager);
        System.out.println("🔹 Found " + accounts.size() + " accounts assigned to manager " + manager.getFullName());

        List<User> assignedUsers = accounts.stream()
                .map(Account::getUser)
                .distinct()
                .collect(Collectors.toList());

        System.out.println("🔹 Found " + assignedUsers.size() + " users assigned to manager " + manager.getFullName());

        return ResponseEntity.ok(assignedUsers);
    }

    @GetMapping("/assigned-accounts")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Account>> getAssignedAccounts(Authentication authentication) {
        String managerEmail = authentication.getName();
        System.out.println("🔹 Extracted Manager Email: " + managerEmail);

        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new RuntimeException("❌ Manager not found!"));

        System.out.println("✅ Manager Found: " + manager.getFullName() + " (ID: " + manager.getId() + ")");

        // Fetch accounts using manager ID instead of object reference
        List<Account> accounts = accountRepository.findByManager(manager);
        System.out.println("🔹 Found " + accounts.size() + " accounts assigned to manager " + manager.getFullName());

        return ResponseEntity.ok(accounts);
    }

}
