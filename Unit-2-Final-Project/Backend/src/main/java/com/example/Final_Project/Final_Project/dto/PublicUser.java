package com.example.Final_Project.Final_Project.dto;

import com.example.Final_Project.Final_Project.models.Users;

/**
 * The only user shape the API hands back. Passwords and hashes are absent by
 * construction rather than by filtering, so no endpoint can leak them.
 */
public record PublicUser(int id, String name, String username, Integer calorieGoal, Integer proteinGoal) {

    public static PublicUser from(Users user) {
        return new PublicUser(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getCalorieGoal(),
                user.getProteinGoal());
    }
}
