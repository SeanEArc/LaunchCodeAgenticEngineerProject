package com.example.Final_Project.Final_Project.config;

import com.example.Final_Project.Final_Project.security.JsonAccessDeniedHandler;
import com.example.Final_Project.Final_Project.security.JsonAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Round 1 security: session cookie authentication for /auth/**, CSRF on every
 * mutation, and credentialed CORS for the configured frontend origin.
 *
 * The legacy /users, /logged-foods and /food-item endpoints stay open on
 * purpose. Round 2 adds authentication and per-user ownership checks there;
 * until then the application is local-only.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /** Comma-separated list; locally http://localhost:5173. */
    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    /** Header the client must echo the CSRF token back on. */
    public static final String CSRF_HEADER_NAME = "X-CSRF-TOKEN";

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Token lives in the session, never in a readable cookie, so the client can
     * hold it in memory and no browser storage is involved.
     */
    @Bean
    public CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName(CSRF_HEADER_NAME);
        return repository;
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   CsrfTokenRepository csrfTokenRepository,
                                                   SecurityContextRepository securityContextRepository)
            throws Exception {

        // Plain handler rather than the XOR default: the token value then stays
        // stable for the session, which is what a client caching it in memory
        // needs. BREACH masking buys nothing here because the token is only
        // ever served from a JSON endpoint, never embedded in an HTML page.
        CsrfTokenRequestAttributeHandler csrfRequestHandler = new CsrfTokenRequestAttributeHandler();

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf
                        .csrfTokenRepository(csrfTokenRepository)
                        .csrfTokenRequestHandler(csrfRequestHandler))
                .securityContext(context -> context.securityContextRepository(securityContextRepository))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(new JsonAuthenticationEntryPoint())
                        .accessDeniedHandler(new JsonAccessDeniedHandler()))
                // No browser form login, no basic auth prompt, and no framework
                // /logout endpoint: AuthController owns the whole flow.
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/csrf", "/auth/register", "/auth/login", "/auth/logout").permitAll()
                        .requestMatchers("/auth/me").authenticated()
                        // Deferred to Round 2 (see class comment).
                        .anyRequest().permitAll());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Content-Type", "Accept", "X-Requested-With", CSRF_HEADER_NAME));
        // Required for the session and CSRF cookies to travel cross-origin.
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
