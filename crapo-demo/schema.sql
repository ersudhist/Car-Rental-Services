CREATE DATABASE IF NOT EXISTS `Car_rental_services`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `Car_rental_services`;

CREATE TABLE IF NOT EXISTS `cars` (
  `car_id` VARCHAR(255) NOT NULL,
  `brand` VARCHAR(255) NULL,
  `model` VARCHAR(255) NULL,
  `year` INT NULL,
  `mileage` DOUBLE NULL,
  `rent_per_hour` DOUBLE NOT NULL,
  `city` VARCHAR(255) NULL,
  `availability` BOOLEAN NOT NULL,
  `is_delete` BOOLEAN NOT NULL,
  PRIMARY KEY (`car_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `customers` (
  `username` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NULL,
  `address` VARCHAR(255) NULL,
  `contact_details` VARCHAR(255) NULL,
  `password` VARCHAR(255) NULL,
  `is_deleted` BOOLEAN NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `uk_customers_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reservations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `car_id` VARCHAR(255) NULL,
  `username` VARCHAR(255) NULL,
  `rental_period_start` DATETIME(6) NULL,
  `rental_period_end` DATETIME(6) NULL,
  PRIMARY KEY (`id`),
  KEY `idx_reservations_car_id` (`car_id`),
  KEY `idx_reservations_username` (`username`),
  CONSTRAINT `fk_reservations_car` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`),
  CONSTRAINT `fk_reservations_customer` FOREIGN KEY (`username`) REFERENCES `customers` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Transactions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `reservation_id` BIGINT NULL,
  `amount` DOUBLE NULL,
  PRIMARY KEY (`id`),
  KEY `idx_transactions_reservation_id` (`reservation_id`),
  CONSTRAINT `fk_transactions_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` BIGINT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(254) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `car_categories` (
  `category_id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uk_car_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vehicles` (
  `vehicle_id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `registration_number` VARCHAR(30) NOT NULL,
  `brand` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `year` SMALLINT NULL,
  PRIMARY KEY (`vehicle_id`),
  UNIQUE KEY `uk_vehicles_registration` (`registration_number`),
  KEY `idx_vehicles_username` (`username`),
  CONSTRAINT `fk_vehicles_customer` FOREIGN KEY (`username`) REFERENCES `customers` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `rental_bookings` (
  `booking_id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NULL,
  `car_id` VARCHAR(255) NOT NULL,
  `pickup_city` VARCHAR(100) NOT NULL,
  `dropoff_city` VARCHAR(100) NOT NULL,
  `pickup_at` DATETIME NOT NULL,
  `return_at` DATETIME NOT NULL,
  `status` ENUM('BOOKED', 'CONFIRMED', 'READY', 'PICKED_UP', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'BOOKED',
  `base_amount` DECIMAL(10,2) NOT NULL,
  `tax_amount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `security_deposit` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `idx_rental_bookings_customer` (`username`),
  KEY `idx_rental_bookings_car_dates` (`car_id`, `pickup_at`, `return_at`),
  CONSTRAINT `fk_rental_bookings_customer` FOREIGN KEY (`username`) REFERENCES `customers` (`username`),
  CONSTRAINT `fk_rental_bookings_car` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` BIGINT NOT NULL AUTO_INCREMENT,
  `booking_id` BIGINT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `method` ENUM('UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH_ON_PICKUP') NOT NULL,
  `status` ENUM('PENDING', 'PAID', 'REFUNDED', 'FAILED') NOT NULL DEFAULT 'PENDING',
  `paid_at` DATETIME NULL,
  PRIMARY KEY (`payment_id`),
  KEY `idx_payments_booking` (`booking_id`),
  CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `rental_bookings` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `service_categories` (
  `service_category_id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(500) NULL,
  `estimated_minutes` SMALLINT UNSIGNED NULL,
  `starting_price` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`service_category_id`),
  UNIQUE KEY `uk_service_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `service_centers` (
  `service_center_id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `address` VARCHAR(500) NULL,
  `phone` VARCHAR(30) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`service_center_id`),
  KEY `idx_service_centers_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mechanics` (
  `mechanic_id` BIGINT NOT NULL AUTO_INCREMENT,
  `service_center_id` BIGINT NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `specialty` VARCHAR(120) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`mechanic_id`),
  KEY `idx_mechanics_service_center` (`service_center_id`),
  CONSTRAINT `fk_mechanics_service_center` FOREIGN KEY (`service_center_id`) REFERENCES `service_centers` (`service_center_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `service_bookings` (
  `service_booking_id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NULL,
  `vehicle_id` BIGINT NULL,
  `service_category_id` BIGINT NOT NULL,
  `service_center_id` BIGINT NOT NULL,
  `mechanic_id` BIGINT NULL,
  `preferred_at` DATETIME NOT NULL,
  `pickup_required` BOOLEAN NOT NULL DEFAULT FALSE,
  `issue_description` TEXT NULL,
  `status` ENUM('APPOINTMENT', 'INSPECTION', 'IN_PROGRESS', 'QUALITY_CHECK', 'READY', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'APPOINTMENT',
  `quoted_amount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`service_booking_id`),
  KEY `idx_service_bookings_customer` (`username`),
  KEY `idx_service_bookings_center_date` (`service_center_id`, `preferred_at`),
  CONSTRAINT `fk_service_bookings_customer` FOREIGN KEY (`username`) REFERENCES `customers` (`username`),
  CONSTRAINT `fk_service_bookings_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`),
  CONSTRAINT `fk_service_bookings_category` FOREIGN KEY (`service_category_id`) REFERENCES `service_categories` (`service_category_id`),
  CONSTRAINT `fk_service_bookings_center` FOREIGN KEY (`service_center_id`) REFERENCES `service_centers` (`service_center_id`),
  CONSTRAINT `fk_service_bookings_mechanic` FOREIGN KEY (`mechanic_id`) REFERENCES `mechanics` (`mechanic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `spare_parts` (
  `spare_part_id` BIGINT NOT NULL AUTO_INCREMENT,
  `service_booking_id` BIGINT NOT NULL,
  `part_name` VARCHAR(160) NOT NULL,
  `quantity` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`spare_part_id`),
  KEY `idx_spare_parts_service_booking` (`service_booking_id`),
  CONSTRAINT `fk_spare_parts_service_booking` FOREIGN KEY (`service_booking_id`) REFERENCES `service_bookings` (`service_booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `service_records` (
  `service_record_id` BIGINT NOT NULL AUTO_INCREMENT,
  `service_booking_id` BIGINT NOT NULL,
  `mechanic_id` BIGINT NULL,
  `notes` TEXT NULL,
  `labour_amount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `completed_at` DATETIME NULL,
  PRIMARY KEY (`service_record_id`),
  KEY `idx_service_records_booking` (`service_booking_id`),
  CONSTRAINT `fk_service_records_booking` FOREIGN KEY (`service_booking_id`) REFERENCES `service_bookings` (`service_booking_id`),
  CONSTRAINT `fk_service_records_mechanic` FOREIGN KEY (`mechanic_id`) REFERENCES `mechanics` (`mechanic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `invoices` (
  `invoice_id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NULL,
  `booking_id` BIGINT NULL,
  `service_booking_id` BIGINT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `tax_amount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `grand_total` DECIMAL(10,2) NOT NULL,
  `payment_status` ENUM('UNPAID', 'PAID', 'REFUNDED') NOT NULL DEFAULT 'UNPAID',
  `issued_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`invoice_id`),
  KEY `idx_invoices_customer` (`username`),
  CONSTRAINT `fk_invoices_customer` FOREIGN KEY (`username`) REFERENCES `customers` (`username`),
  CONSTRAINT `fk_invoices_booking` FOREIGN KEY (`booking_id`) REFERENCES `rental_bookings` (`booking_id`),
  CONSTRAINT `fk_invoices_service_booking` FOREIGN KEY (`service_booking_id`) REFERENCES `service_bookings` (`service_booking_id`),
  CONSTRAINT `chk_invoice_source` CHECK (`booking_id` IS NOT NULL OR `service_booking_id` IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `message` VARCHAR(500) NOT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `idx_notifications_customer` (`username`, `is_read`, `created_at`),
  CONSTRAINT `fk_notifications_customer` FOREIGN KEY (`username`) REFERENCES `customers` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
