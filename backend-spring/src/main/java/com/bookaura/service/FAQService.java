package com.bookaura.service;

import com.bookaura.model.FAQ;
import com.bookaura.repository.FAQRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FAQService {

    @Autowired
    private FAQRepository faqRepository;

    public List<FAQ> getAllFAQs() {
        return faqRepository.findAll();
    }

    public FAQ createFAQ(FAQ faq) {
        return faqRepository.save(faq);
    }

    public FAQ updateFAQ(String id, FAQ faqDetails) {
        FAQ faq = faqRepository.findById(id).orElseThrow(() -> new RuntimeException("FAQ not found"));
        faq.setQuestion(faqDetails.getQuestion());
        faq.setAnswer(faqDetails.getAnswer());
        return faqRepository.save(faq);
    }

    public void deleteFAQ(String id) {
        faqRepository.deleteById(id);
    }
}
