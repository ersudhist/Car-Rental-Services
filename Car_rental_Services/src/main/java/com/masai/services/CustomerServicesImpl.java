package com.masai.services;

import java.time.LocalDateTime;
import java.util.List;

import com.masai.DAO.AdminDAO;
import com.masai.DAO.AdminDAOImpl;
import com.masai.DAO.CustomerDAO;
import com.masai.DAO.CustomerDAOImpl;
import com.masai.entity.Car;
import com.masai.entity.Customer;
import com.masai.entity.Reservation;
import com.masai.exception.NoRecordFoundException;
import com.masai.exception.SomeThingWentWrongException;

public class CustomerServicesImpl implements CustomerServices {

	@Override
	public void addCustomer(Customer customer) {
		
		CustomerDAO dao = new CustomerDAOImpl();
		dao.addCustomer(customer);
	}

	@Override
	public void customerLogin(String username, String password) throws NoRecordFoundException {
	
		CustomerDAO dao = new CustomerDAOImpl();
		dao.customerLogin(username,password);
			
	}

	@Override
	public List<Car> searchByRentalRange(int min, int max) throws SomeThingWentWrongException, NoRecordFoundException {
     
		AdminDAO dao = new AdminDAOImpl();
		
	    List<Car> carList=	dao.getCarList();
		
		return carList.stream().filter(c->c.getRent()>min && c.getRent()<max).toList();
		
	}

	@Override
	public List<Car> searchByMileageRange(int min, int max) throws SomeThingWentWrongException, NoRecordFoundException {
		
		AdminDAO dao = new AdminDAOImpl();
		
		List<Car> carList=	dao.getCarList();
			
		return carList.stream().filter(c->c.getMileage()>min && c.getMileage()<max).toList();
	}

	@Override
	public List<Car> searchByCity(String city) throws SomeThingWentWrongException, NoRecordFoundException {

		AdminDAO dao = new AdminDAOImpl();
		
		List<Car> carList=	dao.getCarList();
			
		return carList.stream().filter(c->c.getCity().contains(city)).toList();
	}

	@Override
	public List<Car> viewAllCars() throws SomeThingWentWrongException, NoRecordFoundException {
        
		AdminDAO dao = new AdminDAOImpl();
		CustomerDAO daoC = new CustomerDAOImpl();
		daoC.updateCarAvailability();
		return dao.getCarList();
	}

	@Override
	public Car getCarById(String resId) throws SomeThingWentWrongException, NoRecordFoundException {
		
		AdminDAO dao = new AdminDAOImpl();
		return dao.getCarList().get(0);
	}

	@Override
	public void makeReservation(String username, String resId, LocalDateTime rentalPeriodStart,
		LocalDateTime rentalPeriodEnd, long hours) throws SomeThingWentWrongException {
		
		CustomerDAO dao = new CustomerDAOImpl();
		dao.makeReservation(username,resId,rentalPeriodStart,rentalPeriodEnd,hours);	
	}

	@Override
	public List<Reservation> viewAllReservations(String username) throws SomeThingWentWrongException {
		
		CustomerDAO dao = new CustomerDAOImpl();
	    return dao.viewAllReservations(username);
			
	}

	@Override
	public void cancelReservation(String username, Long id, String pass) throws SomeThingWentWrongException {
		
		CustomerDAO dao = new CustomerDAOImpl();
		dao.cancelReservation(username,id,pass);
	}

	@Override
	public void modifyReservation(String username, Long resId, LocalDateTime rentalPeriodStart,
		LocalDateTime rentalPeriodEnd, long hours) {
		CustomerDAO dao = new CustomerDAOImpl();
		dao.modifyReservation(username,resId,rentalPeriodStart,rentalPeriodEnd,hours);
	}

}
