package com.example.Final_Project.Final_Project.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;

/** Returns 403 as JSON, with a CSRF-specific message when that is the cause. */
public class JsonAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        String message = JsonErrorWriter.isCsrfFailure(accessDeniedException)
                ? "Invalid or missing CSRF token."
                : "Access denied.";
        JsonErrorWriter.write(response, HttpStatus.FORBIDDEN.value(), message);
    }
}
