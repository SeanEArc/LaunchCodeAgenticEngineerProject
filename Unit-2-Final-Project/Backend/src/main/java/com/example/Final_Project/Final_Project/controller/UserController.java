package com.example.Final_Project.Final_Project.controller;


import com.example.Final_Project.Final_Project.models.Users;
import com.example.Final_Project.Final_Project.repositories.UserRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    UserRepositories userRepositories;

    // Create a new user
    @PostMapping("/add")
    public ResponseEntity<Users> createUser(@RequestBody Users users){
        Users saveUser = userRepositories.save(users);
        return ResponseEntity.status(HttpStatus.CREATED).body(saveUser);
    }

    // Get all users
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        List<Users> allUsers = userRepositories.findAll();
        return new ResponseEntity<>(allUsers, HttpStatus.OK);
    }

    // Get User by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserByID(@PathVariable int id) {
        Users currentUser = userRepositories.findById(id).orElse(null);
        if (currentUser != null) {
            return new ResponseEntity<>(currentUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    // Update User by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUserByID(@PathVariable int id, @RequestBody Users users) {
        Optional<Users> selectedUserID = userRepositories.findById(id);
        if (selectedUserID.isPresent()) {
            Users existingUser = selectedUserID.get();
            existingUser.setName(users.getName());
            existingUser.setUsername(users.getUsername());
            existingUser.setPassword(users.getPassword());
            existingUser.setCalorieGoal(users.getCalorieGoal());
            existingUser.setProteinGoal(users.getProteinGoal());
            Users updatedUser = userRepositories.save(existingUser);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    //Delete User by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUserByID(@PathVariable int id) {
        if (userRepositories.existsById(id)) {
            userRepositories.deleteById(id);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }


}
