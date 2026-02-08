package com.banking.system.repository;

import com.banking.system.model.Transaction;
import com.banking.system.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // ✅ Get transactions where the account is the sender (Withdrawals + Transfers)
    List<Transaction> findByFromAccountId(Long fromAccountId);

    // ✅ Get transactions where the account is the receiver (Deposits + Transfers)
    List<Transaction> findByToAccountId(Long toAccountId);

    // ✅ Get transactions by status
    List<Transaction> findByStatus(TransactionStatus status);
 // Find transactions by account ID
    List<Transaction> findByAccountId(Long accountId);

    // Find transactions by multiple account IDs (for managers)
    List<Transaction> findByAccountIdIn(List<Long> accountIds);

    // 🔥 Fix: Get **ALL** transactions for an account (Deposit, Withdrawal, and Transfer)
    @Query("SELECT t FROM Transaction t WHERE t.account.id = :accountId OR t.fromAccount.id = :accountId OR t.toAccount.id = :accountId")
    List<Transaction> findAllByAccountId(@Param("accountId") Long accountId);

    // ✅ Get transactions managed by a specific manager
    @Query("SELECT t FROM Transaction t WHERE t.fromAccount.user.manager.email = :managerEmail OR t.toAccount.user.manager.email = :managerEmail")
    List<Transaction> findTransactionsByManagerEmail(@Param("managerEmail") String managerEmail);
}
