# CRAPO Car Rental & Service

A responsive, premium-feel front-end concept for an MCA car rental and service management project. The original CRAPO identity uses warm ivory, muted lavender, plum, champagne and peach accents. It is independent of the Java/Maven project in this repository; no Java code was changed.

## Run locally

From the repository root, start a local static server:

```sh
python3 -m http.server 8000 --directory crapo-demo
```

Open <http://localhost:8000>. Or, from this folder, run `python3 -m http.server 8000` and open the same URL. A static server is recommended so browser storage, routing and assets work consistently.

## Demo features

- Home page with pickup/drop-off locations, pickup/return dates and times, trust features, city coverage and featured vehicles.
- Rental catalog with exactly **100 2025 demo listings** (ten vehicle models across ten Tamil Nadu cities), individual photo URLs, ratings, daily prices, and live location, search, type, fuel, transmission, seating, price and sorting filters.
- Car detail route with the selected listing’s photo, specifications, mileage, security deposit and booking entry point.
- Booking summary recalculates day count, base price, estimated tax and deposit; UPI, card and cash-on-pickup options are demo-only. Confirmation, customer dashboard and printable invoice are included.
- Nine car-care services with appointment forms, service-center selection and confirmation.
- Customer dashboard and admin demo dashboard with sample metrics, chart, workflow and in-session car add/edit/delete/availability controls.
- About and contact pages, responsive mobile navigation, accessible labels, and localStorage-backed demo account/booking history.

Demo credentials: **customer@crapo.com / customer123** and **admin@crapo.com / admin123**. Authentication and booking actions are simulations in the browser; they do not create real accounts, reservations, payments or service orders.

Car photos are royalty-free Unsplash image URLs and require an internet connection. The front end uses HTML, CSS, Bootstrap 5 styling and vanilla JavaScript; it has no build step or backend dependency. Bootstrap Icons and Google Fonts are also loaded from their CDNs.

## Cities in the sample fleet

Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Tirunelveli, Erode, Vellore, Thanjavur, and Thoothukudi / Tuticorin.

## MySQL schema

`schema.sql` documents the existing Java/JPA entity tables plus a relational starting point for the rental and service demo flows. It does not connect this static demo to a database. Review and adapt the schema for a real deployment; never use demo credentials or unsalted client-side authentication in production.

## Files

- `index.html` — app shell, responsive navigation, footer and modal host
- `assets/catalog.js` — source models/cities and the 100 2025 demo car listings
- `assets/app.js` — home, catalog, details, booking, services, contact, dashboard and admin interactions
- `assets/styles.css` — responsive CRAPO design system and page layouts
- `details.html` — compatibility redirect for direct car-detail links
- `schema.sql` — MySQL reference schema
