# Hackme Corp

Disclaimer: the branch new-main-now is our final branch. 

## Introduction

- Hackme Corp is a seller-centered marketplace designed to help businesses sell and promote their products efficiently. With a focus on cost-effective selling, robust analytics, and an expanded customer base, our platform empowers vendors to thrive in the competitive gaming and electronics market.

## Target Audience
	•	Independent vendors and small businesses
	•	Gaming retailers and electronics sellers
	•	Enthusiasts looking for niche products

## Value Proposition
	•	Secure Transactions – Vendor verification and buyer protection to ensure trust and safety.
	•	Low Commission Fees – Competitive pricing for vendors compared to major marketplaces.
	•	Smart Analytics – AI-powered insights to help vendors understand sales trends and customer behavior.
	•	Expanded Reach – Access a wider audience with advanced search and recommendation algorithms.


## Why This Project?

The U.S. video game market is projected to reach $58.7 billion in 2024, offering a huge opportunity for businesses to sell hardware and software. Hackme Corp aims to provide a dedicated platform tailored for vendors in this booming industry.

### Competitors
	•	Microcenter
	•	BestBuy
	•	Amazon
	•	eBay
	•	GameStop
	•	Walmart
	•	NewEgg


## Core Features
	1.	Vendor Dashboard (Landing Page)– Engaging homepage showcasing vendor's products' stats
	2.	Product Listing System – CRUD for products, quantities, prices.
	3.	Order Processing – Efficient management of orders, including tracking and status updates.
	4.	Search Functionality – Simple search bar that allows to search and filter by product name.
	5.	Security - Authentication of Users
	6.	Sales Trends & Analytics – Insights on product demand over time.

### Extra Features
	•	Discount & Promotion Codes - adjust price by certain percentage for all store products.
	•	Customer Reviews & Ratings Page – Verified purchase reviews with upvoting/downvoting.
	•	Security & Verification – Fraud prevention and vendor legitimacy checks.

### Future Development
	•	Price Comparison – Display minimum and maximum prices of a product across vendors.
	•	Bidding System – Auction-based product sales for rare gaming items.
	•	Loyalty Rewards – Customer points for purchases and interactions.
	•	Trade-In Program – Enable sellers to buy back used items from customers.
	•	Advanced Search & Filtering – AI-powered recommendations and multi-criteria filtering.

### Security & Performance Enhancements
	•	Multi-Factor Authentication (MFA) – Secure vendor and customer accounts.
	•	AJAX-Based Form Submission – Real-time validation and error handling.
	•	Modularized Data Handling – Organized and reusable backend code.
	•	MongoDB Optimization – Indexing for fast search and retrieval.
	•	XSS & CSRF Protection – Secure input handling and request validation.
	•	Server-Side Pagination – Performance improvements for large product lists.
	•	(Stretch) Secure Payment Gateways – Integration with Stripe and PayPal.


Technology Stack
	•	Frontend: HTML, CSS, JavaScript
	•	Backend: Node.js, Express.js
	•	Database: MongoDB
	•	Security: AJAX, JWT Authentication, Input Validation
	•	Deployment: Docker (Scalability in future phases)

Installation & Setup

Prerequisites
	•	Node.js (v18+)
	•	MongoDB (local or cloud instance)

Clone the Repository

`git clone https://github.com/your-username/hackme-corp.git`
`cd hackme-corp`

Install Dependencies

`npm install`

Environment Configuration

Create a .env file and define the following variables:

        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_secret_key
        PORT=5000`

Run the Application

`npm start`

The server will start on http://localhost:5000.

Note: Database seeding functions are called automatically after npm start.

Contributing

We welcome contributions! Feel free to submit issues or pull requests to improve the platform.

License

MIT License – Open-source and free for commercial use.
