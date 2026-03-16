package com.ecommerce.flipkart_backend.service;

import com.ecommerce.flipkart_backend.entity.AuditLog;
import com.ecommerce.flipkart_backend.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void createLog(Long orderId, String action, String performedBy) {
        AuditLog log = new AuditLog();
        log.setOrderId(orderId);
        log.setAction(action);
        log.setPerformedBy(performedBy);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }
}