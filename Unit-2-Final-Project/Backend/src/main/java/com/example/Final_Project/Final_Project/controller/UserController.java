package com.example.Final_Project.Final_Project.controller;


import com.example.Final_Project.Final_Project.dto.PublicUser;
import com.example.Final_Project.Final_Project.dto.UserUpdateRequest;
import com.example.Final_Project.Final_Project.exception.DuplicateUsernameException;
import com.example.Final_Project.Final_Project.exception.InvalidRequestException;
import com.example.Final_Project.Final_Project.models.Users;
import com.example.Final_Project.Final_Project.repositories.UserRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Legacy user endpoints, kept working for the existing frontend features.
 *
 * POST /users/add was removed in Round 1: it stored whatever password the
 * client sent, in plain text. Registration is now POST /auth/register.
 *
 * These endpoints are still unauthenticated and perform no ownership checks.
 * Round 2 adds both; until then the application stays local.
 *
 * CORS is no longer declared per controller - SecurityConfig registers one
 * credentialed configuration for the configured frontend origin.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    UserRepositories userRepositories;

    // Get all users
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        // Public projection only. This endpoint used to be how the frontend
        // logged in, so it must never expose passwords or hashes again.
        List<PublicUser> allUsers = userRepositories.findAll().stream()
                .map(PublicUser::from)
                .toList();
        return new ResponseEntity<>(allUsers, HttpStatus.OK);
    }

    // Get User by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserByID(@PathVariable int id) {
        // Returns the entity so the nested loggedFoods stay in the response,
        // which the dashboard and history views rely on. The password field is
        // @JsonIgnore'd on the entity, so it is not part of the payload.
        Users currentUser = userRepositories.findById(id).orElse(null);
        if (currentUser != null) {
            return new ResponseEntity<>(currentUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    // Update User by ID (profile and goals only)
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUserByID(@PathVariable int id, @RequestBody UserUpdateRequest request) {
        Optional<Users> selectedUserID = userRepositories.findById(id);
        if (selectedUserID.isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        Users existingUser = selectedUserID.get();

        // A null field means "not supplied": the stored value is kept. The
        // password hash is never read from the request, so it cannot be
        // overwritten here. Password changes are deferred to Round 3.
        if (request.name() != null) {
            String name = request.name().trim();
            if (name.isEmpty()) {
                throw new InvalidRequestException("Name cannot be blank.");
            }
            existingUser.setName(name);
        }

        if (request.username() != null) {
            String username = request.username().trim();
            if (username.isEmpty()) {
                throw new InvalidRequestException("Username cannot be blank.");
            }
            if (!username.equals(existingUser.getUsername()) && userRepositories.existsByUsername(username)) {
                throw new DuplicateUsernameException("That username is already taken.");
            }
            existingUser.setUsername(username);
        }

        if (request.calorieGoal() != null) {
            if (request.calorieGoal() < 0) {
                throw new InvalidRequestException("Calorie goal cannot be negative.");
            }
            existingUser.setCalorieGoal(request.calorieGoal());
        }

        if (request.proteinGoal() != null) {
            if (request.proteinGoal() < 0) {
                throw new InvalidRequestException("Protein goal cannot be negative.");
            }
            existingUser.setProteinGoal(request.proteinGoal());
        }

        Users updatedUser = userRepositories.save(existingUser);
        return new ResponseEntity<>(PublicUser.from(updatedUser), HttpStatus.OK);
    }

    //Delete User by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUserByID(@PathVariable int id) {
        // Unchanged legacy endpoint. The frontend control is disabled for this
        // round; an authenticated replacement is deferred to Round 3.
        if (userRepositories.existsById(id)) {
            userRepositories.deleteById(id);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }


}
