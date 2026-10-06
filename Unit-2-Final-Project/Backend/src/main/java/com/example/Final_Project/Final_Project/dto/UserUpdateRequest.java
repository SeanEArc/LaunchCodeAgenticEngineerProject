package com.example.Final_Project.Final_Project.dto;

/**
 * Profile/goal update input for the legacy PUT /users/update/{id} endpoint.
 * There is deliberately no password field, so an update can never overwrite the
 * stored hash. A null field means "not supplied" and leaves the stored value
 * untouched.
 */
public record UserUpdateRequest(
        String name,
        String username,
        Integer calorieGoal,
        Integer proteinGoal) {
}
