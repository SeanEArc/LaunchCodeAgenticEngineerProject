package com.example.Final_Project.Final_Project.security;

import com.example.Final_Project.Final_Project.models.Users;
import com.example.Final_Project.Final_Project.repositories.UserRepositories;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Looks accounts up by username for authentication. Comparison is
 * case-sensitive for Round 1; normalization policy is deferred.
 */
@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private final UserRepositories userRepositories;

    public DatabaseUserDetailsService(UserRepositories userRepositories) {
        this.userRepositories = userRepositories;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        Users user = userRepositories.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No account for that username."));

        // Round 1 has no plaintext-login fallback. An account without a usable
        // hash simply cannot authenticate.
        String hash = user.getPassword();
        if (hash == null || hash.isBlank()) {
            throw new UsernameNotFoundException("Account has no usable password hash.");
        }

        return User.withUsername(user.getUsername())
                .password(hash)
                .authorities("ROLE_USER")
                .build();
    }
}
