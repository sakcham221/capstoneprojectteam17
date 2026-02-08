package com.banking.system.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.banking.system")
@EnableJpaRepositories(basePackages = "com.banking.system.repository")
@EntityScan(basePackages = "com.banking.system.model")
public class BankingManagementSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(BankingManagementSystemApplication.class, args);
    }
}
