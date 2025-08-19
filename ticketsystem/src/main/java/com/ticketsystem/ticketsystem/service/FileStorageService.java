package com.ticketsystem.ticketsystem.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
     private final Path  uploadDir=Paths.get(System.getProperty("user.dir")).resolve("uploads");

    public String storeFiles(MultipartFile file){

        try{
           Files.createDirectories(uploadDir);
           String fileName=UUID.randomUUID().toString().substring(0,7)+"-"+file.getOriginalFilename();
           Path filePath = uploadDir.resolve(fileName); 
           file.transferTo(filePath.toFile());
           return "/uploads/"+fileName;
        }catch(IOException e){
           throw new RuntimeException("File storing failed: " + e.getMessage());
        }
    }
}
