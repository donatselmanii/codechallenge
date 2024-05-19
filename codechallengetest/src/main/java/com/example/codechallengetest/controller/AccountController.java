package com.example.codechallengetest.controller;

import com.example.codechallengetest.model.Account;
import com.example.codechallengetest.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AccountRepository accountRepository;

    @Autowired
    public AccountController(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @PostMapping
    public Account createAccount(@RequestBody Account account) {
        return accountRepository.save(account);
    }

    @GetMapping("/user/{userId}")
    public List<Account> getAccountsByUserId(@PathVariable long userId) {
        return accountRepository.findByUserId(userId);
    }

    @GetMapping("/balance/{accountId}")
    public double getAccountBalance(@PathVariable long accountId) {
        Account account = accountRepository.findById(accountId).orElse(null);
        if (account != null) {
            return account.getAccountBalance();
        } else {
            return -1;
        }
    }

    @GetMapping("/{accountId}/details")
    public ResponseEntity<AccountDetailsDTO> getAccountDetails(@PathVariable long accountId) {
        Account account = accountRepository.findById(accountId).orElse(null);
        if (account != null) {
            AccountDetailsDTO accountDetails = new AccountDetailsDTO(
                    account.getBank().getBankName(),
                    account.getAccountName(),
                    account.getAccountBalance()
            );
            return ResponseEntity.ok(accountDetails);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    @PutMapping("/transfer")
    public ResponseEntity<String> performTransfer(@RequestParam long senderId, @RequestParam long recipientId, @RequestParam double amount) {
        Account senderAccount = accountRepository.findById(senderId).orElse(null);
        Account recipientAccount = accountRepository.findById(recipientId).orElse(null);

        if (senderAccount != null && recipientAccount != null && senderAccount.getAccountBalance() >= amount) {
            double senderNewBalance = senderAccount.getAccountBalance() - amount;
            double recipientNewBalance = recipientAccount.getAccountBalance() + amount;

            senderAccount.setAccountBalance(senderNewBalance);
            recipientAccount.setAccountBalance(recipientNewBalance);

            accountRepository.save(senderAccount);
            accountRepository.save(recipientAccount);

            return ResponseEntity.ok("Transfer successful");
        } else {
            return ResponseEntity.badRequest().body("Transfer failed: Invalid sender, recipient, or insufficient balance");
        }
    }



    @PutMapping("/withdraw/{accountId}/{amount}")
    public boolean withdrawMoney(@PathVariable long accountId, @PathVariable double amount) {
        Account account = accountRepository.findById(accountId).orElse(null);
        if (account != null && account.getAccountBalance() >= amount) {
            account.setAccountBalance(account.getAccountBalance() - amount);
            accountRepository.save(account);
            return true;
        } else {
            return false;
        }
    }

    @PutMapping("/deposit/{accountId}/{amount}")
    public boolean depositMoney(@PathVariable long accountId, @PathVariable double amount) {
        Account account = accountRepository.findById(accountId).orElse(null);
        if (account != null) {
            account.setAccountBalance(account.getAccountBalance() + amount);
            accountRepository.save(account);
            return true;
        } else {
            return false;
        }
    }


    private static class AccountDetailsDTO {
        private String bankName;
        private String accountName;
        private double accountBalance;

        public AccountDetailsDTO(String bankName, String accountName, double accountBalance) {
            this.bankName = bankName;
            this.accountName = accountName;
            this.accountBalance = accountBalance;
        }

        public String getBankName() {
            return bankName;
        }

        public String getAccountName() {
            return accountName;
        }

        public double getAccountBalance() {
            return accountBalance;
        }
    }
}
