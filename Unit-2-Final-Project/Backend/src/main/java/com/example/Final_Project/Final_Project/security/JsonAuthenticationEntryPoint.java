package com.example.Final_Project.Final_Project.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

/**
 * Returns 401 as JSON instead of redirecting to a login form.
 *
 * ExceptionTranslationFilter routes an AccessDeniedException raised for an
 * anonymous request here rather than to the AccessDeniedHandler, so a CSRF
 * failure on a public mutation (login, registration) would otherwise surface as
 * 401. The contract calls for 403, so that case is detected and re-mapped.
 */
public class JsonAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        if (JsonErrorWriter.isCsrfFailure(authException)) {
            JsonErrorWriter.write(response, HttpStatus.FORBIDDEN.value(), "Invalid or missing CSRF token.");
            return;
        }
        JsonErrorWriter.write(response, HttpStatus.UNAUTHORIZED.value(), "Authentication required.");
    }
}
