package com.masai.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "reservations")
public class Reservation {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    @ManyToOne
    @JoinColumn(name = "username")
    private Customer customer;

    @Column(name = "rental_period_start", nullable = true)
    private LocalDateTime rentalPeriodStart;

    @Column(name = "rental_period_end", nullable = true)
    private LocalDateTime rentalPeriodEnd;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Transaction> transactions;

   
	public Reservation() {
		super();
	}

	public Reservation(Car car, Customer customer, LocalDateTime rentalPeriodStart, LocalDateTime rentalPeriodEnd) {
		super();
		this.car = car;
		this.customer = customer;
		this.rentalPeriodStart = rentalPeriodStart;
		this.rentalPeriodEnd = rentalPeriodEnd;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Car getCar() {
		return car;
	}

	public void setCar(Car car) {
		this.car = car;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public LocalDateTime getRentalPeriodStart() {
		return rentalPeriodStart;
	}

	public void setRentalPeriodStart(LocalDateTime rentalPeriodStart) {
		this.rentalPeriodStart = rentalPeriodStart;
	}

	public LocalDateTime getRentalPeriodEnd() {
		return rentalPeriodEnd;
	}

	public void setRentalPeriodEnd(LocalDateTime rentalPeriodEnd) {
		this.rentalPeriodEnd = rentalPeriodEnd;
	}

	public List<Transaction> getTransactions() {
		return transactions;
	}

	public void setTransactions(List<Transaction> transactions) {
		this.transactions = transactions;
	}

	@Override
	public String toString() {
		return "Reservation [id=" + id + ", car=" + car + ", customer=" + customer + ", rentalPeriodStart="
				+ rentalPeriodStart + ", rentalPeriodEnd=" + rentalPeriodEnd + ", transactions=" + transactions + "]";
	}
      
}
