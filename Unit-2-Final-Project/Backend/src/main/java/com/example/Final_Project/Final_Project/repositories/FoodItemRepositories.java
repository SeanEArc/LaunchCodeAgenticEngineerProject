package com.example.Final_Project.Final_Project.repositories;

import com.example.Final_Project.Final_Project.models.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodItemRepositories extends JpaRepository<FoodItem, Integer> {
}
