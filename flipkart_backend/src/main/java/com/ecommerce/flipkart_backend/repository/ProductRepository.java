package com.ecommerce.flipkart_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.flipkart_backend.entity.Product;

import jakarta.persistence.LockModeType;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByVendorIdAndIsDeletedFalse(Long vendorId);
    
    List<Product> findByIsDeletedFalse();
    
    List<Product> findByCategoryAndIsDeletedFalse(String category);
    
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByName(@Param("keyword") String keyword);
    
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND p.id = :id")
    Product findByIdAndNotDeleted(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id AND p.isDeleted = false")
    Product findByIdForUpdate(@Param("id") Long id);
}