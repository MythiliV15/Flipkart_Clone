package com.ecommerce.flipkart_backend.repository;

import com.ecommerce.flipkart_backend.entity.GlobalSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GlobalSettingsRepository extends JpaRepository<GlobalSettings, Long> {
    default GlobalSettings getSettings() {
        List<GlobalSettings> settingsList = findAll();
        if (settingsList.isEmpty()) {
            GlobalSettings newSettings = new GlobalSettings();
            newSettings.setPlatformFee(1.0); // Set to 1.0 to pass @Min(1) validation
            newSettings.setOfferPercentage(0.0);
            newSettings.setOfferEnabled(false);
            return save(newSettings);
        }
        return settingsList.get(0);
    }
}
