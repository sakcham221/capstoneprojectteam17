package com.banking.system.service;

import com.banking.system.model.*;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.TransactionRepository;
import com.banking.system.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              AccountRepository accountRepository,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    // ✅ New method: Checks if the logged-in user is the owner of the account.
    private boolean isUserAccountOwner(String email, Long accountId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("❌ User not found"));
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("❌ Account not found"));

        return account.getUser().getId().equals(user.getId());
    }

    // 🔹 DEPOSIT transaction
    @Transactional
    public Transaction deposit(Long accountId, double amount, TransactionStatus status) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!isUserAccountOwner(currentUserEmail, accountId)) {
            throw new RuntimeException("❌ Unauthorized: You can only deposit into your own account");
        }

        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("❌ Account not found"));

        if (account.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("❌ Cannot deposit into a non-active account");
        }

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setAmount(amount);
        transaction.setStatus(status != null ? status : TransactionStatus.PENDING);
        transaction.setTimestamp(LocalDateTime.now());

        if (status == TransactionStatus.SUCCESS) {
            account.setBalance(account.getBalance() + amount);
            accountRepository.save(account);
        }

        return transactionRepository.save(transaction);
    }

    // 🔹 WITHDRAW transaction
    @Transactional
    public Transaction withdraw(Long accountId, double amount, TransactionStatus status) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!isUserAccountOwner(currentUserEmail, accountId)) {
            throw new RuntimeException("❌ Unauthorized: You can only withdraw from your own account");
        }

        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("❌ Account not found"));

        if (account.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("❌ Cannot withdraw from a non-active account");
        }

        if (status == TransactionStatus.SUCCESS && account.getBalance() < amount) {
            throw new RuntimeException("❌ Insufficient funds");
        }

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setTransactionType(TransactionType.WITHDRAWAL);
        transaction.setAmount(amount);
        transaction.setStatus(status != null ? status : TransactionStatus.PENDING);
        transaction.setTimestamp(LocalDateTime.now());

        if (status == TransactionStatus.SUCCESS) {
            account.setBalance(account.getBalance() - amount);
            accountRepository.save(account);
        }

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction transfer(String toAccountNumber, double amount, TransactionStatus status) {
        // Get current logged-in user
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        // Find sender account by user email
        User currentUser = userRepository.findByEmail(currentUserEmail)
            .orElseThrow(() -> new RuntimeException("❌ User not found"));

        Account fromAccount = accountRepository.findByUser(currentUser)
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("❌ Sender account not found"));

        // Find recipient account by account number
        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
            .orElseThrow(() -> new RuntimeException("❌ Receiver account not found"));

        // Validate account statuses
        if (fromAccount.getAccountStatus() != AccountStatus.ACTIVE || toAccount.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("❌ Both accounts must be ACTIVE for transfer");
        }

        // Validate balance
        if (status == TransactionStatus.SUCCESS && fromAccount.getBalance() < amount) {
            throw new RuntimeException("❌ Insufficient funds in sender's account");
        }

        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setAccount(fromAccount);
        transaction.setFromAccount(fromAccount);
        transaction.setToAccount(toAccount);
        transaction.setTransactionType(TransactionType.TRANSFER);
        transaction.setAmount(amount);
        transaction.setStatus(status != null ? status : TransactionStatus.PENDING);

        // Update balances if immediately successful
        if (status == TransactionStatus.SUCCESS) {
            fromAccount.setBalance(fromAccount.getBalance() - amount);
            toAccount.setBalance(toAccount.getBalance() + amount);
            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
        }

        return transactionRepository.save(transaction);
    }
    
    // 🔹 Update transaction status (Admin/Manager approval)
    @Transactional
    public Transaction updateTransactionStatus(Long transactionId, TransactionStatus newStatus, String email) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("❌ Transaction not found"));

        verifyAdminOrManagerAccess(transaction.getAccount(), email);

        if (transaction.getStatus() == TransactionStatus.SUCCESS || transaction.getStatus() == TransactionStatus.FAILED) {
            throw new RuntimeException("⚠️ Transaction status cannot be changed");
        }

        if (newStatus == TransactionStatus.SUCCESS) {
            updateBalance(transaction.getAccount(), transaction.getTransactionType(), transaction.getAmount());
        }

        transaction.setStatus(newStatus);
        return transactionRepository.save(transaction);
    }

    // 🔹 Update account balance
    private void updateBalance(Account account, TransactionType type, double amount) {
        if (type == TransactionType.DEPOSIT) {
            account.setBalance(account.getBalance() + amount);
        } else if (type == TransactionType.WITHDRAWAL || type == TransactionType.TRANSFER) {
            if (account.getBalance() < amount) {
                throw new RuntimeException("❌ Insufficient funds");
            }
            account.setBalance(account.getBalance() - amount);
        }
        accountRepository.save(account);
    }

    // 🔹 Verify Admin or Manager access
    private void verifyAdminOrManagerAccess(Account account, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("❌ User not found"));

        if (user.getRole() == Role.ADMIN) {
            return;
        }
        if (user.getRole() == Role.MANAGER) {
            if (!account.getUser().getManager().getId().equals(user.getId())) {
                throw new RuntimeException("❌ Unauthorized: Managers can only update transactions for assigned users");
            }
        } else {
            throw new RuntimeException("❌ Unauthorized: Only Admins and Managers can update transaction status");
        }
    }

 // ✅ Fetch all transactions (For Admin)
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // ✅ Fetch transactions for a specific account (For Users, Managers, Admin)
    public List<Transaction> getTransactionsByAccount(Long accountId) {
        return transactionRepository.findByAccountId(accountId);
    }
    
    public List<Transaction> getTransactionsForManager(String managerEmail) {
        User manager = userRepository.findByEmail(managerEmail)
            .orElseThrow(() -> new RuntimeException("❌ Manager not found"));

        // Fetch all users assigned to this manager
        List<User> assignedUsers = userRepository.findByManager(manager);
        
        // ✅ Fetch account IDs for the assigned users from the database
        List<Long> accountIds = assignedUsers.stream()
            .map(user -> accountRepository.findByUser(user)) // Get account list for each user
            .flatMap(List::stream)  // Flatten list of lists
            .map(Account::getId)    // Extract account IDs
            .collect(Collectors.toList()); // Collect to a list

        return transactionRepository.findByAccountIdIn(accountIds);
    }
    
    



}
