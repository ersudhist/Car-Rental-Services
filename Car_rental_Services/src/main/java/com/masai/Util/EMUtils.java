package com.masai.Util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class EMUtils {
	static EntityManagerFactory emf;
	
	static {
		emf = Persistence.createEntityManagerFactory("Car_rental_services");
	}

	public static EntityManager getManger() {
		return emf.createEntityManager();
	}
	
}
