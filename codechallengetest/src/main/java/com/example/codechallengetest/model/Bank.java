package com.example.codechallengetest.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
public class Bank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bankName;

    @OneToMany(mappedBy = "bank", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Account> accounts;

    private double totalTransactionFeeAmount;
    private double totalTransferAmount;
    private double transactionFlatFeeAmount;

    public double getTransactionPercentFeeValue() {
        return transactionPercentFeeValue;
    }

    public void setTransactionPercentFeeValue(double transactionPercentFeeValue) {
        this.transactionPercentFeeValue = transactionPercentFeeValue;
    }

    public double getTransactionFlatFeeAmount() {
        return transactionFlatFeeAmount;
    }

    public void setTransactionFlatFeeAmount(double transactionFlatFeeAmount) {
        this.transactionFlatFeeAmount = transactionFlatFeeAmount;
    }

    public double getTotalTransferAmount() {
        return totalTransferAmount;
    }

    public void setTotalTransferAmount(double totalTransferAmount) {
        this.totalTransferAmount = totalTransferAmount;
    }

    public double getTotalTransactionFeeAmount() {
        return totalTransactionFeeAmount;
    }

    public void setTotalTransactionFeeAmount(double totalTransactionFeeAmount) {
        this.totalTransactionFeeAmount = totalTransactionFeeAmount;
    }

    public List<Account> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<Account> accounts) {
        this.accounts = accounts;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private double transactionPercentFeeValue;

}
