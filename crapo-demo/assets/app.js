(function () {
  "use strict";

  const app = document.getElementById("app");
  const modal = document.getElementById("modal-layer");
  const formatter = new Intl.NumberFormat("en-IN");
  const services = [
    { name: "General Service", icon: "bi-tools", description: "A complete health check, fluids, filters and a little peace of mind.", duration: "3–4 hours", price: 2499 },
    { name: "Oil Change", icon: "bi-droplet-half", description: "Fresh engine oil and filter replacement for a smoother drive.", duration: "45 minutes", price: 1199 },
    { name: "Brake Service", icon: "bi-disc", description: "Brake inspection and care for confident stopping power.", duration: "2 hours", price: 1899 },
    { name: "AC Service", icon: "bi-snow2", description: "Keep the cabin cool with AC diagnostics and a system refresh.", duration: "90 minutes", price: 1499 },
    { name: "Battery Service", icon: "bi-lightning-charge", description: "Battery health check, testing and replacement guidance.", duration: "45 minutes", price: 799 },
    { name: "Tyre Service", icon: "bi-record-circle", description: "Rotation, pressure check and wheel alignment inspection.", duration: "1 hour", price: 999 },
    { name: "Engine Diagnostics", icon: "bi-cpu", description: "A detailed scan to help identify what your dashboard is telling you.", duration: "1 hour", price: 1299 },
    { name: "Car Wash", icon: "bi-stars", description: "A careful exterior wash and a fresh, tidy cabin.", duration: "60 minutes", price: 599 },
    { name: "Full Inspection", icon: "bi-clipboard2-check", description: "A 30-point inspection covering the essentials before a big trip.", duration: "2 hours", price: 1699 }
  ];

  let cars = window.CRAPO_CARS.slice();
  let currentUser = readStorage("crapo-user");
  let lastBooking = readStorage("crapo-last-booking");
  let lastService = readStorage("crapo-last-service");

  function readStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch (error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function money(value) {
    return "₹" + formatter.format(Math.round(value));
  }

  function title(car) {
    return car.brand + " " + car.model;
  }

  function todayString(offset) {
    const date = new Date();
    date.setDate(date.getDate() + (offset || 0));
    return date.toISOString().slice(0, 10);
  }

  function dayCount(start, end) {
    const first = new Date(start + "T00:00:00");
    const last = new Date(end + "T00:00:00");
    return Math.max(1, Math.ceil((last - first) / 86400000));
  }

  function routeInfo() {
    const [path, query = ""] = window.location.hash.slice(1).split("?");
    const [page = "home", id] = path.split("/");
    return { page, id, query: new URLSearchParams(query) };
  }

  function route(page) {
    window.location.hash = page;
  }

  function headerState() {
    const login = document.querySelector(".header-login");
    const register = document.querySelector('[data-open-auth="register"]');
    const profile = document.querySelector(".profile-button");
    if (currentUser) {
      login.hidden = true;
      register.hidden = true;
      profile.hidden = false;
      document.getElementById("profile-name").textContent = currentUser.name.split(" ")[0];
    } else {
      login.hidden = false;
      register.hidden = false;
      profile.hidden = true;
    }
  }

  function heroSearch() {
    return '<form class="booking-search" id="home-search">' +
      '<label><span>Pickup location</span><select id="home-city" required><option value="">Choose a city</option>' + window.CRAPO_CITIES.map(function (city) { return '<option value="' + city.slug + '">' + escapeHtml(city.name) + '</option>'; }).join("") + '</select></label>' +
      '<label><span>Drop-off location</span><select id="home-drop"><option value="">Same as pickup</option>' + window.CRAPO_CITIES.map(function (city) { return '<option value="' + city.slug + '">' + escapeHtml(city.name) + '</option>'; }).join("") + '</select></label>' +
      '<label><span>Pickup date</span><input id="home-pickup" type="date" value="' + todayString(1) + '" min="' + todayString(0) + '" required></label>' +
      '<label><span>Pickup time</span><input id="home-pickup-time" type="time" value="10:00" required></label>' +
      '<label><span>Return date</span><input id="home-return" type="date" value="' + todayString(2) + '" min="' + todayString(1) + '" required></label>' +
      '<label><span>Return time</span><input id="home-return-time" type="time" value="10:00" required></label>' +
      '<button class="button button-plum" type="submit">Search cars <i class="bi bi-arrow-up-right"></i></button></form>';
  }

  function homePage() {
    return '<section class="hero-shell"><div class="hero-copy"><p class="eyebrow"><span></span> CRAPO CAR RENTAL &amp; SERVICE</p><h1>Your Journey,<br><em>Your Choice.</em></h1><p class="hero-tagline">Drive Your Way. Care Your Car.</p><p class="hero-description">Premium cars for every journey, with reliable service when your car needs care.</p><div class="hero-buttons"><a class="button button-plum" href="#cars">Explore cars <i class="bi bi-arrow-up-right"></i></a><a class="button button-ghost" href="#services">Book a service <i class="bi bi-arrow-up-right"></i></a></div><div class="hero-proof"><span><i class="bi bi-patch-check"></i> Thoughtfully selected</span><span><i class="bi bi-geo-alt"></i> Across Tamil Nadu</span></div></div><div class="hero-photo"><img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=88" alt="Premium sports car on a scenic road"><div class="photo-wash"></div><div class="hero-photo-note"><span>THE OPEN-ROAD EDITION</span><strong>Find a little<br>room to roam.</strong></div><span class="hero-photo-index">01 <i>/</i> 10</span></div></section>' +
      '<section class="booking-search-wrap"><div class="search-intro"><span class="icon-disc"><i class="bi bi-calendar2-week"></i></span><div><h2>Let’s get you moving.</h2><p>Plan the little details. We’ll find your ride.</p></div></div>' + heroSearch() + '</section>' +
      '<section class="trust-row"><div><i class="bi bi-patch-check"></i><span><strong>Verified cars</strong><small>Every ride, thoughtfully checked</small></span></div><div><i class="bi bi-arrow-left-right"></i><span><strong>Flexible booking</strong><small>Plans change. We understand.</small></span></div><div><i class="bi bi-receipt"></i><span><strong>Transparent pricing</strong><small>No surprises at checkout</small></span></div><div><i class="bi bi-wrench-adjustable-circle"></i><span><strong>Professional service</strong><small>Care from people who care</small></span></div></section>' +
      '<section class="home-feature-section"><div class="section-title"><div><p class="eyebrow"><span></span> THE 2025 COLLECTION</p><h2>A good day to <em>go places.</em></h2></div><a class="arrow-link" href="#cars">Explore all 100 cars <i class="bi bi-arrow-up-right"></i></a></div><div class="car-grid featured-grid">' + cars.slice(0, 3).map(carCard).join("") + '</div></section>' +
      '<section class="home-service-band"><div class="service-band-art"><img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=82" alt="Mechanic inspecting a car in a service center"></div><div class="service-band-copy"><p class="eyebrow"><span></span> CAR CARE, MADE EASY</p><h2>Keep your car<br><em>at its best.</em></h2><p>From an oil change to a full inspection, good care makes every drive better.</p><a class="button button-plum" href="#services">Explore car services <i class="bi bi-arrow-up-right"></i></a></div></section>' +
      '<section class="city-strip"><span>GOOD TO GO IN</span><strong>10 Tamil Nadu cities</strong><p>' + window.CRAPO_CITIES.map(function (city) { return escapeHtml(city.name.split(" / ")[0]); }).join(' <i>·</i> ') + '</p></section>';
  }

  function carCard(car) {
    return '<article class="car-card"><div class="car-card-image"><img src="' + escapeHtml(car.image) + '" alt="' + escapeHtml(car.imageAlt) + '" loading="lazy"><span class="car-category">' + escapeHtml(car.type) + '</span><span class="car-year">2025 DEMO</span></div><div class="car-card-body"><div class="car-card-top"><div><p class="car-city"><i class="bi bi-geo-alt"></i> ' + escapeHtml(car.city) + '</p><h3>' + escapeHtml(title(car)) + '</h3></div><span class="rating"><i class="bi bi-star-fill"></i> ' + escapeHtml(car.rating) + '</span></div><div class="car-card-specs"><span><i class="bi bi-gear"></i> ' + escapeHtml(car.transmission) + '</span><span><i class="bi bi-fuel-pump"></i> ' + escapeHtml(car.fuel) + '</span><span><i class="bi bi-people"></i> ' + car.seats + ' seats</span></div><div class="car-card-foot"><p><strong>' + money(car.pricePerDay) + '</strong><small> / day</small></p><div class="car-card-actions"><button class="button button-outline button-mini" type="button" data-car-details="' + escapeHtml(car.id) + '">Details</button><button class="button button-plum button-mini" type="button" data-book-car="' + escapeHtml(car.id) + '">Book now</button></div></div></div></article>';
  }

  function cityOptions(selected) {
    return window.CRAPO_CITIES.map(function (city) {
      return '<option value="' + city.slug + '"' + (selected === city.slug ? " selected" : "") + '>' + escapeHtml(city.name) + '</option>';
    }).join("");
  }

  function carsPage(query) {
    const selectedCity = query.get("city") || "";
    return '<section class="page-hero compact-hero"><div><p class="eyebrow"><span></span> THE CRAPO FLEET</p><h1>Find the perfect car<br><em>for your journey.</em></h1><p>One hundred hand-picked 2025 demo cars, across ten Tamil Nadu cities.</p></div><div class="page-hero-mark"><i class="bi bi-steering-wheel"></i><span>YOUR WAY,<br>YOUR WHEELS.</span></div></section>' +
      '<section class="catalog-section"><div class="filter-panel"><div class="filter-title"><span><i class="bi bi-sliders2"></i> Refine your search</span><button type="button" id="clear-filters">Clear all</button></div><div class="filter-grid"><label class="filter-field"><span>Location</span><select id="filter-city"><option value="">All Tamil Nadu</option>' + cityOptions(selectedCity) + '</select></label><label class="filter-field"><span>Search</span><input id="filter-search" type="search" placeholder="Make, model or city"></label><label class="filter-field"><span>Car type</span><select id="filter-type"><option value="">All types</option><option>Hatchback</option><option>Sedan</option><option>SUV</option><option>Luxury</option><option>Electric</option></select></label><label class="filter-field"><span>Fuel</span><select id="filter-fuel"><option value="">All fuels</option><option>Petrol</option><option>Diesel</option><option>Electric</option></select></label><label class="filter-field"><span>Transmission</span><select id="filter-transmission"><option value="">Any</option><option>Automatic</option><option>Manual</option></select></label><label class="filter-field"><span>Seats</span><select id="filter-seats"><option value="">Any capacity</option><option value="5">5 seats</option><option value="7">7 seats</option></select></label><label class="filter-field"><span>Max per day</span><select id="filter-price"><option value="">Any price</option><option value="3000">Up to ₹3,000</option><option value="5000">Up to ₹5,000</option><option value="8000">Up to ₹8,000</option></select></label><label class="filter-field"><span>Sort by</span><select id="filter-sort"><option value="recommended">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select></label></div><div class="category-chips" id="category-chips"><button class="category-chip active" data-category="" type="button">All cars <span>100</span></button><button class="category-chip" data-category="Hatchback" type="button">Hatchback</button><button class="category-chip" data-category="Sedan" type="button">Sedan</button><button class="category-chip" data-category="SUV" type="button">SUV</button><button class="category-chip" data-category="Luxury" type="button">Luxury</button><button class="category-chip" data-category="Electric" type="button">Electric</button></div></div><div class="catalog-heading"><p id="catalog-count" aria-live="polite"></p><span>All vehicles shown are 2025 demo listings</span></div><div class="car-grid catalog-grid" id="catalog-grid"></div><p class="empty-state" id="catalog-empty" hidden>No cars match these filters. Try another city or category.</p></section>';
  }

  function detailsPage(car) {
    if (!car) return '<section class="not-found"><i class="bi bi-car-front"></i><h1>Car not found</h1><a class="button button-plum" href="#cars">Back to cars</a></section>';
    return '<section class="details-page"><a href="#cars" class="back-link"><i class="bi bi-arrow-left"></i> Back to all cars</a><div class="details-layout"><div class="details-image"><img src="' + escapeHtml(car.image) + '" alt="' + escapeHtml(car.imageAlt) + '"><span class="car-year">2025 DEMO PHOTO</span></div><div class="details-copy"><p class="eyebrow"><span></span> ' + escapeHtml(car.type.toUpperCase()) + ' · ' + car.year + '</p><p class="car-city"><i class="bi bi-geo-alt"></i> ' + escapeHtml(car.city) + '</p><h1>' + escapeHtml(title(car)) + '</h1><div class="detail-rating"><span class="rating"><i class="bi bi-star-fill"></i> ' + escapeHtml(car.rating) + '</span><span>Guest favourite · ' + escapeHtml(car.city) + '</span></div><p class="details-intro">A lovely companion for the scenic route, a family weekend, or wherever your next good story starts.</p><div class="spec-grid"><div><i class="bi bi-calendar3"></i><span>MODEL YEAR</span><strong>' + car.year + '</strong></div><div><i class="bi bi-gear"></i><span>TRANSMISSION</span><strong>' + escapeHtml(car.transmission) + '</strong></div><div><i class="bi bi-fuel-pump"></i><span>FUEL</span><strong>' + escapeHtml(car.fuel) + '</strong></div><div><i class="bi bi-people"></i><span>SEATING</span><strong>' + car.seats + ' people</strong></div><div><i class="bi bi-speedometer2"></i><span>MILEAGE</span><strong>' + escapeHtml(car.mileage) + '</strong></div><div><i class="bi bi-shield-check"></i><span>DEPOSIT</span><strong>' + money(car.deposit) + '</strong></div></div><div class="detail-price"><div><strong>' + money(car.pricePerDay) + '</strong><span> / day</span></div><button class="button button-plum" type="button" data-book-car="' + escapeHtml(car.id) + '">Book this car <i class="bi bi-arrow-up-right"></i></button></div><p class="demo-note"><i class="bi bi-info-circle"></i> Demo listing. No real vehicle or payment is involved.</p></div></div></section>';
  }

  function serviceCard(service) {
    return '<article class="service-card"><span class="service-icon"><i class="bi ' + service.icon + '"></i></span><span class="service-duration"><i class="bi bi-clock"></i> ' + service.duration + '</span><h3>' + escapeHtml(service.name) + '</h3><p>' + escapeHtml(service.description) + '</p><div class="service-card-foot"><strong>From ' + money(service.price) + '</strong><button class="text-button" data-service="' + escapeHtml(service.name) + '" type="button">Book service <i class="bi bi-arrow-up-right"></i></button></div></article>';
  }

  function servicesPage() {
    return '<section class="page-hero service-hero"><div><p class="eyebrow"><span></span> THE CRAPO SERVICE STUDIO</p><h1>Keep your car<br><em>at its best.</em></h1><p>Good car care should feel easy. Find a trusted service, pick a time, and we’ll take it from there.</p><a class="button button-plum" href="#service-booking">Schedule a service <i class="bi bi-arrow-up-right"></i></a></div><div class="service-hero-photo"><img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=82" alt="Professional car maintenance"></div></section><section class="services-section" id="service-booking"><div class="section-title"><div><p class="eyebrow"><span></span> A LITTLE CARE GOES A LONG WAY</p><h2>Pick what your car <em>needs.</em></h2></div><p>Clear starting prices. Experienced hands.<br>Service centers across Tamil Nadu.</p></div><div class="services-grid">' + services.map(serviceCard).join("") + '</div></section><section class="service-promise"><i class="bi bi-heart"></i><div><strong>Here for the whole journey.</strong><span>Book a service today, and keep the good drives coming tomorrow.</span></div><a href="#contact">Talk to our team <i class="bi bi-arrow-up-right"></i></a></section>';
  }

  function aboutPage() {
    return '<section class="page-hero about-hero"><div><p class="eyebrow"><span></span> A LITTLE ABOUT US</p><h1>Better drives.<br><em>Better days.</em></h1><p>CRAPO is a conceptual car rental and vehicle service management platform developed as an MCA academic project.</p></div><div class="about-image"><img src="https://images.unsplash.com/photo-1441148345475-03a2e82f9719?auto=format&fit=crop&w=1200&q=85" alt="A car travelling a winding road"></div></section><section class="mission-card"><span class="icon-disc"><i class="bi bi-compass"></i></span><p class="eyebrow"><span></span> OUR MISSION</p><h2>“To make car rental and vehicle maintenance simple, transparent and convenient.”</h2><p>Designed around people and the roads they love, CRAPO brings car discovery, straightforward booking, and dependable care together in one thoughtful demo.</p></section><section class="trust-row about-values"><div><i class="bi bi-heart"></i><span><strong>Human by design</strong><small>Clear choices and considerate details</small></span></div><div><i class="bi bi-shield-check"></i><span><strong>Trust at every turn</strong><small>Transparent prices, always</small></span></div><div><i class="bi bi-signpost-split"></i><span><strong>Rooted in Tamil Nadu</strong><small>Made for cities across the state</small></span></div></section>';
  }

  function contactPage() {
    return '<section class="page-hero compact-hero"><div><p class="eyebrow"><span></span> WE’RE HERE TO HELP</p><h1>Let’s have a<br><em>good conversation.</em></h1><p>Questions about a booking, service, or the demo? Send us a note.</p></div></section><section class="contact-layout"><form class="contact-form panel" id="contact-form"><h2>Send us a message</h2><label>Your name<input name="name" required maxlength="80" placeholder="How should we address you?"></label><label>Email address<input name="email" type="email" required placeholder="you@example.com"></label><label>What can we help with?<select name="topic"><option>Rental enquiry</option><option>Car service</option><option>Demo project</option><option>Something else</option></select></label><label>Your message<textarea name="message" required rows="4" placeholder="Tell us a little more…"></textarea></label><button class="button button-plum" type="submit">Send message <i class="bi bi-arrow-up-right"></i></button><p class="demo-note">Demo form only. Please don’t submit personal or sensitive details.</p></form><aside class="contact-info"><div class="contact-card"><i class="bi bi-telephone"></i><span>GIVE US A CALL</span><strong>+91 44 4000 2025</strong><small>Monday–Saturday, 9am–6pm</small></div><div class="contact-card"><i class="bi bi-envelope"></i><span>DROP US A LINE</span><strong>hello@crapo.demo</strong><small>We’ll get back to you soon</small></div><div class="contact-card"><i class="bi bi-geo-alt"></i><span>FIND OUR STUDIO</span><strong>Chennai, Tamil Nadu</strong><small>Demo service center · Tamil Nadu</small></div><div class="faq-card"><h3>A few quick answers</h3><details><summary>Is this a real booking service?</summary><p>No. CRAPO is an academic demo; bookings and payments are simulated locally.</p></details><details><summary>Where are cars available?</summary><p>Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Tirunelveli, Erode, Vellore, Thanjavur and Thoothukudi.</p></details></div></aside></section>';
  }

  function dashboardPage() {
    const bookings = readStorage("crapo-bookings") || [];
    const serviceBookings = readStorage("crapo-services") || [];
    const active = bookings.filter(function (booking) { return booking.status !== "Completed"; });
    return '<section class="dashboard-layout"><aside class="dashboard-sidebar"><p class="eyebrow"><span></span> YOUR CRAPO</p><div class="dashboard-user"><span class="avatar">' + escapeHtml(currentUser ? currentUser.name.slice(0, 1).toUpperCase() : "G") + '</span><div><strong>' + escapeHtml(currentUser ? currentUser.name : "Guest") + '</strong><small>' + escapeHtml(currentUser ? currentUser.email : "Demo account") + '</small></div></div><nav aria-label="Dashboard"><a class="active" href="#dashboard"><i class="bi bi-grid"></i> Dashboard</a><a href="#dashboard/rentals"><i class="bi bi-car-front"></i> My rentals</a><a href="#dashboard/services"><i class="bi bi-wrench-adjustable"></i> Service bookings</a><a href="#invoice"><i class="bi bi-receipt"></i> Invoices</a><a href="#contact"><i class="bi bi-person"></i> Profile &amp; help</a><button type="button" id="logout-button"><i class="bi bi-box-arrow-left"></i> Log out</button></nav></aside><div class="dashboard-content"><div class="dashboard-title"><div><p class="eyebrow"><span></span> YOUR DRIVE, YOUR WAY</p><h1>Welcome back, <em>' + escapeHtml((currentUser ? currentUser.name : "friend").split(" ")[0]) + '.</em></h1><p>A little snapshot of your CRAPO activity.</p></div><a class="button button-plum" href="#cars">Find a car <i class="bi bi-arrow-up-right"></i></a></div><div class="stats-grid"><article class="stat-card"><span>ACTIVE RENTAL</span><strong>' + active.length + '</strong><i class="bi bi-car-front"></i></article><article class="stat-card"><span>UPCOMING BOOKINGS</span><strong>' + bookings.length + '</strong><i class="bi bi-calendar2-check"></i></article><article class="stat-card"><span>SERVICE VISITS</span><strong>' + serviceBookings.length + '</strong><i class="bi bi-wrench-adjustable"></i></article><article class="stat-card"><span>TOTAL JOURNEYS</span><strong>' + bookings.length + '</strong><i class="bi bi-signpost-split"></i></article></div><section class="dashboard-panel" id="my-rentals"><div class="panel-heading"><div><h2>Recent bookings</h2><p>Your demo rentals and service visits.</p></div><a href="#cars">Book a car <i class="bi bi-arrow-up-right"></i></a></div>' + bookingRows(bookings, serviceBookings) + '</section><section class="dashboard-panel" id="my-services"><div class="panel-heading"><div><h2>Your service timeline</h2><p>From appointment to ready-to-go.</p></div></div><div class="timeline">' + ["Appointment", "Inspection", "Service in progress", "Quality check", "Ready", "Completed"].map(function (item, index) { return '<div class="' + (index === 0 && serviceBookings.length ? "done" : "") + '"><span>' + (index + 1) + '</span><small>' + item + '</small></div>'; }).join("") + '</div></section></div></section>';
  }

  function bookingRows(bookings, serviceBookings) {
    const items = bookings.map(function (booking) {
      return '<div class="booking-row-item"><span class="table-icon"><i class="bi bi-car-front"></i></span><div><strong>' + escapeHtml(booking.car) + '</strong><small>Rental · ' + escapeHtml(booking.pickup) + ' · ' + escapeHtml(booking.start) + '</small></div><span class="status-pill">' + escapeHtml(booking.status) + '</span><strong>' + money(booking.total) + '</strong></div>';
    }).concat(serviceBookings.map(function (booking) {
      return '<div class="booking-row-item"><span class="table-icon service-table-icon"><i class="bi bi-wrench-adjustable"></i></span><div><strong>' + escapeHtml(booking.service) + '</strong><small>Service · ' + escapeHtml(booking.center) + ' · ' + escapeHtml(booking.date) + '</small></div><span class="status-pill">Appointment</span><strong>' + money(booking.price) + '</strong></div>';
    }));
    return items.length ? '<div class="booking-list">' + items.slice(0, 5).join("") + '</div>' : '<div class="dashboard-empty"><i class="bi bi-calendar2-heart"></i><p>No bookings yet. Your next great drive is out there.</p><a class="button button-outline" href="#cars">Browse the fleet</a></div>';
  }

  function adminPage() {
    const available = cars.filter(function (car) { return car.available; }).length;
    const rentals = (readStorage("crapo-bookings") || []).length;
    const pendingServices = (readStorage("crapo-services") || []).length;
    return '<section class="admin-page"><div class="admin-title"><div><p class="eyebrow"><span></span> CRAPO CONTROL ROOM</p><h1>Good morning, <em>admin.</em></h1><p>Your demo operation, at a glance.</p></div><span class="admin-badge"><i class="bi bi-shield-lock"></i> ADMIN DEMO</span></div><div class="stats-grid admin-stats"><article class="stat-card"><span>TOTAL CARS</span><strong>' + cars.length + '</strong><i class="bi bi-car-front"></i></article><article class="stat-card"><span>AVAILABLE CARS</span><strong>' + available + '</strong><i class="bi bi-check-circle"></i></article><article class="stat-card"><span>RENTAL BOOKINGS</span><strong>' + rentals + '</strong><i class="bi bi-calendar2-check"></i></article><article class="stat-card"><span>SERVICE APPOINTMENTS</span><strong>' + pendingServices + '</strong><i class="bi bi-wrench-adjustable"></i></article><article class="stat-card"><span>COMPLETED SERVICES</span><strong>24</strong><i class="bi bi-clipboard2-check"></i></article><article class="stat-card"><span>DEMO REVENUE</span><strong>' + money((readStorage("crapo-bookings") || []).reduce(function (sum, item) { return sum + item.total; }, 0)) + '</strong><i class="bi bi-currency-rupee"></i></article></div><div class="admin-panels"><section class="dashboard-panel revenue-panel"><div class="panel-heading"><div><h2>Monthly activity</h2><p>Illustrative demo figures · 2025</p></div><select aria-label="Chart period"><option>2025</option></select></div><div class="bar-chart">' + [["Jan", 40], ["Feb", 55], ["Mar", 47], ["Apr", 68], ["May", 58], ["Jun", 78], ["Jul", 62], ["Aug", 86], ["Sep", 74], ["Oct", 95], ["Nov", 69], ["Dec", 83]].map(function (item) { return '<div><span style="height:' + item[1] + '%"></span><small>' + item[0] + '</small></div>'; }).join("") + '</div><div class="chart-legend"><span><i></i> Rental revenue</span><span><i></i> Service visits</span></div></section><section class="dashboard-panel"><div class="panel-heading"><div><h2>Service workflow</h2><p>Today’s demo appointments</p></div></div><div class="admin-workflow">' + ["Appointment", "Inspection", "Service in progress", "Quality check", "Ready", "Completed"].map(function (step, i) { return '<div><span>' + (i + 1) + '</span>' + step + '</div>'; }).join("") + '</div></section></div><section class="dashboard-panel inventory-panel"><div class="panel-heading"><div><h2>Car management</h2><p>Manage your 2025 sample fleet · ' + cars.length + ' listings</p></div><button class="button button-plum button-small" type="button" data-add-car><i class="bi bi-plus-lg"></i> Add a car</button></div><div class="inventory-table"><div class="inventory-head"><span>CAR</span><span>CITY</span><span>PRICE / DAY</span><span>STATUS</span><span>ACTIONS</span></div>' + cars.slice(0, 12).map(inventoryRow).join("") + '<p class="inventory-note">Showing 12 sample listings. Use the fleet page to browse all 100 cars.</p></div></section></section>';
  }

  function adminGate() {
    return '<section class="not-found"><i class="bi bi-shield-lock"></i><p class="eyebrow"><span></span> ADMIN DEMO</p><h1>Admin access only</h1><p>Log in with the sample admin account to open the CRAPO control room.</p><button class="button button-plum" type="button" data-open-auth="login">Log in as admin <i class="bi bi-arrow-up-right"></i></button></section>';
  }

  function inventoryRow(car) {
    return '<div class="inventory-row"><span class="inventory-car"><img src="' + escapeHtml(car.image) + '" alt="" loading="lazy"><strong>' + escapeHtml(title(car)) + '<small>2025 · ' + escapeHtml(car.type) + '</small></strong></span><span>' + escapeHtml(car.city) + '</span><span>' + money(car.pricePerDay) + '</span><span class="inventory-status ' + (car.available ? "available" : "booked") + '">' + (car.available ? "Available" : "Booked") + '</span><span class="inventory-actions"><button type="button" aria-label="Edit ' + escapeHtml(title(car)) + '" data-edit-car="' + escapeHtml(car.id) + '"><i class="bi bi-pencil"></i></button><button type="button" aria-label="Toggle availability for ' + escapeHtml(title(car)) + '" data-toggle-car="' + escapeHtml(car.id) + '"><i class="bi bi-arrow-repeat"></i></button><button type="button" aria-label="Delete ' + escapeHtml(title(car)) + '" data-delete-car="' + escapeHtml(car.id) + '"><i class="bi bi-trash"></i></button></span></div>';
  }

  function confirmationPage(kind) {
    const booking = kind === "service-confirmation" ? lastService : lastBooking;
    if (!booking) return '<section class="not-found"><i class="bi bi-clipboard-check"></i><h1>Nothing to confirm just yet.</h1><a class="button button-plum" href="#cars">Explore the fleet</a></section>';
    const isService = kind === "service-confirmation";
    return '<section class="confirmation-page"><span class="confirmation-icon"><i class="bi bi-check2"></i></span><p class="eyebrow"><span></span> ' + (isService ? "SERVICE REQUEST RECEIVED" : "YOUR DEMO BOOKING IS READY") + '</p><h1>' + (isService ? 'A little car care,<br><em>coming right up.</em>' : 'Booking<br><em>confirmed!</em>') + '</h1><p class="confirmation-intro">' + (isService ? "Your service appointment is on our demo schedule." : "That next journey is looking good. Here are your demo booking details.") + '</p><div class="confirmation-card"><div><span>' + (isService ? "SERVICE ID" : "BOOKING ID") + '</span><strong>' + escapeHtml(booking.id) + '</strong></div><div><span>' + (isService ? "SERVICE" : "CAR") + '</span><strong>' + escapeHtml(isService ? booking.service : booking.car) + '</strong></div><div><span>' + (isService ? "SERVICE CENTER" : "PICK-UP") + '</span><strong>' + escapeHtml(isService ? booking.center : booking.pickup) + '</strong></div><div><span>' + (isService ? "APPOINTMENT" : "RETURN") + '</span><strong>' + escapeHtml(isService ? booking.date : booking.end) + '</strong></div><div><span>AMOUNT</span><strong>' + money(isService ? booking.price : booking.total) + '</strong></div><div><span>STATUS</span><strong><span class="status-pill">' + (isService ? "Scheduled · Demo" : "Confirmed · Demo") + '</span></strong></div></div><p class="demo-note"><i class="bi bi-info-circle"></i> This is a simulated academic demo. No real booking or payment was made.</p><div class="hero-buttons"><a class="button button-plum" href="#dashboard">View dashboard <i class="bi bi-arrow-up-right"></i></a><a class="button button-ghost" href="#home">Back to home</a></div></section>';
  }

  function invoicePage() {
    const booking = lastService || lastBooking;
    if (!booking) return '<section class="not-found"><i class="bi bi-receipt"></i><h1>Your demo invoice will appear here.</h1><a class="button button-plum" href="#cars">Browse cars</a></section>';
    const isService = Boolean(booking.service);
    return '<section class="invoice-page"><div class="invoice-toolbar"><a href="#dashboard" class="back-link"><i class="bi bi-arrow-left"></i> Dashboard</a><button class="button button-outline" type="button" onclick="window.print()"><i class="bi bi-download"></i> Download invoice</button></div><article class="invoice-sheet"><div class="invoice-header"><div><a class="brand" href="#home"><span class="brand-mark">C</span><span class="brand-name">CRAPO<small>CAR RENTAL &amp; SERVICE</small></span></a><p>Drive Your Way. Care Your Car.</p></div><div class="invoice-label"><span>DEMO INVOICE</span><strong>' + escapeHtml(booking.id) + '</strong><small>Issued ' + todayString(0) + '</small></div></div><hr><div class="invoice-bill"><div><span>BILLED TO</span><strong>' + escapeHtml(currentUser ? currentUser.name : "CRAPO Demo Guest") + '</strong><small>' + escapeHtml(currentUser ? currentUser.email : "demo@crapo.com") + '</small></div><div><span>' + (isService ? "VEHICLE SERVICE" : "RENTAL VEHICLE") + '</span><strong>' + escapeHtml(isService ? booking.vehicle : booking.car) + '</strong><small>' + escapeHtml(isService ? booking.center : booking.pickup) + '</small></div></div><div class="invoice-lines"><div class="invoice-line invoice-line-heading"><span>DESCRIPTION</span><span>AMOUNT</span></div>' + (isService ? '<div class="invoice-line"><span>' + escapeHtml(booking.service) + ' · labour</span><strong>' + money(booking.price * .8) + '</strong></div><div class="invoice-line"><span>Service tax</span><strong>' + money(booking.price * .2) + '</strong></div>' : '<div class="invoice-line"><span>Rental · ' + booking.days + ' day(s)</span><strong>' + money(booking.base) + '</strong></div><div class="invoice-line"><span>Taxes</span><strong>' + money(booking.tax) + '</strong></div><div class="invoice-line"><span>Security deposit (refundable)</span><strong>' + money(booking.deposit) + '</strong></div>') + '</div><div class="invoice-total"><span>DEMO TOTAL</span><strong>' + money(isService ? booking.price : booking.total) + '</strong></div><div class="invoice-foot"><span>Payment status</span><strong>Not charged · Demo only</strong></div><p class="demo-note">This document is a sample generated for an academic website demonstration and is not a tax invoice.</p></article></section>';
  }

  function renderPage() {
    headerState();
    const info = routeInfo();
    if (info.page === "cars") app.innerHTML = carsPage(info.query);
    else if (info.page === "car") app.innerHTML = detailsPage(cars.find(function (car) { return car.id === info.id; }));
    else if (info.page === "services") app.innerHTML = servicesPage();
    else if (info.page === "about") app.innerHTML = aboutPage();
    else if (info.page === "contact") app.innerHTML = contactPage();
    else if (info.page === "dashboard") app.innerHTML = dashboardPage();
    else if (info.page === "admin") app.innerHTML = currentUser && currentUser.role === "admin" ? adminPage() : adminGate();
    else if (info.page === "confirmation" || info.page === "service-confirmation") app.innerHTML = confirmationPage(info.page);
    else if (info.page === "invoice") app.innerHTML = invoicePage();
    else app.innerHTML = homePage();

    document.querySelectorAll(".main-nav a").forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + info.page || (info.page === "car" && link.getAttribute("href") === "#cars"));
    });
    window.scrollTo(0, 0);
    initRouteControls(info);
  }

  function initRouteControls(info) {
    if (info.page === "cars") initCarFilters(info.query);
    if (info.page === "contact") {
      document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault();
        showToast("Thanks for reaching out. This demo form is ready to connect to a service later.", "success");
        event.currentTarget.reset();
      });
    }
    if (info.page === "dashboard") {
      const logout = document.getElementById("logout-button");
      logout.addEventListener("click", function () {
        localStorage.removeItem("crapo-user");
        currentUser = null;
        route("home");
        showToast("You’ve been logged out of the demo.", "success");
      });
      if (info.id === "rentals") document.getElementById("my-rentals").scrollIntoView({ behavior: "smooth" });
      if (info.id === "services") document.getElementById("my-services").scrollIntoView({ behavior: "smooth" });
    }
  }

  function initCarFilters(query) {
    const filters = ["filter-city", "filter-search", "filter-type", "filter-fuel", "filter-transmission", "filter-seats", "filter-price", "filter-sort"];
    const grid = document.getElementById("catalog-grid");
    const count = document.getElementById("catalog-count");
    const empty = document.getElementById("catalog-empty");
    const initialCity = query.get("city");
    if (initialCity) document.getElementById("filter-city").value = initialCity;

    function render() {
      const values = Object.fromEntries(filters.map(function (id) {
        const key = id.replace("filter-", "");
        return [key, document.getElementById(id).value];
      }));
      let matches = cars.filter(function (car) {
        const text = [car.brand, car.model, car.city, car.type, car.fuel].join(" ").toLocaleLowerCase();
        return (!values.city || car.citySlug === values.city) &&
          (!values.search || text.includes(values.search.trim().toLocaleLowerCase())) &&
          (!values.type || car.type === values.type) &&
          (!values.fuel || car.fuel === values.fuel) &&
          (!values.transmission || car.transmission === values.transmission) &&
          (!values.seats || car.seats >= Number(values.seats)) &&
          (!values.price || car.pricePerDay <= Number(values.price));
      });
      if (values.sort === "price-low") matches.sort(function (a, b) { return a.pricePerDay - b.pricePerDay; });
      if (values.sort === "price-high") matches.sort(function (a, b) { return b.pricePerDay - a.pricePerDay; });
      if (values.sort === "rating") matches.sort(function (a, b) { return Number(b.rating) - Number(a.rating); });
      grid.innerHTML = matches.map(carCard).join("");
      count.textContent = "Showing " + matches.length + " of " + cars.length + " cars";
      empty.hidden = matches.length > 0;
      document.querySelectorAll(".category-chip").forEach(function (chip) {
        chip.classList.toggle("active", chip.dataset.category === values.type);
      });
    }

    filters.forEach(function (id) {
      document.getElementById(id).addEventListener(id === "filter-search" ? "input" : "change", render);
    });
    document.getElementById("clear-filters").addEventListener("click", function () {
      filters.forEach(function (id) { document.getElementById(id).value = ""; });
      document.getElementById("filter-sort").value = "recommended";
      render();
    });
    document.getElementById("category-chips").addEventListener("click", function (event) {
      const chip = event.target.closest("[data-category]");
      if (!chip) return;
      document.getElementById("filter-type").value = chip.dataset.category;
      render();
    });
    render();
  }

  function showModal(html, onReady) {
    modal.innerHTML = '<div class="modal-backdrop" data-close-modal><section class="dialog" role="dialog" aria-modal="true">' + html + '</section></div>';
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".dialog").addEventListener("click", function (event) { event.stopPropagation(); });
    modal.querySelector("[data-close-modal]").addEventListener("click", closeModal);
    modal.querySelectorAll("[data-dismiss-modal]").forEach(function (button) { button.addEventListener("click", closeModal); });
    if (onReady) onReady();
  }

  function closeModal() {
    modal.hidden = true;
    modal.innerHTML = "";
    document.body.classList.remove("modal-open");
  }

  function authModal(mode) {
    const register = mode === "register";
    showModal('<button class="dialog-close" type="button" data-dismiss-modal aria-label="Close"><i class="bi bi-x-lg"></i></button><div class="dialog-brand"><span class="brand-mark">C</span><span class="brand-name">CRAPO<small>YOUR JOURNEY STARTS HERE</small></span></div><p class="eyebrow"><span></span> ' + (register ? "NEW HERE? WELCOME." : "GOOD TO SEE YOU AGAIN.") + '</p><h2>' + (register ? "Create your account." : "Welcome back.") + '</h2><p class="dialog-subtitle">' + (register ? "Keep all your demo journeys in one place." : "Log in to your CRAPO demo account.") + '</p><form id="auth-form"><div class="auth-name-field" ' + (register ? "" : "hidden") + '><label>YOUR NAME<input name="name" maxlength="80" ' + (register ? "required" : "") + ' placeholder="Your name"></label></div><label>EMAIL ADDRESS<input name="email" type="email" required placeholder="you@example.com"></label><label>PASSWORD<input name="password" type="password" required minlength="6" placeholder="At least 6 characters"></label><button class="button button-plum button-wide" type="submit">' + (register ? "Create account" : "Log in") + ' <i class="bi bi-arrow-up-right"></i></button></form><p class="auth-switch">' + (register ? 'Already have an account? <button type="button" data-switch-auth="login">Log in</button>' : 'New to CRAPO? <button type="button" data-switch-auth="register">Create an account</button>') + '</p><details class="demo-credentials"><summary>Demo account details</summary><p>Customer: customer@crapo.com / customer123<br>Admin: admin@crapo.com / admin123</p></details>', function () {
      modal.querySelector("[data-switch-auth]").addEventListener("click", function () { authModal(this.dataset.switchAuth); });
      modal.querySelector("#auth-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = String(data.get("email")).trim().toLowerCase();
        const password = String(data.get("password"));
        const isAdmin = email === "admin@crapo.com" && password === "admin123";
        const isCustomer = email === "customer@crapo.com" && password === "customer123";
        if (!register && !isAdmin && !isCustomer) {
          showToast("Those demo credentials don’t match. Use the sample account details below.", "error");
          return;
        }
        currentUser = {
          name: register ? String(data.get("name")).trim() : (isAdmin ? "CRAPO Admin" : "Demo Customer"),
          email: email,
          role: isAdmin ? "admin" : "customer"
        };
        writeStorage("crapo-user", currentUser);
        closeModal();
        renderPage();
        route(isAdmin ? "admin" : "dashboard");
        showToast(register ? "Your demo account is ready." : "You’re signed in to the demo.", "success");
      });
    });
  }

  function bookingModal(car) {
    const search = routeInfo().query;
    const defaultCity = search.get("city") || car.citySlug;
    const defaultDrop = search.get("drop") || defaultCity;
    const startDate = search.get("pickup") || todayString(1);
    const endDate = search.get("return") || todayString(2);
    const pickupTime = search.get("pickupTime") || "10:00";
    const returnTime = search.get("returnTime") || "10:00";
    showModal('<button class="dialog-close" type="button" data-dismiss-modal aria-label="Close"><i class="bi bi-x-lg"></i></button><p class="eyebrow"><span></span> RENTAL DETAILS</p><h2>Make it a little trip.</h2><p class="dialog-subtitle">Booking <strong>' + escapeHtml(title(car)) + '</strong> in ' + escapeHtml(car.city) + '.</p><form id="rental-form"><div class="form-two"><label>PICK-UP LOCATION<select name="pickup" required>' + cityOptions(defaultCity) + '</select></label><label>DROP-OFF LOCATION<select name="drop" required>' + cityOptions(defaultDrop) + '</select></label><label>PICK-UP DATE<input name="start" type="date" min="' + todayString(0) + '" value="' + escapeHtml(startDate) + '" required></label><label>RETURN DATE<input name="end" type="date" min="' + escapeHtml(startDate) + '" value="' + escapeHtml(endDate) + '" required></label><label>PICK-UP TIME<input name="pickupTime" type="time" value="' + escapeHtml(pickupTime) + '" required></label><label>RETURN TIME<input name="returnTime" type="time" value="' + escapeHtml(returnTime) + '" required></label></div><div class="payment-options"><span>PAYMENT METHOD · SIMULATED</span><label><input type="radio" name="payment" value="UPI" checked> UPI</label><label><input type="radio" name="payment" value="Card"> Card</label><label><input type="radio" name="payment" value="Cash on pickup"> Cash on pickup</label></div><div class="booking-summary"><div><span>Base rental <small id="summary-days">1 day</small></span><strong id="summary-base">' + money(car.pricePerDay) + '</strong></div><div><span>Taxes <small>5% demo estimate</small></span><strong id="summary-tax">' + money(car.pricePerDay * .05) + '</strong></div><div><span>Security deposit <small>Refundable</small></span><strong>' + money(car.deposit) + '</strong></div><div class="summary-total"><span>Estimated total</span><strong id="summary-total">' + money(car.pricePerDay * 1.05 + car.deposit) + '</strong></div></div><button class="button button-plum button-wide" type="submit">Continue to booking <i class="bi bi-arrow-up-right"></i></button><p class="demo-note"><i class="bi bi-info-circle"></i> No payment is processed in this demo.</p></form>', function () {
      const form = modal.querySelector("#rental-form");
      const start = form.elements.start;
      const end = form.elements.end;
      function recalculate() {
        const days = dayCount(start.value, end.value);
        const base = days * car.pricePerDay;
        const tax = base * .05;
        modal.querySelector("#summary-days").textContent = days + (days === 1 ? " day" : " days");
        modal.querySelector("#summary-base").textContent = money(base);
        modal.querySelector("#summary-tax").textContent = money(tax);
        modal.querySelector("#summary-total").textContent = money(base + tax + car.deposit);
        end.min = start.value;
        if (end.value < start.value) end.value = start.value;
      }
      start.addEventListener("change", recalculate);
      end.addEventListener("change", recalculate);
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const data = new FormData(form);
        const days = dayCount(String(data.get("start")), String(data.get("end")));
        const base = days * car.pricePerDay;
        const booking = {
          id: "CRB-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
          car: title(car), carId: car.id, image: car.image,
          pickup: cityName(String(data.get("pickup"))), drop: cityName(String(data.get("drop")) || String(data.get("pickup"))),
          start: String(data.get("start")), end: String(data.get("end")),
          days: days, base: base, tax: base * .05, deposit: car.deposit,
          total: base * 1.05 + car.deposit, payment: String(data.get("payment")), status: "Confirmed"
        };
        lastBooking = booking;
        const bookings = readStorage("crapo-bookings") || [];
        bookings.unshift(booking);
        writeStorage("crapo-bookings", bookings);
        writeStorage("crapo-last-booking", booking);
        closeModal();
        route("confirmation");
      });
    });
  }

  function serviceModal(serviceName) {
    const service = services.find(function (item) { return item.name === serviceName; }) || services[0];
    showModal('<button class="dialog-close" type="button" data-dismiss-modal aria-label="Close"><i class="bi bi-x-lg"></i></button><p class="eyebrow"><span></span> CRAPO CAR CARE</p><h2>Book a service.</h2><p class="dialog-subtitle">' + escapeHtml(service.name) + ' · starting at ' + money(service.price) + ' · ' + escapeHtml(service.duration) + '</p><form id="service-form"><div class="form-two"><label>YOUR NAME<input name="name" required maxlength="80" value="' + escapeHtml(currentUser ? currentUser.name : "") + '" placeholder="Your name"></label><label>MOBILE NUMBER<input name="phone" type="tel" inputmode="numeric" pattern="[0-9+() -]{8,18}" required placeholder="+91 98765 43210"></label><label>VEHICLE NUMBER<input name="vehicle" required maxlength="20" placeholder="TN 00 AB 1234"></label><label>CAR MODEL<input name="model" required placeholder="Make and model"></label><label>SERVICE TYPE<select name="service">' + services.map(function (item) { return '<option' + (item.name === service.name ? " selected" : "") + '>' + escapeHtml(item.name) + '</option>'; }).join("") + '</select></label><label>PREFERRED SERVICE CENTER<select name="center">' + window.CRAPO_CITIES.map(function (city) { return '<option>' + escapeHtml(city.name) + ' Service Studio</option>'; }).join("") + '</select></label><label>PREFERRED DATE<input name="date" type="date" min="' + todayString(0) + '" value="' + todayString(2) + '" required></label><label>PREFERRED TIME<input name="time" type="time" value="11:00" required></label><label class="pickup-check">PICK-UP REQUIRED?<span><input type="radio" name="pickup" value="Yes"> Yes <input type="radio" name="pickup" value="No" checked> No</span></label><label class="form-full">TELL US A LITTLE MORE<textarea name="issue" rows="2" maxlength="400" placeholder="Any symptoms or details we should know?"></textarea></label></div><button class="button button-plum button-wide" type="submit">Schedule service <i class="bi bi-arrow-up-right"></i></button><p class="demo-note"><i class="bi bi-info-circle"></i> Service bookings are simulated for this demo.</p></form>', function () {
      modal.querySelector("#service-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const selected = services.find(function (item) { return item.name === String(data.get("service")); });
        const appointment = {
          id: "CRS-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
          name: String(data.get("name")), phone: String(data.get("phone")),
          vehicle: String(data.get("model")) + " · " + String(data.get("vehicle")),
          service: selected.name, center: String(data.get("center")),
          date: String(data.get("date")) + " · " + String(data.get("time")),
          price: selected.price, status: "Scheduled"
        };
        lastService = appointment;
        const records = readStorage("crapo-services") || [];
        records.unshift(appointment);
        writeStorage("crapo-services", records);
        writeStorage("crapo-last-service", appointment);
        closeModal();
        route("service-confirmation");
      });
    });
  }

  function carAdminModal(car) {
    const isNew = !car;
    const item = car || { brand: "", model: "", citySlug: "chennai", type: "SUV", fuel: "Petrol", transmission: "Automatic", seats: 5, pricePerDay: 3499, mileage: "18 km/l", deposit: 6000, image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=82", available: true };
    showModal('<button class="dialog-close" type="button" data-dismiss-modal aria-label="Close"><i class="bi bi-x-lg"></i></button><p class="eyebrow"><span></span> FLEET MANAGEMENT</p><h2>' + (isNew ? "Add a demo car." : "Edit car listing.") + '</h2><form id="admin-car-form"><div class="form-two"><label>MAKE<input name="brand" required value="' + escapeHtml(item.brand) + '"></label><label>MODEL<input name="model" required value="' + escapeHtml(item.model) + '"></label><label>CITY<select name="city">' + cityOptions(item.citySlug) + '</select></label><label>TYPE<select name="type">' + ["Hatchback", "Sedan", "SUV", "Luxury", "Electric"].map(function (type) { return '<option' + (item.type === type ? " selected" : "") + '>' + type + '</option>'; }).join("") + '</select></label><label>FUEL<select name="fuel">' + ["Petrol", "Diesel", "Electric"].map(function (fuel) { return '<option' + (item.fuel === fuel ? " selected" : "") + '>' + fuel + '</option>'; }).join("") + '</select></label><label>TRANSMISSION<select name="transmission">' + ["Automatic", "Manual"].map(function (transmission) { return '<option' + (item.transmission === transmission ? " selected" : "") + '>' + transmission + '</option>'; }).join("") + '</select></label><label>SEATS<input name="seats" type="number" min="2" max="9" required value="' + item.seats + '"></label><label>PRICE PER DAY<input name="price" type="number" min="1" required value="' + item.pricePerDay + '"></label></div><button class="button button-plum button-wide" type="submit">' + (isNew ? "Add car to demo fleet" : "Save car changes") + '</button></form>', function () {
      modal.querySelector("#admin-car-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (isNew) item.id = "CR-" + String(Math.max.apply(null, cars.map(function (entry) { return Number(entry.id.slice(3)) || 0; })) + 1).padStart(3, "0");
        item.brand = String(data.get("brand")).trim();
        item.model = String(data.get("model")).trim();
        item.citySlug = String(data.get("city"));
        item.city = cityName(item.citySlug);
        item.type = String(data.get("type"));
        item.fuel = String(data.get("fuel"));
        item.transmission = String(data.get("transmission"));
        item.seats = Number(data.get("seats"));
        item.pricePerDay = Number(data.get("price"));
        item.year = 2025;
        if (isNew) cars.unshift(item);
        closeModal();
        renderPage();
        showToast("Car listing saved for this demo session.", "success");
      });
    });
  }

  function cityName(slug) {
    const city = window.CRAPO_CITIES.find(function (item) { return item.slug === slug; });
    return city ? city.name : slug;
  }

  function showToast(message, kind) {
    const region = document.getElementById("toast-region");
    const toast = document.createElement("div");
    toast.className = "toast-message " + (kind || "");
    toast.textContent = message;
    region.appendChild(toast);
    window.setTimeout(function () { toast.remove(); }, 3600);
  }

  document.addEventListener("click", function (event) {
    const target = event.target.closest("button, a");
    if (!target) return;
    if (target.matches("[data-open-auth]")) {
      event.preventDefault();
      authModal(target.dataset.openAuth);
    } else if (target.matches("[data-route]")) {
      route(currentUser && currentUser.role === "admin" ? "admin" : target.dataset.route);
    } else if (target.matches("[data-car-details]")) {
      route("car/" + target.dataset.carDetails);
    } else if (target.matches("[data-book-car]")) {
      const car = cars.find(function (item) { return item.id === target.dataset.bookCar; });
      if (car) bookingModal(car);
    } else if (target.matches("[data-service]")) {
      serviceModal(target.dataset.service);
    } else if (target.matches("[data-add-car]")) {
      carAdminModal(null);
    } else if (target.matches("[data-edit-car]")) {
      carAdminModal(cars.find(function (item) { return item.id === target.dataset.editCar; }));
    } else if (target.matches("[data-toggle-car]")) {
      const car = cars.find(function (item) { return item.id === target.dataset.toggleCar; });
      if (car) {
        car.available = !car.available;
        renderPage();
        showToast(title(car) + " marked " + (car.available ? "available" : "booked") + ".", "success");
      }
    } else if (target.matches("[data-delete-car]")) {
      const index = cars.findIndex(function (item) { return item.id === target.dataset.deleteCar; });
      if (index >= 0 && window.confirm("Remove this car from the demo fleet for this session?")) {
        cars.splice(index, 1);
        renderPage();
        showToast("The car was removed from this demo session.", "success");
      }
    }
  });

  document.addEventListener("submit", function (event) {
    if (event.target.id !== "home-search") return;
    event.preventDefault();
    const params = new URLSearchParams({
      city: document.getElementById("home-city").value,
      pickup: document.getElementById("home-pickup").value,
      return: document.getElementById("home-return").value,
      pickupTime: document.getElementById("home-pickup-time").value,
      returnTime: document.getElementById("home-return-time").value,
      drop: document.getElementById("home-drop").value
    });
    route("cars?" + params.toString());
  });

  const menuButton = document.querySelector(".mobile-menu-toggle");
  menuButton.addEventListener("click", function () {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    document.getElementById("main-nav").classList.toggle("open", !expanded);
  });
  document.getElementById("main-nav").addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      this.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
  window.addEventListener("hashchange", renderPage);
  renderPage();
}());
