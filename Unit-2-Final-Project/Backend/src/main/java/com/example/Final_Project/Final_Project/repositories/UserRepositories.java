package com.example.Final_Project.Final_Project.repositories;

import com.example.Final_Project.Final_Project.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepositories extends JpaRepository<Users, Integer> {

}
