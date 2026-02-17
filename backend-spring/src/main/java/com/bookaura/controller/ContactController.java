package com.bookaura.controller;

import com.bookaura.model.ContactMessage;
import com.bookaura.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactService contactService;

    // Public endpoint for users
    @PostMapping("/contact/send")
    public ContactMessage sendMessage(@RequestBody ContactMessage message) {
        return contactService.createMessage(message);
    }

    // Admin endpoint to fetch all messages
    @GetMapping("/admin/contact/all")
    public List<ContactMessage> getAllMessages() {
        return contactService.getAllMessages();
    }

    // Admin endpoint to reply
    @PutMapping("/admin/contact/reply/{id}")
    public ResponseEntity<ContactMessage> replyToMessage(@PathVariable String id,
            @RequestBody Map<String, String> payload) {
        String replyText = payload.get("reply");
        ContactMessage updatedMessage = contactService.replyToMessage(id, replyText);
        return ResponseEntity.ok(updatedMessage);
    }

    @DeleteMapping("/admin/contact/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable String id) {
        contactService.deleteMessage(id);
        return ResponseEntity.ok().build();
    }
}
