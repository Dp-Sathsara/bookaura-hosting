package com.bookaura.service;

import com.bookaura.model.ContactMessage;
import com.bookaura.model.ContactStatus;
import com.bookaura.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {
    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private JavaMailSender mailSender;

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    public ContactMessage createMessage(ContactMessage message) {
        return contactMessageRepository.save(message);
    }

    public ContactMessage replyToMessage(String id, String replyText) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Send Email
        sendEmail(message.getEmail(), "Reply to your inquiry: " + message.getSubject(), replyText);

        // Update Message
        message.setAdminReply(replyText);
        message.setStatus(ContactStatus.REPLIED);
        return contactMessageRepository.save(message);
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(body);
        mailMessage.setFrom("BookAura <solaproject2026@gmail.com>");
        mailSender.send(mailMessage);
    }

    public void deleteMessage(String id) {
        contactMessageRepository.deleteById(id);
    }
}
