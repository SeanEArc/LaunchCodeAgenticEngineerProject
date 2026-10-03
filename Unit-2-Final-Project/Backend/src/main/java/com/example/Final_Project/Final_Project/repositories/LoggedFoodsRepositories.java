package com.example.Final_Project.Final_Project.repositories;

import com.example.Final_Project.Final_Project.models.LoggedFoods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoggedFoodsRepositories extends JpaRepository<LoggedFoods, Integer> {
}
