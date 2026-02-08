package com.banking.system.repository;

import com.banking.system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find users assigned to a specific manager
    List<User> findByManager(User manager);

    // ✅ Fix: Use 'id' instead of 'accountId'
    boolean existsByEmailAndId(String email, Long userId);

    // ✅ Fix: If you need to check if a user is managed by a specific manager
    boolean existsByIdAndManager_Email(Long userId, String managerEmail);
    
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.manager.email = :managerEmail AND u.id = " +
    	       "(SELECT a.user.id FROM Account a WHERE a.id = :accountId)")
    	boolean isManagerOfUser(@Param("managerEmail") String managerEmail, @Param("accountId") Long accountId);

}
