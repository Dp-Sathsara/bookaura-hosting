package com.bookaura.controller;

import com.bookaura.service.ElevenLabsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/audio")
public class AudioBookController {

    private final ElevenLabsService elevenLabsService;

    public AudioBookController(ElevenLabsService elevenLabsService) {
        this.elevenLabsService = elevenLabsService;
    }

    @PostMapping("/convert")
    public ResponseEntity<byte[]> convertPdfToAudio(@RequestParam("file") MultipartFile file) {
        System.out.println("Received request to convert PDF: " + file.getOriginalFilename());
        try {
            String text = elevenLabsService.extractTextFromPdf(file);
            System.out.println("Extracted text length: " + text.length());
            // ElevenLabs has a character limit, so for a full book we might need to chunk
            // it.
            // For now, let's take a substring or assume a reasonable length for the demo.
            if (text.length() > 5000) {
                text = text.substring(0, 5000);
            }

            byte[] audioData = elevenLabsService.generateAudio(text);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf("audio/mpeg"));
            headers.setContentLength(audioData.length);

            return new ResponseEntity<>(audioData, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
