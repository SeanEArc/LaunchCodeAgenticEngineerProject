package com.example.Final_Project.Final_Project.controller;

import com.example.Final_Project.Final_Project.models.LoggedFoods;
import com.example.Final_Project.Final_Project.repositories.LoggedFoodsRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/logged-foods")
@CrossOrigin(origins = "http://localhost:5173")
public class LoggedFoodsController {

    @Autowired
    LoggedFoodsRepositories loggedFoodsRepositories;

    private final List<LoggedFoods> loggedFoods = new ArrayList<>();

    // Get all Logged Foods
    @GetMapping("/all")
    public ResponseEntity<?> getAllLoggedFoods(){
    List<LoggedFoods> allLoggedFoods = loggedFoodsRepositories.findAll();
        return new ResponseEntity<>(allLoggedFoods, HttpStatus.OK);
    }

    // Get Logged Food by ID
    @GetMapping(value="/{id}", produces= MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getLoggedFoodById(@PathVariable int id) {
        LoggedFoods currentFoodId = loggedFoodsRepositories.findById(id).orElse(null);
        if (currentFoodId != null) {
            return new ResponseEntity<>
                    (currentFoodId, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Logged Food not found", HttpStatus.NOT_FOUND);
        }
    }

    // Add a new Logged Food to DB (201 Created)
    @PostMapping(value="/add", consumes= MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addLoggedFood(@RequestBody LoggedFoods loggedFood) {
        LoggedFoods saveLoggedFood = loggedFoodsRepositories.save(loggedFood);
        return new ResponseEntity<>(saveLoggedFood, HttpStatus.CREATED);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateLoggedFoodItem(@PathVariable int id, @RequestBody LoggedFoods loggedFood) {
        return loggedFoodsRepositories.findById(id)
                .map(existingLoggedFood  -> {
                    existingLoggedFood.setDate(loggedFood.getDate());
                    existingLoggedFood.setUser(loggedFood.getUser());
                    existingLoggedFood.setLoggedFoodItems(loggedFood.getLoggedFoodItems());

                    LoggedFoods updatedLoggedFood = loggedFoodsRepositories.save(existingLoggedFood);
                    return new ResponseEntity<>(updatedLoggedFood, HttpStatus.OK);
                })
                .orElseGet(() -> {
                    loggedFood.setFoodId(id);
                    LoggedFoods newLoggedFood = loggedFoodsRepositories.save(loggedFood);
                    return new ResponseEntity<>(newLoggedFood, HttpStatus.CREATED);
                });
    }


    // Delete Logged Food by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLoggedFoodById(@PathVariable int id) {
        if (loggedFoodsRepositories.existsById(id)) {
            loggedFoodsRepositories.deleteById(id);
            return new ResponseEntity<>("Logged Food deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Logged Food not found", HttpStatus.NOT_FOUND);
        }
    }

}
