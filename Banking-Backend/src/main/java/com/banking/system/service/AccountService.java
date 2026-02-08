package com.banking.system.service;

import com.banking.system.model.Account;
import com.banking.system.model.AccountStatus;
import com.banking.system.model.User;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    public Account createAccount(Account account, Long userId, Long managerId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("❌ User not found with ID: " + userId));

        // 🔐 Set manager if provided
        if (managerId != null) {
            User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("❌ Manager not found with ID: " + managerId));
            account.setManager(manager);
        }

        // 💬 Set remarks if not provided
        if (account.getRemark() == null) {
            account.setRemark("No remarks");
        }

        // existing lines...
        String accountNumber = generateAccountNumber();
        account.setAccountNumber(accountNumber);

        if (account.getAccountType() == null) {
            account.setAccountType("SAVINGS");
        }

        if (account.getAccountStatus() == null) {
            account.setAccountStatus(AccountStatus.ACTIVE);
        }

        account.setUser(user);
        account.setCreatedAt(LocalDateTime.now());

        return accountRepository.save(account);
    }

    
    public Account updateAccount(Long accountId, Account updatedAccount, Long managerId) {
        Account existingAccount = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("Account not found"));

        // Account Type update
        if (updatedAccount.getAccountType() != null) {
            existingAccount.setAccountType(updatedAccount.getAccountType());
        }

        // Balance update
        if (updatedAccount.getBalance() != null) {
            existingAccount.setBalance(updatedAccount.getBalance());
        }

        // Account Status update
        if (updatedAccount.getAccountStatus() != null) {
            existingAccount.setAccountStatus(updatedAccount.getAccountStatus());
        }

        // Remark update
        if (updatedAccount.getRemark() != null) {
            existingAccount.setRemark(updatedAccount.getRemark());
        }
     // Update manager
        if (managerId != null) {
            User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
            existingAccount.setManager(manager);
        }

        return accountRepository.save(existingAccount);
    }



    
    public Account updateAccountStatus(Long id, AccountStatus status) {
        Account acc = accountRepository.findById(id)
                     .orElseThrow(() -> new RuntimeException("Account not found"));
        acc.setAccountStatus(status);
        return accountRepository.save(acc);
    }
    
    public List<Account> getAccountsByStatus(AccountStatus status) {
        return accountRepository.findByAccountStatus(status);
    }


    private String generateAccountNumber() {
        // Format: BANK + 10-digit random number
        String prefix = "BANK";
        long number = (long) (Math.random() * 1_000_000_0000L); // 10-digit number
        return prefix + String.format("%010d", number);
    }



	public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account getAccountById(Long id) {
        return accountRepository.findById(id).orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Account not found with ID: " + id));
        accountRepository.delete(account);
    }

    public List<Account> getAccountsByUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return accountRepository.findByUser(user);
    }
    
    public List<Account> getAccountsByManager(Long managerId) {
        User manager = userRepository.findById(managerId)
            .orElseThrow(() -> new RuntimeException("❌ Manager not found!"));
       
        return accountRepository.findByManager(manager); 
    }


    public BigDecimal getBalance(Long accountId) {
        Double balance = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("Account not found with ID: " + accountId))
            .getBalance(); // This returns a Double

        return BigDecimal.valueOf(balance); // Convert Double to BigDecimal safely
    }
}
