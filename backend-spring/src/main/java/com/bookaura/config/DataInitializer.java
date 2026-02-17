package com.bookaura.config;

import com.bookaura.model.User;
import com.bookaura.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = Logger.getLogger(DataInitializer.class.getName());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "desithaadmin@gmail.com";
        String adminPassword = "admin@123";

        User admin = userRepository.findByEmail(adminEmail).orElse(null);

        if (admin == null) {
            // Try by username as well since register uses email as username sometimes
            admin = userRepository.findByUsername(adminEmail).orElse(null);
        }

        if (admin == null) {
            admin = new User();
            admin.setUsername(adminEmail);
            admin.setEmail(adminEmail);
            admin.setRole(User.Role.ADMIN);
            admin.setProvider("local");
            logger.info("Creating new admin user: " + adminEmail);
        } else {
            logger.info("Updating existing admin user: " + adminEmail);
            // Ensure role is admin
            admin.setRole(User.Role.ADMIN);
        }

        // Always set/reset password
        admin.setPassword(passwordEncoder.encode(adminPassword));

        userRepository.save(admin);
        logger.info("Admin user set successfully: " + adminEmail);
    }
}
