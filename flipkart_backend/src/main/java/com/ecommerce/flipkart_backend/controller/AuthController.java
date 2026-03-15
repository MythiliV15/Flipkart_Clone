package com.ecommerce.flipkart_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.flipkart_backend.dto.request.LoginRequest;
import com.ecommerce.flipkart_backend.dto.request.RegisterRequest;
import com.ecommerce.flipkart_backend.dto.response.AuthResponse;
import com.ecommerce.flipkart_backend.entity.User;
import com.ecommerce.flipkart_backend.service.UserService;
import com.ecommerce.flipkart_backend.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setRole(request.getRole());
            user.setActive(true);
            
            User savedUser = userService.registerUser(user);
            
            AuthResponse response = new AuthResponse();
            response.setUserId(savedUser.getId());
            response.setName(savedUser.getName());
            response.setEmail(savedUser.getEmail());
            response.setRole(savedUser.getRole());
            response.setAuthenticated(true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            UserDetails userDetails = userService.loadUserByUsername(request.getEmail());
            User dbUser = userService.findByEmail(request.getEmail());
            
            if (dbUser == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            String token = jwtUtil.generateToken(userDetails.getUsername(), dbUser.getRole());

            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setRole(dbUser.getRole());
            response.setName(dbUser.getName());
            response.setEmail(dbUser.getEmail());
            response.setUserId(dbUser.getId());
            response.setAuthenticated(true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials: " + e.getMessage());
        }
    }
}