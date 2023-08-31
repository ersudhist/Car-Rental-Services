package com.masai.services;

import java.util.List;

import com.masai.DAO.AdminDAO;
import com.masai.DAO.AdminDAOImpl;
import com.masai.entity.Car;
import com.masai.entity.Customer;
import com.masai.entity.Reservation;
import com.masai.exception.NoRecordFoundException;
import com.masai.exception.RecordDeletedException;
import com.masai.exception.SomeThingWentWrongException;

public class AdminServicesImpl implements AdminServices{

	@Override
	public List<Customer> getCustomerList() throws SomeThingWentWrongException, NoRecordFoundException {
		  AdminDAO dao = new AdminDAOImpl();
		  return  dao.getCustomerList();
		 
	}

	@Override
	public List<Car> getCarList() throws SomeThingWentWrongException, NoRecordFoundException {
		 AdminDAO dao = new AdminDAOImpl();
		  return  dao.getCarList();
			 
	}

	@Override
	public List<Reservation> getReservationList() {
		  AdminDAO dao = new AdminDAOImpl();
		  return  dao.getReservationList();
		 
		
	}

	@Override
	public void addCar(Car car) throws SomeThingWentWrongException {

		  AdminDAO dao = new AdminDAOImpl();
		  dao.addCar(car);
		 
	}

	@Override
	public void updateCar(String Id, Car car) throws NoRecordFoundException, SomeThingWentWrongException, RecordDeletedException {
		 AdminDAO dao = new AdminDAOImpl();
		  dao.updateCar(Id, car);
	}

	@Override
	public void deleteCar(String Id) throws SomeThingWentWrongException, NoRecordFoundException {
		 AdminDAO dao = new AdminDAOImpl();
		  dao.deleteCar(Id);
	}

	@Override
	public String generateReport(String carId) {
		 AdminDAO dao = new AdminDAOImpl();
		 return dao.generateReport(carId);
	}

	@Override
	public void addBack(String carId) throws SomeThingWentWrongException, NoRecordFoundException {
		 AdminDAO dao = new AdminDAOImpl();
		  dao.addBack(carId);
		
		
	}

	@Override
	public void deleteCustomer(String username) throws SomeThingWentWrongException, NoRecordFoundException {
		 AdminDAO dao = new AdminDAOImpl();
		  dao.deleteCustomer(username);
	}

}
