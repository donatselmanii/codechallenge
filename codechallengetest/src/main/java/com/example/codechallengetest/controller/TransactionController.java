package com.example.codechallengetest.controller;
import com.example.codechallengetest.model.Transaction;
import com.example.codechallengetest.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @PostMapping("/flat-fee")
    public Transaction performFlatFeeTransaction(@RequestBody Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @PostMapping("/percent-fee")
    public Transaction performPercentFeeTransaction(@RequestBody Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @PostMapping
    public Transaction saveTransaction(@RequestBody Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @GetMapping("/account/{accountId}")
    public List<Transaction> getAccountTransactions(@PathVariable long accountId) {
        return transactionRepository.findByOriginatingAccountIdOrResultingAccountId(accountId);
    }

    @GetMapping("/user/{userId}")
    public List<Transaction> getUserTransactions(@PathVariable long userId) {
        return transactionRepository.findByUserId(userId);
    }

}
