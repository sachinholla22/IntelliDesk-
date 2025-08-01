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
     private final String  uploadDir="uploads/";

    public String storeFiles(MultipartFile file){

        try{
           Files.createDirectories(Paths.get(uploadDir));
           String fileName=UUID.randomUUID()+"-"+file.getOriginalFilename();
           Path filePath=Paths.get(uploadDir+fileName);
           file.transferTo(filePath.toFile());
           return "/uploads/"+fileName;
        }catch(IOException e){
           throw new RuntimeException("File storing failed: " + e.getMessage());
        }
    }
}
