package com.ecommerce.flipkart_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Flipkart Clone API")
                        .version("0.0.1")
                        .description("API Documentation for Flipkart Clone - Multi-Vendor E-Commerce")
                        .contact(new Contact()
                                .name("Development Team")
                                .email("admin@flipkart-clone.com")));
    }
}
