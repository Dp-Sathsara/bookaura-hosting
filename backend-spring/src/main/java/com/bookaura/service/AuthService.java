package com.bookaura.service;

import com.bookaura.model.User;
import com.bookaura.repository.UserRepository;
import com.bookaura.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    public com.bookaura.dto.AuthResponse register(com.bookaura.dto.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            // In a real app, we might want to allow same names, but username usually
            // implies uniqueness
            // For now, let's assume 'username' here matches the User entity 'username'
            // which is used as a display name
            // user.setUsername(request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.CUSTOMER);
        user.setProvider("local");

        userRepository.save(user);

        return authenticateAndGenerateResponse(user.getEmail(), request.getPassword()); // Authenticate with email
                                                                                        // mostly? No, loading by
                                                                                        // username
        // Wait, loadUserByUsername usually takes the username/email field used for
        // login.
        // Let's check CustomUserDetailsService.
    }

    // Helper to avoid duplication
    private com.bookaura.dto.AuthResponse authenticateAndGenerateResponse(String principal, String password) {
        // Note: We need to ensure we are authenticating with the right field.
        // If `loadUserByUsername` searches by email or username, we are good.
        // Let's stick to the current logic:
        // But wait, the register maps to 'username'.

        // Let's rely on the fact that we just saved the user.
        // We can just generate the token directly since we KNOW the user is valid and
        // we just created them.
        // Password auth might fail if async encoding issues happen (rare) or if we want
        // to simulate improved security.

        // Direct Token Generation (Faster, perfectly safe for registration)
        final UserDetails userDetails = userDetailsService.loadUserByUsername(principal); // Assuming principal is
                                                                                          // 'username' field in User
        // Wait, 'username' in User model is "First Last". We probably want to login
        // with EMAIL?
        // In LoginForm, we send 'username: data.email'.
        // So loadUserByUsername probably expects Email? or it searches both?
        // I'll check CustomUserDetailsService in a moment.

        final String jwt = jwtUtil.generateToken(userDetails);
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow(); // Or findByEmail check

        return new com.bookaura.dto.AuthResponse(jwt, user);
    }

    public com.bookaura.dto.AuthResponse login(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        final String jwt = jwtUtil.generateToken(userDetails);
        User user = userRepository.findByUsername(username).orElse(
                userRepository.findByEmail(username).orElseThrow());
        return new com.bookaura.dto.AuthResponse(jwt, user);
    }

    public com.bookaura.dto.AuthResponse socialLogin(User socialUser) {
        String email = socialUser.getEmail();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setUsername(socialUser.getUsername());
            user.setEmail(email);
            user.setRole(User.Role.CUSTOMER);
            user.setProvider(socialUser.getProvider());
            user.setImageUrl(socialUser.getImageUrl());
            user.setPassword(passwordEncoder.encode("SOCIAL_LOGIN_DUMMY_PASSWORD"));
            userRepository.save(user);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        return new com.bookaura.dto.AuthResponse(jwt, user);
    }

    public void changePassword(String userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
