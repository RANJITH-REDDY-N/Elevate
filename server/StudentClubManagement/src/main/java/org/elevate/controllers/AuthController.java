package org.elevate.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.elevate.security.JwtUtil;
import org.elevate.services.UserService;
import org.elevate.dtos.AuthenticationRequest;
import org.elevate.dtos.AuthenticationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.regex.Pattern;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Authentication APIs", description = "APIs for user authentication, including login and JWT token generation.")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticates a user and generates a JWT token upon successful login.
     *
     * @param authRequest The user credentials containing email and password.
     * @return A response entity containing the JWT token if authentication is successful.
     *         Returns an error message if authentication fails.
     */
    @PostMapping("/login")
    @Operation(
        summary = "Authenticate User & Generate JWT",
        description = "Validates user credentials and returns a JWT token if successful."
    )
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest authRequest) {

        // Validate email format using regex
        if (!isValidEmail(authRequest.getEmail())) {
            return ResponseEntity.status(400).body("Invalid email format! Please enter a valid email address.");
        }

        try {
            UserDetails userDetails = userService.loadUserByUsername(authRequest.getEmail());
            String storedPassword = userDetails.getPassword();

            if (!passwordEncoder.matches(authRequest.getPassword(), storedPassword)) {
                return ResponseEntity.status(401).body("Incorrect password! Please try again.");
            }

            String role = userService.getUserRole(authRequest.getEmail());
            String token = jwtUtil.generateToken(userDetails.getUsername(), role);

            return ResponseEntity.ok(new AuthenticationResponse(token));

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(404).body("Email address not found.");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Something went wrong. Please try again.");
        }
    }

    /**
     * Validates if the given email address has the correct format.
     * ^(?![_\-.0-9]) → Ensures it does not start with _, -, . or any digit (0-9).
     * [A-Za-z0-9+_.-]+ → Matches valid characters for the local part (before @).
     * @ → Matches the @ symbol.
     * [A-Za-z0-9.-]+ → Matches the domain name (after @).
     * \. → Ensures at least one dot in the domain.
     * [A-Za-z]{2,}$ → Ensures the TLD (top-level domain) is at least 2 characters long.
     *
     * @param email The email address to validate.
     * @return true if the email format is valid, false otherwise.
     */
    private boolean isValidEmail(String email) {
        String emailRegex = "^(?![_\\-.0-9])[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return Pattern.matches(emailRegex, email);
    }

}
