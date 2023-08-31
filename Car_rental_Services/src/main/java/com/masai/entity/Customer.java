package com.masai.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "customers")
public class Customer {
	
	@Id
	@Column(name = "username", unique = true)
    private String username;
	
	@Column(name = "name", nullable = true)
	private String name;
	
	@Column(name = "address", nullable = true)
	private String address;
	
	@Column(name = "contact_details", nullable = true)
	private String contactDetails;
	
	@Column(name = "password", nullable = true)
	private String password;
	
	@Column(name = "is_deleted", nullable = true)
	private boolean deleted;
	
	
	@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
	private List<Reservation> reservations;
	
	
	public Customer() {
		super();
	}


	public Customer(String username, String name, String address, String contactDetails, String password,
			boolean deleted) {
		super();
		this.username = username;
		this.name = name;
		this.address = address;
		this.contactDetails = contactDetails;
		this.password = password;
		this.deleted = deleted;	
	}
	
	
	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public boolean isDeleted() {
		return deleted;
	}


	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}



	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getAddress() {
		return address;
	}


	public void setAddress(String address) {
		this.address = address;
	}


	public String getContactDetails() {
		return contactDetails;
	}


	public void setContactDetails(String contactDetails) {
		this.contactDetails = contactDetails;
	}


	public List<Reservation> getReservations() {
		return reservations;
	}


	public void setReservations(List<Reservation> reservations) {
		this.reservations = reservations;
	}


	@Override
	public String toString() {
		return "Customer [username=" + username + ", name=" + name + ", address=" + address + ", contactDetails="
				+ contactDetails + ", password=" + password + ", deleted=" + deleted + ", reservations=" + reservations
				+ "]";
	}
	
}
