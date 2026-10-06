package com.example.Final_Project.Final_Project.exception;

/** Username already taken. Surfaces as 409. */
public class DuplicateUsernameException extends RuntimeException {

    public DuplicateUsernameException(String message) {
        super(message);
    }
}
