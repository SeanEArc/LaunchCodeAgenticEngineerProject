package com.example.Final_Project.Final_Project.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class FoodItem {

    @Id
    @GeneratedValue
    private int id;

    private String foodName;
    private int calories;
    private int protein;
    private int carbs;
    private int fat;

    @ElementCollection
    private List<String> ingredients;

    @ManyToOne
    @JsonBackReference
    private LoggedFoods loggedFoods;

    // ------------------------ Contructors ---------------------------------

    public FoodItem() {}

    public FoodItem(String foodName, int calories, int protein, int carbs, int fat, List<String> ingredients, LoggedFoods loggedFoods) {
        this.foodName = foodName;
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fat = fat;
        this.ingredients = ingredients;
        this.loggedFoods = loggedFoods;
    }

    public FoodItem(String foodName, int calories) {
        this.foodName = foodName;
        this.calories = calories;
    }

    public FoodItem(String foodName, int calories, List<String> ingredients) {
        this.foodName = foodName;
        this.calories = calories;
        this.ingredients = ingredients;
    }

    public FoodItem(String foodName, int calories, int protein, int carbs, int fat, List<String> ingredients) {
        this.foodName = foodName;
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fat = fat;
        this.ingredients = ingredients;
    }

    // ------------------------Getters and Setters -----------------------------------------------
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public int getCalories() {
        return calories;
    }

    public void setCalories(int calories) {
        this.calories = calories;
    }

    public int getProtein() {
        return protein;
    }

    public void setProtein(int protein) {
        this.protein = protein;
    }

    public int getCarbs() {
        return carbs;
    }

    public void setCarbs(int carbs) {
        this.carbs = carbs;
    }

    public int getFat() {
        return fat;
    }

    public void setFat(int fat) {
        this.fat = fat;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public LoggedFoods getLoggedFoods() {
        return loggedFoods;
    }

    public void setLoggedFoods(LoggedFoods loggedFoods) {
        this.loggedFoods = loggedFoods;
    }


}
