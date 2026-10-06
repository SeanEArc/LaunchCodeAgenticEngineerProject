package com.example.Final_Project.Final_Project.dto;

/**
 * Registration input. Only these fields are read: client-supplied ids and
 * nested ownership relationships in the request body are ignored.
 */
public record RegisterRequest(
        String name,
        String username,
        String password,
        Integer calorieGoal,
        Integer proteinGoal) {
}
