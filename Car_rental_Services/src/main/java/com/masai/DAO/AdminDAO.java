package com.masai.DAO;

import java.util.List;

import com.masai.entity.Car;
import com.masai.entity.Customer;
import com.masai.entity.Reservation;
import com.masai.exception.NoRecordFoundException;
import com.masai.exception.RecordDeletedException;
import com.masai.exception.SomeThingWentWrongException;

public interface AdminDAO {

	List<Customer> getCustomerList() throws SomeThingWentWrongException, NoRecordFoundException;
	
	List<Car> getCarList() throws SomeThingWentWrongException, NoRecordFoundException; 
	
	List<Reservation> getReservationList();
	
	void addCar(Car car) throws SomeThingWentWrongException;
	
	void addBack(String carId) throws SomeThingWentWrongException, NoRecordFoundException;
	
	void updateCar(String Id , Car car) throws NoRecordFoundException, SomeThingWentWrongException, RecordDeletedException;
	
	void  deleteCar(String carId) throws SomeThingWentWrongException, NoRecordFoundException;
	
	String generateReport(String carId);

	void deleteCustomer(String username) throws SomeThingWentWrongException, NoRecordFoundException;
		
	
	
	
	
	
	
}
