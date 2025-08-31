// WebConfig.java
package com.ticketsystem.ticketsystem.config;

import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get absolute path of "uploads" folder at project root
        String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
        
        System.out.println("📂 Serving uploads from: " + uploadPath);
    }
}
