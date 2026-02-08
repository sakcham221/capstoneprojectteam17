package com.banking.system.dto;

import com.banking.system.model.TransactionStatus;

public class StatusUpdateRequest {
    private TransactionStatus status;

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }
}
