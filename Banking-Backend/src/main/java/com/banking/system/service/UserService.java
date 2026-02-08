package com.banking.system.service;

import com.banking.system.model.User;
import com.banking.system.model.Role;
import com.banking.system.model.Account;
import com.banking.system.model.Transaction;
import com.banking.system.repository.UserRepository;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.TransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, AccountRepository accountRepository, 
                       TransactionRepository transactionRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<String> registerUser(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }
        
        if (user.getRole() == null) {
            user.setRole(Role.USER); // default fallback
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));  // ✅ Ensure password is encoded
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully.");
    }

    // Assign user to manager (Admin-only feature)
    public void assignUserToManager(Long userId, Long managerId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("❌ User not found with ID: " + userId));

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("❌ Manager not found with ID: " + managerId));

        if (!manager.getRole().equals(Role.MANAGER)) {
            throw new RuntimeException("❌ Provided user is not a manager.");
        }

        // ✅ Assign manager to user
        user.setManager(manager);
        userRepository.save(user);

        // ✅ Assign manager to all user's accounts
        List<Account> userAccounts = accountRepository.findByUser(user);
        for (Account account : userAccounts) {
            account.setManager(manager);
            accountRepository.save(account);
        }
    }

    // Create Manager (Admin-only)
    public ResponseEntity<String> createManager(User manager) {
        Optional<User> existingUser = userRepository.findByEmail(manager.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("⚠️ Email already exists!");
        }

        manager.setRole(Role.MANAGER);
        manager.setPassword(passwordEncoder.encode(manager.getPassword()));  // ✅ Ensure password encoding
        userRepository.save(manager);

        return ResponseEntity.ok("✅ Manager created successfully!");
    }

    // Get Users under a specific Manager
    public List<User> getUsersUnderManager(Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        return userRepository.findByManager(manager);
    }

    // ✅ Check if a user owns the given account
    public boolean isUserAccountOwner(String email, Long accountId) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        List<Account> accounts = accountRepository.findByUser(user);

        return accounts.stream().anyMatch(acc -> acc.getId().equals(accountId));
    }

    // ✅ Check if a manager manages a user
    public boolean isManagerOfUser(String managerEmail, Long accountId) {
        return userRepository.isManagerOfUser(managerEmail, accountId);
    }


    // ✅ Check if a Manager can access a specific transaction
    public boolean canManagerAccessTransaction(String managerEmail, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("❌ Transaction not found"));

        Long userId = transaction.getAccount().getUser().getId();

        // ✅ Check if the manager really manages this user
        return userRepository.existsByIdAndManager_Email(userId, managerEmail);
    }
    
    public Long getUserAccountIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("❌ User not found"));
        Account account = accountRepository.findByUser(user)
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("❌ Account not found for user"));
        return account.getId();
    }

}
