package com.example.Final_Project.Final_Project.controller;


import com.example.Final_Project.Final_Project.models.FoodItem;
import com.example.Final_Project.Final_Project.models.LoggedFoods;
import com.example.Final_Project.Final_Project.repositories.FoodItemRepositories;
import com.example.Final_Project.Final_Project.repositories.LoggedFoodsRepositories;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("food-item")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodItemController {

    @Autowired
    FoodItemRepositories foodItemRepositories;

    // For storage to LoggedFoodsRepositories
    @Autowired
    LoggedFoodsRepositories loggedFoodsRepositories;

    //Get all Food Items
    @GetMapping("/all")
    public ResponseEntity<?> getAllFoodItems() {
        List<FoodItem> allFoodItems = foodItemRepositories.findAll();
        return new ResponseEntity<>(allFoodItems, HttpStatus.OK);
    }

    // Get Food Item by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodItemById(@PathVariable int id) {
        FoodItem currentFoodItem = foodItemRepositories.findById(id).orElse(null);
        if (currentFoodItem != null) {
            return new ResponseEntity<>(currentFoodItem, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Food Item not found", HttpStatus.NOT_FOUND);
        }
    }

    // Adding a new Food Item to DB
    @PostMapping("/add/{loggedFoodId}")
    public ResponseEntity<?> addFoodItem(@PathVariable int loggedFoodId, @RequestBody FoodItem foodItem) {
        Optional<LoggedFoods> loggedFoodsOptional = loggedFoodsRepositories.findById(loggedFoodId);

        LoggedFoods loggedFoods = loggedFoodsOptional.get();
        foodItem.setLoggedFoods(loggedFoods);
        FoodItem savedFoodItem = foodItemRepositories.save(foodItem);

        return new ResponseEntity<>(savedFoodItem, HttpStatus.CREATED);
    }

    // Update Food Item by ID
    @PutMapping("update/{id}")
    public ResponseEntity<?> updateFoodItem(@PathVariable int id, @RequestBody FoodItem foodItem) {
        Optional<FoodItem> selectedFoodItem = foodItemRepositories.findById(id);
        if (selectedFoodItem.isPresent()) {
            FoodItem existingFoodItem = selectedFoodItem.get();
            existingFoodItem.setFoodName(foodItem.getFoodName());
            existingFoodItem.setCalories(foodItem.getCalories());
            existingFoodItem.setProtein(foodItem.getProtein());
            existingFoodItem.setCarbs(foodItem.getCarbs());
            existingFoodItem.setFat(foodItem.getFat());
            existingFoodItem.setIngredients(foodItem.getIngredients());

            FoodItem updatedFoodItem = foodItemRepositories.save(existingFoodItem);
            return new ResponseEntity<>(updatedFoodItem, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Food Item not found", HttpStatus.NOT_FOUND);
        }
    }

    // Delete Food Item by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFoodItem(@PathVariable int id) {
        if (foodItemRepositories.existsById(id)) {
            foodItemRepositories.deleteById(id);
            return new ResponseEntity<>("Food Item deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Food Item not found", HttpStatus.NOT_FOUND);
        }
    }
}
