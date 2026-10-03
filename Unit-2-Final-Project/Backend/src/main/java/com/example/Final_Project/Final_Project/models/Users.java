package com.example.Final_Project.Final_Project.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;


@Entity
public class Users {

    @Id
    @GeneratedValue
    private int id;

    private String name;
    private String username;
    private String password;
    private Integer calorieGoal;
    private Integer proteinGoal;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<LoggedFoods> loggedFoods;

    // ------------------------ Constructors ---------------------------------
    public Users() {}

    public Users(int id, String name, String username, String password) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
    }

    public Users(int id, String name, String username, String password, Integer calorieGoal) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.calorieGoal = calorieGoal;
    }

    public Users(int id, String name, String username, String password, Integer calorieGoal, Integer proteinGoal) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.calorieGoal = calorieGoal;
        this.proteinGoal = proteinGoal;
    }

    // ------------------------ Getters and Setters -----------------------------------------------


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<LoggedFoods> getLoggedFoods() {
        return loggedFoods;
    }

    public void setLoggedFoods(List<LoggedFoods> loggedFoods) {
        this.loggedFoods = loggedFoods;
    }

    public Integer getCalorieGoal() {
        return calorieGoal;
    }

    public void setCalorieGoal(Integer calorieGoal) {
        this.calorieGoal = calorieGoal;
    }

    public Integer getProteinGoal() {
        return proteinGoal;
    }

    public void setProteinGoal(Integer proteinGoal) {
        this.proteinGoal = proteinGoal;
    }
}
