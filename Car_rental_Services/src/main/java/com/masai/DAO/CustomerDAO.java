package com.masai.DAO;

import java.time.LocalDateTime;
import java.util.List;

import com.masai.entity.Customer;
import com.masai.entity.Reservation;
import com.masai.entity.Transaction;
import com.masai.exception.NoRecordFoundException;
import com.masai.exception.SomeThingWentWrongException;

public interface CustomerDAO {

	void addCustomer(Customer customer);

	void customerLogin(String username, String password) throws NoRecordFoundException;
	void makeReservation(String username, String resId, LocalDateTime startDateTime, LocalDateTime endDateTime,
			Long hours) throws SomeThingWentWrongException;
	
	
	 void updateCarAvailability();

	List<Reservation> viewAllReservations(String username) throws SomeThingWentWrongException;

	void cancelReservation(String username, Long id, String pass) throws SomeThingWentWrongException;

	Transaction getTransactionByReservationId(Long i);

	void modifyReservation(String username, Long resId, LocalDateTime rentalPeriodStart, LocalDateTime rentalPeriodEnd, long hours); 


}
