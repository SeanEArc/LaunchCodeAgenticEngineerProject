package com.example.Final_Project.Final_Project.controller;

import com.example.Final_Project.Final_Project.dto.CsrfTokenResponse;
import com.example.Final_Project.Final_Project.dto.LoginRequest;
import com.example.Final_Project.Final_Project.dto.PublicUser;
import com.example.Final_Project.Final_Project.dto.RegisterRequest;
import com.example.Final_Project.Final_Project.models.Users;
import com.example.Final_Project.Final_Project.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Registration, login, session restoration, logout and the CSRF token
 * endpoint. Authentication is held in the backend session, so a browser
 * refresh is recognised without the client storing anything.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final CsrfTokenRepository csrfTokenRepository;

    public AuthController(AuthService authService,
                          AuthenticationManager authenticationManager,
                          SecurityContextRepository securityContextRepository,
                          CsrfTokenRepository csrfTokenRepository) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.csrfTokenRepository = csrfTokenRepository;
    }

    /**
     * Publicly accessible. Reading the token materialises it and binds it to
     * the caller's session; the client keeps it in memory and re-reads it after
     * login and after logout, since both replace the session's token.
     */
    @GetMapping("/csrf")
    public CsrfTokenResponse csrf(HttpServletRequest request) {
        CsrfToken token = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (token == null) {
            throw new IllegalStateException("CSRF protection is not active on this request.");
        }
        return new CsrfTokenResponse(token.getToken(), token.getHeaderName());
    }

    /** Creates the account only. No session is established; the client goes to login next. */
    @PostMapping("/register")
    public ResponseEntity<PublicUser> register(@RequestBody RegisterRequest request) {
        Users created = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(PublicUser.from(created));
    }

    @PostMapping("/login")
    public ResponseEntity<PublicUser> login(@RequestBody LoginRequest request,
                                            HttpServletRequest httpRequest,
                                            HttpServletResponse httpResponse) {
        String username = request == null || request.username() == null ? "" : request.username().trim();
        String password = request == null || request.password() == null ? "" : request.password();

        // Throws BadCredentialsException for both a wrong password and an
        // unknown username, which the advice turns into a uniform 401.
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(username, password));

        rotateSessionIdentifier(httpRequest);
        replaceCsrfToken(httpRequest, httpResponse);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        return ResponseEntity.ok(PublicUser.from(requireCurrentUser(authentication.getName())));
    }

    /** Profile only. Returns 401 when the session is absent or expired. */
    @GetMapping("/me")
    public PublicUser me(Authentication authentication) {
        if (authentication == null) {
            throw new AuthenticationCredentialsNotFoundException("No active session.");
        }
        return PublicUser.from(requireCurrentUser(authentication.getName()));
    }

    /**
     * Permitted without an active session so a client whose session already
     * expired can still clear its own state; it always reports 204. A valid
     * CSRF token is still required.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            // Drops the authentication and the session's CSRF token together.
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

    /**
     * Session fixation protection: a session identifier handed out before login
     * must not stay valid afterwards.
     */
    private void rotateSessionIdentifier(HttpServletRequest httpRequest) {
        if (httpRequest.getSession(false) != null) {
            httpRequest.changeSessionId();
        } else {
            httpRequest.getSession(true);
        }
    }

    private void replaceCsrfToken(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        csrfTokenRepository.saveToken(null, httpRequest, httpResponse);
        CsrfToken refreshed = csrfTokenRepository.generateToken(httpRequest);
        csrfTokenRepository.saveToken(refreshed, httpRequest, httpResponse);
    }

    /** Guards against a session outliving the row it points at. */
    private Users requireCurrentUser(String username) {
        return authService.findByUsername(username)
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("Account no longer exists."));
    }
}
