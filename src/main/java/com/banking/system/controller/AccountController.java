package com.banking.system.controller;

import org.springframework.web.bind.annotation.RestController;
import com.banking.system.model.Account;
import com.banking.system.model.AccountStatus;
import com.banking.system.model.Role;
import com.banking.system.model.User;
import com.banking.system.repository.UserRepository;
import com.banking.system.security.JwtUtil;
import com.banking.system.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    
	private final AccountService accountService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    
    public AccountController(AccountService accountService, UserRepository userRepository, JwtUtil jwtUtil) {
        this.accountService = accountService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }


    @PostMapping("/create/{userId}")
    public Account createAccount(
            @RequestBody Account account,
            @PathVariable Long userId,
            @RequestParam(required = false) Long managerId) {
        return accountService.createAccount(account, userId, managerId);
    }


    @PutMapping("/update/{id}")
    public Account updateAccount(
            @PathVariable Long id,
            @RequestBody Account updatedAccount,
            @RequestParam(required = false) Long managerId) {
        return accountService.updateAccount(id, updatedAccount, managerId);
    }


    
    @PutMapping("/status/{id}")
    public Account updateAccountStatus(@PathVariable Long id, @RequestParam AccountStatus status) {
        return accountService.updateAccountStatus(id, status);
    }


    @GetMapping("/all")
    public List<Account> getAllAccounts() {
        return accountService.getAllAccounts();
    }
    
    @GetMapping("/status/{status}")
    public List<Account> getAccountsByStatus(@PathVariable AccountStatus status) {
        return accountService.getAccountsByStatus(status);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAccountsByUser(@PathVariable Long userId,
                                               @RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Missing token.");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        Optional<User> requesterOpt = userRepository.findByEmail(email);

        if (requesterOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid token.");
        }

        User requester = requesterOpt.get();

        // 🔐 USER can only see their own accounts
        if (requester.getRole() == Role.USER && !requester.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("❌ You can only access your own accounts.");
        }

        // 🔐 MANAGER can only see their assigned users
        if (requester.getRole() == Role.MANAGER) {
            List<User> assignedUsers = userRepository.findByManager(requester);
            boolean isManaged = assignedUsers.stream().anyMatch(u -> u.getId().equals(userId));
            if (!isManaged) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("❌ This user is not assigned to you.");
            }
        }

        // ✅ Otherwise, allow
        List<Account> accounts = accountService.getAccountsByUser(userId);
        return ResponseEntity.ok(accounts);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id) {
        try {
            accountService.deleteAccount(id);
            return ResponseEntity.ok("✅ Account deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/manager/{managerId}")
    public List<Account> getAccountsByManager(@PathVariable Long managerId) {
        return accountService.getAccountsByManager(managerId);
    }
    @GetMapping("/{id}/balance")
    public ResponseEntity<BigDecimal> getAccountBalance(@PathVariable Long id) {
        BigDecimal balance = accountService.getBalance(id);
        return ResponseEntity.ok(balance);
    }


}
