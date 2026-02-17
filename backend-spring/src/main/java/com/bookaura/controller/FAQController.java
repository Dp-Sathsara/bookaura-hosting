package com.bookaura.controller;

import com.bookaura.model.FAQ;
import com.bookaura.service.FAQService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faqs")
@CrossOrigin(origins = "*")
public class FAQController {

    @Autowired
    private FAQService faqService;

    @GetMapping
    public List<FAQ> getAllFAQs() {
        return faqService.getAllFAQs();
    }

    @PostMapping
    public FAQ createFAQ(@RequestBody FAQ faq) {
        return faqService.createFAQ(faq);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FAQ> updateFAQ(@PathVariable String id, @RequestBody FAQ faqDetails) {
         try {
            return ResponseEntity.ok(faqService.updateFAQ(id, faqDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFAQ(@PathVariable String id) {
        faqService.deleteFAQ(id);
        return ResponseEntity.noContent().build();
    }
}
