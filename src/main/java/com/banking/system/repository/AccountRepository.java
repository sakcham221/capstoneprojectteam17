package com.banking.system.repository;

import com.banking.system.model.Account;
import com.banking.system.model.AccountStatus;
import com.banking.system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser(User user);
    List<Account> findByAccountStatus(AccountStatus status);
    List<Account> findByManager(User manager);
    Optional<Account> findByAccountNumber(String accountNumber);
}
