package com.bookaura.service;

import com.bookaura.model.User;
import com.bookaura.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class CustomUserDetailsService implements UserDetailsService {

        @Autowired
        private UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
                User user = userRepository.findByUsername(usernameOrEmail)
                                .or(() -> userRepository.findByEmail(usernameOrEmail))
                                .or(() -> userRepository.findByEmail(usernameOrEmail.toLowerCase()))
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                "User not found with username or email: " + usernameOrEmail));

                return new org.springframework.security.core.userdetails.User(
                                user.getUsername(), // Use the actual username for the principal ? Or maybe email?
                                                    // usually username is fine.
                                user.getPassword(),
                                java.util.Collections
                                                .singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ROLE_" + user.getRole())));
        }
}
