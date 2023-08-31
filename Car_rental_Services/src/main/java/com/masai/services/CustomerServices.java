package com.masai.services;

import java.time.LocalDateTime;
import java.util.List;

import com.masai.entity.Car;
import com.masai.entity.Customer;
import com.masai.entity.Reservation;
import com.masai.exception.NoRecordFoundException;
import com.masai.exception.SomeThingWentWrongException;

public interface CustomerServices {

	void addCustomer(Customer customer);

	void customerLogin(String username, String password) throws NoRecordFoundException;

	List<Car> searchByRentalRange(int min, int max) throws SomeThingWentWrongException, NoRecordFoundException;

	List<Car> searchByMileageRange(int min, int max) throws SomeThingWentWrongException, NoRecordFoundException;

	List<Car> searchByCity(String city) throws SomeThingWentWrongException, NoRecordFoundException;

	List<Car> viewAllCars() throws SomeThingWentWrongException, NoRecordFoundException;

	Car getCarById(String resId) throws SomeThingWentWrongException, NoRecordFoundException;

	void makeReservation(String username, String resId, LocalDateTime rentalPeriodStart, LocalDateTime rentalPeriodEnd,
			long hours) throws SomeThingWentWrongException;

	List<Reservation> viewAllReservations(String username) throws SomeThingWentWrongException;

	void cancelReservation(String username, Long id, String pass) throws SomeThingWentWrongException;

	void modifyReservation(String username, Long resId, LocalDateTime rentalPeriodStart, LocalDateTime rentalPeriodEnd,
			long hours);

}
