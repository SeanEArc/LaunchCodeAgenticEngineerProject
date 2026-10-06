package com.example.Final_Project.Final_Project.service;

import com.example.Final_Project.Final_Project.dto.RegisterRequest;
import com.example.Final_Project.Final_Project.exception.DuplicateUsernameException;
import com.example.Final_Project.Final_Project.exception.InvalidRequestException;
import com.example.Final_Project.Final_Project.models.Users;
import com.example.Final_Project.Final_Project.repositories.UserRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private static final int USERNAME_MIN_LENGTH = 3;
    private static final int USERNAME_MAX_LENGTH = 50;
    private static final int NAME_MAX_LENGTH = 100;
    /** Matches the frontend's "longer than 5" rule. */
    private static final int PASSWORD_MIN_LENGTH = 6;
    /** BCrypt ignores anything past 72 bytes, so reject rather than silently truncate. */
    private static final int PASSWORD_MAX_LENGTH = 72;

    private final UserRepositories userRepositories;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepositories userRepositories, PasswordEncoder passwordEncoder) {
        this.userRepositories = userRepositories;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Users register(RegisterRequest request) {
        if (request == null) {
            throw new InvalidRequestException("A request body is required.");
        }

        String name = trimToNull(request.name());
        String username = trimToNull(request.username());
        String password = request.password();

        if (name == null) {
            throw new InvalidRequestException("Name is required.");
        }
        if (name.length() > NAME_MAX_LENGTH) {
            throw new InvalidRequestException("Name must be at most " + NAME_MAX_LENGTH + " characters.");
        }
        if (username == null) {
            throw new InvalidRequestException("Username is required.");
        }
        if (username.length() < USERNAME_MIN_LENGTH || username.length() > USERNAME_MAX_LENGTH) {
            throw new InvalidRequestException("Username must be between " + USERNAME_MIN_LENGTH
                    + " and " + USERNAME_MAX_LENGTH + " characters.");
        }
        if (password == null || password.length() < PASSWORD_MIN_LENGTH) {
            throw new InvalidRequestException("Password must be at least " + PASSWORD_MIN_LENGTH + " characters.");
        }
        if (password.length() > PASSWORD_MAX_LENGTH) {
            throw new InvalidRequestException("Password must be at most " + PASSWORD_MAX_LENGTH + " characters.");
        }
        requireNonNegativeGoal("Calorie goal", request.calorieGoal());
        requireNonNegativeGoal("Protein goal", request.proteinGoal());

        // Exact, case-sensitive duplicate check. Database-enforced uniqueness
        // and a broader normalization policy are deferred to Round 3, so this
        // check is best-effort against a concurrent registration.
        if (userRepositories.existsByUsername(username)) {
            throw new DuplicateUsernameException("That username is already taken.");
        }

        // Built field by field so nothing a client sent (id, loggedFoods, an
        // already-hashed password) can reach the entity.
        Users user = new Users();
        user.setName(name);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setCalorieGoal(request.calorieGoal());
        user.setProteinGoal(request.proteinGoal());

        return userRepositories.save(user);
    }

    @Transactional(readOnly = true)
    public Optional<Users> findByUsername(String username) {
        String trimmed = trimToNull(username);
        return trimmed == null ? Optional.empty() : userRepositories.findByUsername(trimmed);
    }

    private static void requireNonNegativeGoal(String label, Integer value) {
        if (value != null && value < 0) {
            throw new InvalidRequestException(label + " cannot be negative.");
        }
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
