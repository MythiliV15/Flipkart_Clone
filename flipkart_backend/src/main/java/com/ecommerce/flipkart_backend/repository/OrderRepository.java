package com.ecommerce.flipkart_backend.repository;

import com.ecommerce.flipkart_backend.entity.Order;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByCustomerId(Long customerId);
    
    // Pessimistic Locking for concurrency control
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Order findByIdWithLock(@Param("id") Long id);
    
    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId ORDER BY o.createdAt DESC")
    List<Order> findByCustomerOrderByDateDesc(@Param("customerId") Long customerId);

    // Add these methods to OrderRepository.java

    @Query("SELECT oi.product.id, oi.product.name, SUM(oi.quantity), SUM(oi.quantity * oi.priceAtPurchase) " +
        "FROM OrderItem oi GROUP BY oi.product.id ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopProducts(@Param("limit") int limit);

    @Query("SELECT DATE(o.createdAt), SUM(o.totalAmount), COUNT(o) " +
        "FROM Order o WHERE o.createdAt >= :date GROUP BY DATE(o.createdAt) ORDER BY DATE(o.createdAt) DESC")
    List<Object[]> findDailyRevenue(@Param("date") LocalDateTime date);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status != 'CANCELLED'")
    Object[] calculateTotalRevenue();

    @Query("SELECT COUNT(DISTINCT oi.order.id), SUM(oi.quantity), SUM(oi.quantity * oi.priceAtPurchase) " +
           "FROM OrderItem oi " +
           "WHERE oi.product.vendor.id = :vendorId AND oi.order.status != 'CANCELLED'")
    List<Object[]> findVendorAnalysis(@Param("vendorId") Long vendorId);
}