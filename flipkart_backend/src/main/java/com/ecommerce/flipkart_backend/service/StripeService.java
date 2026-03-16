package com.ecommerce.flipkart_backend.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.net.Webhook;
import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String apiKey;

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    @PostConstruct
    public void init() {
        Stripe.apiKey = apiKey;
    }

    public Map<String, String> createCheckoutSession(Long orderId, Double amount) throws StripeException {
        Map<String, String> metadata = new HashMap<>();
        metadata.put("orderId", orderId.toString());

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .putAllMetadata(metadata)
                .setClientReferenceId(orderId.toString())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("inr")
                                .setUnitAmount((long) (amount * 100)) // Amount in paise
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName("Order #" + orderId)
                                        .build())
                                .build())
                        .build())
                .build();

        Session session = Session.create(params);

        Map<String, String> response = new HashMap<>();
        response.put("sessionId", session.getId());
        response.put("url", session.getUrl());
        return response;
    }

    public Session getSession(String sessionId) throws StripeException {
        return Session.retrieve(sessionId);
    }

    public boolean verifyWebhookSignature(String payload, String sigHeader, String secret) {
        try {
            com.stripe.model.Event event = Webhook.constructEvent(
                    payload, sigHeader, secret);
            return event != null;
        } catch (Exception e) {
            return false;
        }
    }
}