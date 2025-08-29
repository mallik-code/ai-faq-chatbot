package com.aifaq.chatbot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aifaq.chatbot.model.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    // Custom queries will be added here
}
