package com.masai.entity;

import java.util.List;
import java.util.Objects;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "cars")
public class Car {

	@Id
	@Column(name = "car_id")
	private String id;
	
	@Column(name = "brand", nullable = true)
	private String brand;
	
	@Column(name = "model", nullable = true)
	private String model;
	
	@Column(name = "year", nullable = true)
	private Integer year;
	
	@Column(name = "mileage", nullable = true)
	private Double mileage;
	
	@Column(name= "rent_per_hour")
	private double rent;
	
	@Column(name = "city")
	private String city;
	
	@Column(name="availability")
	private boolean availability;
	
	@Column(name="is_delete")
	private boolean deleted;
	
	@OneToMany(mappedBy="car", cascade = CascadeType.ALL)
	private List<Reservation> reservations;
	
	
	public Car() {
		super();
	}

	public Car(String id, String brand, String model, Integer year, Double mileage,Double rent, String city, boolean availability,boolean delete) {
		super();
		this.id = id;
		this.brand = brand;
		this.model = model;
		this.year = year;
		this.mileage = mileage;
		this.rent = rent;
		this.city = city;
		this.availability = availability;
		this.deleted = delete;
	}
	
	public String getId() {
		return id;
	}
	

	public String getCity() {
		return city;
	}


	public void setCity(String city) {
		this.city = city;
	}


	public void setId(String id) {
		this.id = id;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public Double getMileage() {
		return mileage;
	}

	public void setMileage(Double mileage) {
		this.mileage = mileage;
	}

	public boolean isAvailability() {
		return availability;
	}

	public void setAvailability(boolean availability) {
		this.availability = availability;
	}
	

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public List<Reservation> getReservations() {
		return reservations;
	}

	public void setReservations(List<Reservation> reservations) {
		this.reservations = reservations;
	}
	

	public double getRent() {
		return rent;
	}

	public void setRent(double rent) {
		this.rent = rent;
	}


	public Car(String brand, String model, Integer year, Double mileage,Double rent, String city, boolean availability,boolean delete) {
		super();
		this.brand = brand;
		this.model = model;
		this.year = year;
		this.mileage = mileage;
		this.rent = rent;
		this.city = city;
		this.availability = availability;
		this.deleted = delete;
	}


	@Override
	public int hashCode() {
		return Objects.hash(availability, brand, city, deleted, id, mileage, model, rent, reservations, year);
	}


	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Car other = (Car) obj;
		return availability == other.availability && Objects.equals(brand, other.brand)
				&& Objects.equals(city, other.city) && deleted == other.deleted && Objects.equals(id, other.id)
				&& Objects.equals(mileage, other.mileage) && Objects.equals(model, other.model)
				&& Double.doubleToLongBits(rent) == Double.doubleToLongBits(other.rent)
				&& Objects.equals(reservations, other.reservations) && Objects.equals(year, other.year);
	}


	@Override
	public String toString() {
		return "Car [id=" + id + ", brand=" + brand + ", model=" + model + ", year=" + year + ", mileage=" + mileage
				+ ", rent=" + rent + ", city=" + city + ", availability=" + availability + ", deleted=" + deleted
				+ ", reservations=" + reservations + "]";
	}
	
	
}
