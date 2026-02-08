package com.banking.system.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // For transfers only; will be null for deposit/withdrawal
    @ManyToOne
    @JoinColumn(name = "from_account_id", nullable = true)
    private Account fromAccount;

    // For transfers only; will be null for deposit/withdrawal
    @ManyToOne
    @JoinColumn(name = "to_account_id", nullable = true)
    private Account toAccount;

    // For deposit/withdrawal, this is the only account populated.
    // For transfers, you can choose to set it as the sender’s account.
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    private double amount;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    // Constructor for deposit/withdrawal
    public Transaction(Account account, double amount, TransactionType transactionType, TransactionStatus status) {
        this.account = account; // account_id is filled
        this.fromAccount = null; // left null
        this.toAccount = null;   // left null
        this.amount = amount;
        this.transactionType = transactionType;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    // Constructor for transfers (all fields populated)
    public Transaction(Account fromAccount, Account toAccount, double amount, TransactionType transactionType, TransactionStatus status) {
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
        this.account = fromAccount; // or set this to the account you want recorded in account_id
        this.amount = amount;
        this.transactionType = transactionType;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    // Default constructor required by JPA
    public Transaction() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Account getFromAccount() {
		return fromAccount;
	}

	public void setFromAccount(Account fromAccount) {
		this.fromAccount = fromAccount;
	}

	public Account getToAccount() {
		return toAccount;
	}

	public void setToAccount(Account toAccount) {
		this.toAccount = toAccount;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public TransactionType getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(TransactionType transactionType) {
		this.transactionType = transactionType;
	}

	public TransactionStatus getStatus() {
		return status;
	}

	public void setStatus(TransactionStatus status) {
		this.status = status;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}

    // Getters and Setters ...
    
}
