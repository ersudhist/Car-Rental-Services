package com.masai;

import java.util.Scanner;

import com.masai.entity.Customer;
import com.masai.exception.NoRecordFoundException;
import com.masai.services.CustomerServices;
import com.masai.services.CustomerServicesImpl;

public class Main {
    public static void main( String[] args ) {
     
    	System.out.println("Wlecome to the Car Rental Services");
    	System.out.println();
    	System.out.println("==========================");
    	
 
    	Scanner sc = new Scanner(System.in);
    	
    	int choice; 
  
    	do
    	{	
    		System.out.println("Choice the option: ");
        	System.out.println("1. Login as Admin");
        	System.out.println("2. Resister as Customer");
        	System.out.println("3. Login as Customer");
        	System.out.println("0.Exit the system");
        	choice = Integer.parseInt(sc.nextLine());
     
    		switch (choice) {
			case 1: {
				adminLogin(sc);
				break;
			}
			case 2:
			{
				resisterCustomer(sc);
				break;
			}
			case 3:
			{
				loginAsCustomer(sc);
				break;
			}
			case 0 :
			{
				System.out.println("Thank you for visit our system.");
				break;
			}
			default:
				System.out.println("Invalid choice, Please try again...");
				break;
			}
    		
    	}while(choice!=0);
    	sc.close();
    }

    
  
	private static void adminLogin(Scanner sc) {
		System.out.print("Enter username ");
		String username = sc.nextLine();
		System.out.print("Enter password ");
		String password = sc.nextLine();
		if(username.equals("admin") && password.equals("admin")) {
			adminMenu(sc);
		}else {
			System.out.println("Invalid Username or Password");
		}
	}
	
	
	private static void displayAdminMenu() {
    	System.out.println("1. Add New Car to the system");
	    System.out.println("2. Update the details of the car");
	    System.out.println("3. Delete car from the system");
	    System.out.println("4. Add back the deleted car");
	    System.out.println("5. Generate report for a car");
	    System.out.println("6. View all Car Details");
	    System.out.println("7. View All removed Cars");
	    System.out.println("8. View all customers");
	    System.out.println("9. Remove customer from the system.");
	    System.out.println("0. Log out.");
    }
	
	
	private static void adminMenu(Scanner sc) {
		System.out.println("=============");
		System.out.println("Welcome Admin");
	    int choice=0;
	    do
        {
	      displayAdminMenu();
	      System.out.println("Please Make the choice: ");
		 
		  
           choice  = Integer.parseInt(sc.nextLine());
         
         
        	 switch(choice)
        	 {
        	 case 1:
        	 {
      		 AdminUI.addNewCarRecord(sc);
        		 break;
        	 }
        	 case 2 :
        	 {
        		 AdminUI.updateCarDetails(sc);
        		 break;
        	 }
        	 case 3:
        	 {
        		  AdminUI.deleteCarFromSystem(sc);
        		 break;
        	 }
        	 case 4:
        	 {
        		 AdminUI.addBackTheRecord(sc);
        		 break;
        	 }
        	 case 5:
        	 {
        		  AdminUI.generateReportForCar(sc);
        		 break;
        	 }
        	 case 6 :
        	 {
        		  AdminUI.viewAllCarDetails();
        		 break;
        		 
        	 }
        	 case 7:
        	 {
        		  AdminUI.viewAllRemovedCarList();
        		 break;
        	 }
        	 case 8:
        	 {
        		  AdminUI.viewAllCustomers();
        		 break;
        	 }
        	 case 9:
        	 {
        		  AdminUI.RemoveCustomer(sc);
        		 break;
        	 }
        	 case 0:
        	 {
        		 System.out.println("Logout returning to the main menu.");
        		 break;
        	 }
        	 default :
        	 {
        		 System.out.println("Invalid choice . Please try again...");
        	 }
        		 
        	 
        	 }
        	 
         }while(choice!=0);
	}
	
	
	private static void resisterCustomer(Scanner sc) {

	     System.out.println("Welcome user. Please fill all the details.");
	     System.out.println("Enter your name: ");
	     String name = sc.nextLine();
	     System.out.println("Enter you contact number: ");
	     String contact = sc.nextLine();
	     
	     if(contact.length()!=10) {
	    	 System.out.println("Invalid contact number (length==10 only)");
	    	 return;
	     }
	     
	     System.out.println("Enter your Email: ");
	     String email = sc.nextLine();
	     
	     if(!email.contains("@gmail.com")) {
	    	 System.out.println("Invalid username must contains @gmail.com");
	    	 return;
	     }
	     
	     System.out.println("Enter your city and state name");
	     String address = sc.nextLine();
	     System.out.println("Enter a unique password: ");
	     String password = sc.nextLine();
	     
	     Customer customer = new Customer(email, name, address, contact, password, false);
	     
	        CustomerServices cusServices = new CustomerServicesImpl();
	        
	        cusServices.addCustomer(customer);
	          
		}
	
	
	 private static void loginAsCustomer(Scanner sc) {
			
	    	
	    	System.out.println("Enter the username: ");
	    	String username = sc.nextLine();
	    	System.out.println("Enter the password: ");
	    	String password = sc.nextLine();
	    	
	    	CustomerServices cusServices = new CustomerServicesImpl();
	    	
		
				try {
					cusServices.customerLogin(username,password);
					customerMenu(sc,username);   
				} catch (NoRecordFoundException e) {
					System.out.println(e.getMessage());
				}
				 	
		}
	 
	 
	 private static void displayCustomerMenu() {
	    	System.out.println("1. Search car for rent.");
	    	System.out.println("2. view all the cars");
	    	System.out.println("3. Make the reservation.");
	    	System.out.println("4. Modify reservation");
	    	System.out.println("5. Cancelling reservation");
	    	System.out.println("6. View all the reservation details");
	    	System.out.println("0. Logout");
	    }


		private static void customerMenu(Scanner sc,String username) {
			
			System.out.println("Please make your choice: ");
		    int choice=0;
		    do 
		    {
		      displayCustomerMenu();
		      System.out.println("Please Make the choice: ");
			 
			  
	           choice  = Integer.parseInt(sc.nextLine());
	         
	         
	        	 switch(choice)
	        	 {
	        	 case 1:
	        	 {
	      		    CustomerUI.searchCar(sc);
	        		 break;
	        	 }
	        	 case 2 :
	        	 {
	        		 CustomerUI.viewAllCars();
	        		 break;
	        	 }
	        	 case 3:
	        	 {
	        		 CustomerUI.makeReservation(sc,username);
	        		 break;
	        	 }
	        	 case 4:
	        	 {
	        		 CustomerUI.modifyReservation(sc,username);
	        		 break;
	        	 }
	        	 case 5:
	        	 {
	        		 CustomerUI.cancelReservation(sc,username);
	        		 break;
	        	 }
	        	 case 6 :
	        	 {
	        		  CustomerUI.getAllTheReservations(username);
	        		 break;
	        		 
	        	 }
	        	 case 7:
	        	 {
	        		  AdminUI.viewAllRemovedCarList();
	        		 break;
	        	 }
	        	 case 8:
	        	 {
	        		  AdminUI.viewAllCustomers();
	        		 break;
	        	 }
	        	 case 0:
	        	 {
	        		 System.out.println("Logout returning to the main menu.");
	        		 break;
	        	 }
	        	 default :
	        	 {
	        		 System.out.println("Invalid choice . Please try again...");
	        	 }
	        		 
	        	 
	        	 }
	        	 
	         }while(choice!=0);
			
		}
	
}
