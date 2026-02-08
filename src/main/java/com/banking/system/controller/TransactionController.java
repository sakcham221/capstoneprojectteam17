package com.banking.system.controller;

import com.banking.system.dto.TransactionRequest;
import com.banking.system.repository.AccountRepository;
import com.banking.system.model.Account;
import com.banking.system.model.Transaction;
import com.banking.system.model.TransactionStatus;
import com.banking.system.service.TransactionService;
import com.banking.system.service.UserService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

	private final TransactionService transactionService;
	private final UserService userService;
	private final AccountRepository accountRepository;

	public TransactionController(TransactionService transactionService, UserService userService,
			AccountRepository accountRepository) {
		this.transactionService = transactionService;
		this.userService = userService;
		this.accountRepository = accountRepository;
	}

	// Admin can view all transactions
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping("/all")
	public ResponseEntity<List<Transaction>> getAllTransactions() {
		return ResponseEntity.ok(transactionService.getAllTransactions());
	}

	// Get transactions for a specific account (User, Manager, Admin)
	@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER') or hasAuthority('USER')")
	@GetMapping("/{accountId}")
	public ResponseEntity<?> getTransactionsByAccount(@PathVariable Long accountId, Authentication authentication) {
		String email = authentication.getName();
		boolean isAdmin = authentication.getAuthorities().stream()
				.anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
		boolean isManager = authentication.getAuthorities().stream()
				.anyMatch(auth -> auth.getAuthority().equals("MANAGER"));
		boolean isUser = authentication.getAuthorities().stream()
				.anyMatch(auth -> auth.getAuthority().equals("USER"));

		if (isAdmin || (isManager && userService.isManagerOfUser(email, accountId))
				|| (isUser && userService.isUserAccountOwner(email, accountId))) {
			return ResponseEntity.ok(transactionService.getTransactionsByAccount(accountId));
		}
		return ResponseEntity.status(403).body("❌ Access Denied: Unauthorized.");
	}

	
	// Create transaction (deposit, withdrawal, transfer)
	@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER') or hasAuthority('USER')")
	@PostMapping
	public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest request, Authentication authentication) {
	    String email = authentication.getName();
	    System.out.println("📥 Incoming Transaction Request by: " + email);
	    System.out.println("🎭 User Role: " + authentication.getAuthorities());

	    try {
	        Transaction transaction;
	        switch (request.getTransactionType()) {
	            case DEPOSIT:
	                // Keep deposit using accountId from request
	                transaction = transactionService.deposit(
	                    request.getAccountId(),
	                    request.getAmount(),
	                    request.getStatus()
	                );
	                break;

	            case WITHDRAWAL:
	                // Keep withdrawal using accountId from request
	                transaction = transactionService.withdraw(
	                    request.getAccountId(),
	                    request.getAmount(),
	                    request.getStatus()
	                );
	                break;

	            case TRANSFER:
	                // Sender derived from logged-in user
	                transaction = transactionService.transfer(
	                    request.getToAccountNumber(),   // ✅ pass recipient account number
	                    request.getAmount(),
	                    request.getStatus()
	                );
	                break;


	            default:
	                return ResponseEntity.badRequest().body("❌ Invalid transaction type.");
	        }
	        return ResponseEntity.ok(transaction);
	    } catch (RuntimeException ex) {
	        return ResponseEntity.status(403).body("❌ Error: " + ex.getMessage());
	    }
	}

	// Update transaction status (Admin or Manager)
	@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
	@PutMapping("/{transactionId}/status")
	public ResponseEntity<?> updateTransactionStatus(@PathVariable Long transactionId,
			@RequestParam TransactionStatus status, Authentication authentication) {
		String email = authentication.getName();
		try {
			Transaction updatedTransaction = transactionService.updateTransactionStatus(transactionId, status, email);
			return ResponseEntity.ok(updatedTransaction);
		} catch (RuntimeException ex) {
			return ResponseEntity.status(403).body("❌ Error: " + ex.getMessage());
		}
	}

	// Get transactions assigned to a manager
	@PreAuthorize("hasAuthority('MANAGER')")
	@GetMapping("/manager")
	public ResponseEntity<List<Transaction>> getManagerTransactions(Authentication authentication) {
		String email = authentication.getName();
		return ResponseEntity.ok(transactionService.getTransactionsForManager(email));
	}
}
