package com.banking.system.dto;

import com.banking.system.model.TransactionStatus;
import com.banking.system.model.TransactionType;

public class TransactionRequest {
    private Long accountId; // For deposits/withdrawals
    private Long fromAccountId; // For transfers, if needed
   // private Long toAccountId;   // For transfers
    private String toAccountNumber;
    private double amount;
    private TransactionType transactionType;
    private TransactionStatus status;
    
    
    

    // Getters and Setters
    
    
    
    public Long getAccountId() {
        return accountId;
    }
   
	public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }
    public Long getFromAccountId() {
        return fromAccountId;
    }
    public void setFromAccountId(Long fromAccountId) {
        this.fromAccountId = fromAccountId;
    }
 /*   public Long getToAccountId() {
        return toAccountId;
    }
    public void setToAccountId(Long toAccountId) {
        this.toAccountId = toAccountId;
    }  */
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
	public String getToAccountNumber() {
		return toAccountNumber;
	}
	public void setToAccountNumber(String toAccountNumber) {
		this.toAccountNumber = toAccountNumber;
	}
	
}
