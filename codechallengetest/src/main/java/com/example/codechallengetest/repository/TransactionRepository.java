package com.example.codechallengetest.repository;

import com.example.codechallengetest.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.originatingAccountId = :accountId OR t.resultingAccountId = :accountId")
    List<Transaction> findByOriginatingAccountIdOrResultingAccountId(long accountId);

    List<Transaction> findByUserId(long userId);
}
