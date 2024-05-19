package com.example.codechallengetest.controller;

import com.example.codechallengetest.model.Bank;
import com.example.codechallengetest.repository.BankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bank")
public class BankController {

    private final BankRepository bankRepository;

    @Autowired
    public BankController(BankRepository bankRepository) {
        this.bankRepository = bankRepository;
    }

    @PostMapping
    public Bank createBank(@RequestBody Bank bank) {
        return bankRepository.save(bank);
    }

    @GetMapping("/accounts")
    public List<Bank> getBankAccounts() {
        return bankRepository.findAll();
    }

    @GetMapping("/transaction-fee-amount")
    public double getBankTotalTransactionFeeAmount() {
        List<Bank> banks = bankRepository.findAll();
        double totalTransactionFeeAmount = 0;
        for (Bank bank : banks) {
            totalTransactionFeeAmount += bank.getTotalTransactionFeeAmount();
        }
        return totalTransactionFeeAmount;
    }

    @GetMapping("/transfer-amount")
    public double getBankTotalTransferAmount() {
        List<Bank> banks = bankRepository.findAll();
        double totalTransferAmount = 0;
        for (Bank bank : banks) {
            totalTransferAmount += bank.getTotalTransferAmount();
        }
        return totalTransferAmount;
    }

}
