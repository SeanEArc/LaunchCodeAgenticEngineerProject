package com.example.Final_Project.Final_Project.exception;

/** Rejected input. Surfaces as 400. */
public class InvalidRequestException extends RuntimeException {

    public InvalidRequestException(String message) {
        super(message);
    }
}
