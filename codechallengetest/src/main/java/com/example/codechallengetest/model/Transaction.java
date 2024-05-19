package com.example.codechallengetest.model;

import jakarta.persistence.*;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;
    private long originatingAccountId;
    private long resultingAccountId;
    private long userId;


    public long getResultingAccountId() {
        return resultingAccountId;
    }

    public void setResultingAccountId(long resultingAccountId) {
        this.resultingAccountId = resultingAccountId;
    }

    public long getOriginatingAccountId() {
        return originatingAccountId;
    }

    public void setOriginatingAccountId(long originatingAccountId) {
        this.originatingAccountId = originatingAccountId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionReason() {
        return transactionReason;
    }

    public void setTransactionReason(String transactionReason) {
        this.transactionReason = transactionReason;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    private String transactionReason;
}
