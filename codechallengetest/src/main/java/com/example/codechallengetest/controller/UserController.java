package com.example.codechallengetest.controller;

import com.example.codechallengetest.model.User;
import com.example.codechallengetest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable long id) {
        return userRepository.findById(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable long id, @RequestBody User newUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(newUser.getUsername());
                    user.setPassword(newUser.getPassword());
                    user.setFirstName(newUser.getFirstName());
                    user.setLastName(newUser.getLastName());
                    user.setEmail(newUser.getEmail());
                    user.setPhone(newUser.getPhone());
                    user.setAddress(newUser.getAddress());
                    user.setCity(newUser.getCity());
                    user.setState(newUser.getState());
                    user.setZip(newUser.getZip());
                    return userRepository.save(user);
                })
                .orElseGet(() -> {
                    newUser.setId(id);
                    return userRepository.save(newUser);
                });
    }

    @DeleteMapping("/{id}")
    public void deleteUserById(@PathVariable long id) {
        userRepository.deleteById(id);
    }

    @PostMapping("/signin")
    public ResponseEntity<Long> signIn(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent() && userOptional.get().getPassword().equals(password)) {
            Long userId = userOptional.get().getId();
            return ResponseEntity.ok(userId);
        } else {
            return ResponseEntity.status(401).body(-1L);
        }
    }


    @GetMapping("/userdata")
    public ResponseEntity<String> getUserDataFromCookie(@RequestParam Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return ResponseEntity.ok("User data: " + user.getUsername() + user.getId()); // You can customize the response data as needed
        } else {
            return ResponseEntity.badRequest().body("No user data found");
        }
    }


}
