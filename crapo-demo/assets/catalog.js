(function () {
  "use strict";

  const cities = [
    { name: "Chennai", slug: "chennai" },
    { name: "Coimbatore", slug: "coimbatore" },
    { name: "Madurai", slug: "madurai" },
    { name: "Tiruchirappalli", slug: "tiruchirappalli" },
    { name: "Salem", slug: "salem" },
    { name: "Tirunelveli", slug: "tirunelveli" },
    { name: "Erode", slug: "erode" },
    { name: "Vellore", slug: "vellore" },
    { name: "Thanjavur", slug: "thanjavur" },
    { name: "Thoothukudi / Tuticorin", slug: "thoothukudi" }
  ];

  const models = [
    { brand: "Hyundai", model: "i20", type: "Hatchback", fuel: "Petrol", transmission: "Automatic", seats: 5, rate: 2399, image: "photo-1492144534655-ae79c964c9d7", mileage: "20 km/l", deposit: 5000 },
    { brand: "Maruti Suzuki", model: "Baleno", type: "Hatchback", fuel: "Petrol", transmission: "Manual", seats: 5, rate: 2199, image: "photo-1502877338535-766e1452684a", mileage: "22 km/l", deposit: 4000 },
    { brand: "Tata", model: "Nexon", type: "SUV", fuel: "Petrol", transmission: "Automatic", seats: 5, rate: 3299, image: "photo-1552519507-da3b142c6e3d", mileage: "17 km/l", deposit: 7000 },
    { brand: "Hyundai", model: "Creta", type: "SUV", fuel: "Diesel", transmission: "Automatic", seats: 5, rate: 4299, image: "photo-1549317661-bd32c8ce0db2", mileage: "19 km/l", deposit: 9000 },
    { brand: "Kia", model: "Seltos", type: "SUV", fuel: "Petrol", transmission: "Automatic", seats: 5, rate: 4499, image: "photo-1533473359331-0135ef1b58bf", mileage: "17 km/l", deposit: 10000 },
    { brand: "Toyota", model: "Innova Crysta", type: "SUV", fuel: "Diesel", transmission: "Manual", seats: 7, rate: 5499, image: "photo-1542362567-b07e54358753", mileage: "15 km/l", deposit: 12000 },
    { brand: "Mahindra", model: "XUV700", type: "SUV", fuel: "Diesel", transmission: "Automatic", seats: 7, rate: 5899, image: "photo-1507136566006-cfc505b114fc", mileage: "16 km/l", deposit: 12000 },
    { brand: "Honda", model: "City", type: "Sedan", fuel: "Petrol", transmission: "Automatic", seats: 5, rate: 3799, image: "photo-1549924231-f129b911e442", mileage: "18 km/l", deposit: 8000 },
    { brand: "BMW", model: "3 Series", type: "Luxury", fuel: "Petrol", transmission: "Automatic", seats: 5, rate: 10999, image: "photo-1503376780353-7e6692767b70", mileage: "14 km/l", deposit: 25000 },
    { brand: "Tata", model: "Tiago EV", type: "Electric", fuel: "Electric", transmission: "Automatic", seats: 5, rate: 2899, image: "photo-1493238792000-8113da705763", mileage: "315 km / charge", deposit: 6000 }
  ];

  const cars = cities.flatMap(function (city, cityIndex) {
    return models.map(function (car, modelIndex) {
      const number = cityIndex * models.length + modelIndex + 1;
      return {
        id: "CR-" + String(number).padStart(3, "0"),
        brand: car.brand,
        model: car.model,
        year: 2025,
        type: car.type,
        fuel: car.fuel,
        transmission: car.transmission,
        seats: car.seats,
        city: city.name,
        citySlug: city.slug,
        pricePerDay: car.rate + cityIndex * 100,
        deposit: car.deposit,
        mileage: car.mileage,
        rating: (4.5 + ((cityIndex + modelIndex) % 5) / 10).toFixed(1),
        available: (cityIndex + modelIndex) % 7 !== 0,
        image: "https://images.unsplash.com/" + car.image + "?auto=format&fit=crop&w=1200&q=82",
        imageAlt: "Sample 2025 demo photo for " + car.brand + " " + car.model + " listing in " + city.name
      };
    });
  });

  window.CRAPO_CITIES = cities;
  window.CRAPO_CARS = cars;
}());
