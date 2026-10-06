package com.example.Final_Project.Final_Project.security;

import com.example.Final_Project.Final_Project.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;

import java.io.IOException;

/**
 * Writes the {"message": "..."} error body from inside the filter chain, where
 * @RestControllerAdvice does not apply.
 */
final class JsonErrorWriter {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private JsonErrorWriter() {
    }

    static void write(HttpServletResponse response, int status, String message) throws IOException {
        if (response.isCommitted()) {
            return;
        }
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        MAPPER.writeValue(response.getWriter(), new ErrorResponse(message));
    }

    /** True when this failure was caused by a missing or invalid CSRF token. */
    static boolean isCsrfFailure(Throwable throwable) {
        for (Throwable current = throwable; current != null; current = current.getCause()) {
            if (current instanceof org.springframework.security.web.csrf.CsrfException) {
                return true;
            }
            if (current == current.getCause()) {
                break;
            }
        }
        return false;
    }
}
