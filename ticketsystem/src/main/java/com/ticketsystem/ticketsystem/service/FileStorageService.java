// FileStorageService.java
package com.ticketsystem.ticketsystem.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads");
    
    @Value("${server.port:8080}")
    private String serverPort;
    
    @Value("${server.servlet.context-path:}")
    private String contextPath;

    public String storeFiles(MultipartFile file) {
        try {
            Files.createDirectories(uploadDir);

            // Clean the original filename - replace spaces and special characters
            String originalName = file.getOriginalFilename();
            String cleanFileName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
            String fileName = UUID.randomUUID().toString().substring(0, 7) + "-" + cleanFileName;
            Path filePath = uploadDir.resolve(fileName);

            file.transferTo(filePath.toFile());

            // Return full URL that matches your WebConfig mapping
            String baseUrl = "http://localhost:" + serverPort + contextPath;
            String fullUrl = baseUrl + "/uploads/" + fileName;
            
            System.out.println("📎 File stored: " + fullUrl);
            return fullUrl;
            
        } catch (IOException e) {
            throw new RuntimeException("File storing failed: " + e.getMessage());
        }
    }
}