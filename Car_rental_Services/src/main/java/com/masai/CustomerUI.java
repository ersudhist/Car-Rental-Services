package com.masai;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Scanner;

import com.masai.DAO.CustomerDAO;
import com.masai.DAO.CustomerDAOImpl;
import com.masai.entity.Car;
import com.masai.entity.Customer;
import com.masai.entity.Reservation;
import com.masai.entity.Transaction;
import com.masai.exception.NoRecordFoundException;
import com.masai.exception.SomeThingWentWrongException;
import com.masai.services.CustomerServices;
import com.masai.services.CustomerServicesImpl;


public class CustomerUI {

	public static void searchCar(Scanner sc) {

       int choice=0;
       do
       {
    	   System.out.println("1. Search Car by rent range");
    	   System.out.println("2. Search car by mileage range");
    	   System.out.println("3. Search by Location. (City name)");
    	   System.out.println("0. back");
    	   
    	    choice = Integer.parseInt(sc.nextLine());
    	   
    	   switch (choice) {
		case 1: {
			byRentRange(sc);
		   break;
		}
		case 2:
		{
			byTheMileageRange(sc);
			break;
		}
		case 3:
		{
			searchByLocation(sc);
			break;
		}
		case 0:
		{
			return;
		}

		default:
			throw new IllegalArgumentException("Unexpected value: " + choice);
		}
    	      
    	   
       }
       while(choice!=0);
			
	}
	
   ////Search by categories methods
	private static void searchByLocation(Scanner sc) {

      System.out.println("Enter the city name: ");
      String city = sc.nextLine();
      
      CustomerServices services = new CustomerServicesImpl();
      
      try {
			List<Car> carList =services.searchByCity(city);
			if(carList.isEmpty())
			{
				System.out.println("The is no car available from "+ city);
				return;
			}else
			{
				carList.forEach(c->
				{
					System.out.println("Resistration number:->"+ c.getId());
					System.out.println("Brand:-> "+c.getBrand());
					System.out.println("Model:-> "+c.getModel());
					System.out.println("Mileage:-> "+c.getMileage());
					System.out.println("Rent per hour:-> "+ c.getRent());
					System.out.println("Resistration city:-> "+c.getCity());
					System.out.print("Availability status:-> ");
					System.out.println(c.isAvailability()?"Available":"Not Available");
					System.out.println("===============================================");
				});
			}
		} catch (SomeThingWentWrongException | NoRecordFoundException e) {
			
		System.out.println(e.getMessage());
		}
	}

	
	
	private static void byTheMileageRange(Scanner sc) {

		System.out.println("Enter the minimun mileage rate: ");
		int min = Integer.parseInt(sc.nextLine());
		System.out.println("Enter the maximun mileage rate: ");
		int max = Integer.parseInt(sc.nextLine());
		
         CustomerServices services = new CustomerServicesImpl();
         
         try {
			List<Car> carList =services.searchByMileageRange(min,max);
			
			if(carList.isEmpty()) {
				System.out.println("The is no car available in this range");
				return;
			} else {
				carList.forEach(c-> {
					System.out.println("Resistration number:->"+ c.getId());
					System.out.println("Brand:-> "+c.getBrand());
					System.out.println("Model:-> "+c.getModel());
					System.out.println("Mileage:-> "+c.getMileage());
					System.out.println("Rent per hour:-> "+ c.getRent());
					System.out.println("Resistration city:-> "+c.getCity());
					System.out.print("Availability status:-> ");
					System.out.println(c.isAvailability()?"Available":"Not Available");
					System.out.println("===============================================");
				});
			}
		} catch (SomeThingWentWrongException | NoRecordFoundException e) {
		System.out.println(e.getMessage());
		}
	}

	
	private static void byRentRange(Scanner sc) {
	
		System.out.println("Enter the minimun rental rate: ");
		int min = Integer.parseInt(sc.nextLine());
		System.out.println("Enter the maximun rental rate: ");
		int max = Integer.parseInt(sc.nextLine());
		
         CustomerServices services = new CustomerServicesImpl();
         
         try {
			List<Car> carList =services.searchByRentalRange(min,max);
			
			if(carList.isEmpty()){
				System.out.println("The is no car available in this price range");
				return;
			} else {
				carList.forEach(c-> {
					System.out.println("Resistration number:->"+ c.getId());
					System.out.println("Brand:-> "+c.getBrand());
					System.out.println("Model:-> "+c.getModel());
					System.out.println("Mileage:-> "+c.getMileage());
					System.out.println("Rent per hour:-> "+ c.getRent());
					System.out.println("Resistration city:-> "+c.getCity());
					System.out.print("Availability status:-> ");
					System.out.println(c.isAvailability()?"Available":"Not Available");
					System.out.println("===============================================");
				});
			}
		} catch (SomeThingWentWrongException | NoRecordFoundException e) {
		System.out.println(e.getMessage());
		}
		
	}


	
	public static void viewAllCars() {
		
		 CustomerServices services = new CustomerServicesImpl();
		 try {
		   List<Car> carList =	services.viewAllCars();
		   if(carList.isEmpty()) {
				System.out.println("The is no car available in this price range");
				return;
			} else {
				carList.stream().filter(c->c.isAvailability()).forEach(c-> {
					System.out.println("Resistration number:->"+ c.getId());
					System.out.println("Brand:-> "+c.getBrand());
					System.out.println("Model:-> "+c.getModel());
					System.out.println("Mileage:-> "+c.getMileage());
					System.out.println("Rent per hour:-> "+ c.getRent());
					System.out.println("Resistration city:-> "+c.getCity());
					System.out.print("Availability status:-> ");
					System.out.println(c.isAvailability()?"Available":"Not Available");
					System.out.println("===============================================");
				});
			}
			
		} catch (SomeThingWentWrongException | NoRecordFoundException e) {
			System.out.println(e.getMessage());
		}
		
	}
	
	
	public static void makeReservation(Scanner sc, String username) {
		    System.out.println("Enter the Registration number of the car: ");
		    String resId = sc.nextLine();
		    
		    System.out.println("Enter the starting date and time for renting (yyyy-MM-dd HH:mm): ");
		    String startDateTimeStr = sc.nextLine();
		    LocalDateTime rentalPeriodStart = LocalDateTime.parse(startDateTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
		
		    if (rentalPeriodStart.isBefore(LocalDateTime.now().plusHours(12))) {
		        System.out.println("Renting time should start at least 12 hours from now.");
		        return;
		    }
		
		    System.out.println("Enter the ending date and time for returning (yyyy-MM-dd HH:mm): ");
		    String endDateTimeStr = sc.nextLine();
		    LocalDateTime rentalPeriodEnd = LocalDateTime.parse(endDateTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
		
		    if (rentalPeriodEnd.isBefore(rentalPeriodStart.plusHours(3))) {
		        System.out.println("Minimum rental duration is 3 hours.");
		        return;
		    }
		
		    // Calculate the duration between the two LocalDateTime objects
		    Duration duration = Duration.between(rentalPeriodStart, rentalPeriodEnd);
		
		    // Get the number of hours from the duration
			    long hours = duration.toHours();
			
			    CustomerServices services = new CustomerServicesImpl();
			
			    try {
			        services.makeReservation(username, resId, rentalPeriodStart, rentalPeriodEnd, hours);
			    } catch (SomeThingWentWrongException e) {
			        System.out.println(e.getMessage());
			    }
    }
	
	
	
		public static void getAllTheReservations(String username) {
					
					CustomerServices services = new CustomerServicesImpl();
					

				    try {
				        List<Reservation> reservations = services.viewAllReservations(username);

				     
				        for (Reservation reservation : reservations) {
				           
				            reservation.getTransactions().size();
                         
				             
				            
				            System.out.println("Reservation ID: " + reservation.getId());
				            System.out.println("Rental Period Start: " + reservation.getRentalPeriodStart());
				            System.out.println("Rental Period End: " + reservation.getRentalPeriodEnd());

				           
				            Customer customer = reservation.getCustomer();
				            System.out.println("Customer Details:");
				            System.out.println("  Username: " + customer.getUsername());
				            System.out.println("  Name: " + customer.getName());
				            System.out.println("  Address: " + customer.getAddress());
				            System.out.println("  Contact Details: " + customer.getContactDetails());

				          
				            Car car = reservation.getCar();
				            System.out.println("Car Details:");
				            System.out.println("  Car ID: " + car.getId());
				            System.out.println("  Brand: " + car.getBrand());
				            System.out.println("  Model: " + car.getModel());
				            System.out.println("  Year: " + car.getYear());
				            System.out.println("  Mileage: " + car.getMileage());
				            System.out.println("  Rent per Hour: " + car.getRent());
				            System.out.println("  City: " + car.getCity());
				            
				            CustomerDAO dao = new CustomerDAOImpl();
				              
				              Transaction t = dao.getTransactionByReservationId(reservation.getId());
				              
				              System.out.println("Total amount paid:-> Rs."+ t.getAmount());
				            

				            System.out.println("=============================================");
				        }
				    } catch (SomeThingWentWrongException e) {
				        System.out.println(e.getMessage());
				    }
				}
		
		
		
				public static void cancelReservation(Scanner sc, String username) {
					
					System.out.println("Enter the reservation id to remove cancel the reservation");
					Long id = Long.parseLong(sc.nextLine());
					
					System.out.println("Enter the password: ");
					String pass = sc.nextLine();
					
					
					CustomerServices services = new CustomerServicesImpl();
					try {
						services.cancelReservation(username,id,pass);
					} catch (SomeThingWentWrongException e) {
						System.out.println(e.getMessage());
					}
					
					
				}
				
				
				public static void modifyReservation(Scanner sc, String username) {
					
					System.out.println("Enter the reservation id to modify");
					 Long resId = Long.parseLong(sc.nextLine());
					
					 System.out.println("Enter the date and time for renting (yyyy-MM-dd HH:mm): ");
					    String startDateTimeStr = sc.nextLine();
					    LocalDateTime rentalPeriodStart = LocalDateTime.parse(startDateTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
					
					    if (rentalPeriodStart.isBefore(LocalDateTime.now().plusHours(12))) {
					        System.out.println("Renting time should start at least 12 hours from now.");
					        return;
					    }
					
					    System.out.println("Enter the date and time for returning (yyyy-MM-dd HH:mm): ");
					    String endDateTimeStr = sc.nextLine();
					    LocalDateTime rentalPeriodEnd = LocalDateTime.parse(endDateTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
					
					    if (rentalPeriodEnd.isBefore(rentalPeriodStart.plusHours(3))) {
					        System.out.println("Minimum rental duration is 3 hours.");
					        return;
					    }
					
					
					    Duration duration = Duration.between(rentalPeriodStart, rentalPeriodEnd);
					
					    
						    long hours = duration.toHours();
						
						    CustomerServices services = new CustomerServicesImpl();
						
						    try {
						        services.modifyReservation(username, resId, rentalPeriodStart, rentalPeriodEnd, hours);
						    } catch (Exception e) {
						        System.out.println(e.getMessage());
						    }
						
				   }
          }
