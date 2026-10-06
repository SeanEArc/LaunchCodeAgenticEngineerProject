package com.example.Final_Project.Final_Project.repositories;

import com.example.Final_Project.Final_Project.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepositories extends JpaRepository<Users, Integer> {

    // Case-sensitive on purpose for Round 1. Database-enforced uniqueness is
    // deferred to Round 3, so these are application-level checks only.
    Optional<Users> findByUsername(String username);

    boolean existsByUsername(String username);
}
