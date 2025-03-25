package com.bytebites.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAIConfig {
    
    @Value("${openai.api.key}")
    private String openaiApiKey;
    
    public String getOpenaiApiKey() {
        return openaiApiKey;
    }
} 