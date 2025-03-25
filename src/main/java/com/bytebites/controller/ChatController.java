package com.bytebites.controller;

import com.bytebites.config.OpenAIConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ChatController {
    
    private final OpenAIConfig openAIConfig;
    private final RestTemplate restTemplate;
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    @Autowired
    public ChatController(OpenAIConfig openAIConfig) {
        this.openAIConfig = openAIConfig;
        this.restTemplate = new RestTemplate();
    }
    
    @PostMapping
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        try {
            // Prepare headers with API key
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAIConfig.getOpenaiApiKey());

            // Prepare the request body for OpenAI
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", Arrays.asList(
                Map.of(
                    "role", "system",
                    "content", "You are ByteBites AI assistant, helping users with restaurant orders, menus, and food delivery. Keep responses friendly and concise."
                ),
                Map.of(
                    "role", "user",
                    "content", request.getMessage()
                )
            ));
            requestBody.put("max_tokens", 150);
            requestBody.put("temperature", 0.7);

            // Make the API call
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                OPENAI_API_URL,
                HttpMethod.POST,
                entity,
                Map.class
            );

            // Extract the response
            if (response.getBody() != null && response.getBody().containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    String content = (String) message.get("content");
                    return ResponseEntity.ok(new ChatResponse(content.trim()));
                }
            }

            return ResponseEntity.ok(new ChatResponse("I apologize, but I'm having trouble understanding. Could you please rephrase your question?"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ChatResponse("I apologize, but I'm experiencing technical difficulties. Please try again later."));
        }
    }
}

class ChatRequest {
    private String message;
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}

class ChatResponse {
    private String message;
    
    public ChatResponse(String message) {
        this.message = message;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
} 