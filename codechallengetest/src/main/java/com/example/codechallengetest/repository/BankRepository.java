package com.example.codechallengetest.repository;

import com.example.codechallengetest.model.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<Bank, Long> {
}
