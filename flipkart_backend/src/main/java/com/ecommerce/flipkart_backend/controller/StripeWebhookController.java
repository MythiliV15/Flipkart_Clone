package com.ecommerce.flipkart_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.flipkart_backend.service.OrderService;
import com.ecommerce.flipkart_backend.service.StripeService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

@RestController
@RequestMapping("/api/hooks")
public class StripeWebhookController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private StripeService stripeService;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @PostMapping(value = "/stripe", consumes = "application/json")
    public ResponseEntity<?> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        
        Event event = null;
        
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(400).body("Invalid signature");
        }

        // Handle the event
        switch (event.getType()) {
            case "checkout.session.completed":
                handleCheckoutSessionCompleted(event);
                break;
            case "payment_intent.succeeded":
                handlePaymentSucceeded(event);
                break;
            default:
                return ResponseEntity.ok("Event type not handled");
        }

        return ResponseEntity.ok("Webhook processed successfully");
    }

    private void handleCheckoutSessionCompleted(Event event) {
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        if (dataObjectDeserializer.getObject().isPresent()) {
            Session session = (Session) dataObjectDeserializer.getObject().get();
            
            // Extract order ID from metadata or client reference ID
            String orderIdStr = session.getMetadata().get("orderId");
            if (orderIdStr != null) {
                Long orderId = Long.parseLong(orderIdStr);
                try {
                    orderService.confirmOrderPayment(orderId, session.getId());
                    System.out.println("Order " + orderId + " payment confirmed via webhook");
                } catch (Exception e) {
                    System.err.println("Error confirming order payment: " + e.getMessage());
                }
            }
        }
    }

    private void handlePaymentSucceeded(Event event) {
        // Additional payment success handling if needed
        System.out.println("Payment succeeded event received");
    }
}