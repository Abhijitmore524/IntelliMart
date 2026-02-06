# 🛒 IntelliMart – Full‑Stack E‑Commerce Application

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![JWT](https://img.shields.io/badge/Security-JWT-red)
![Architecture](https://img.shields.io/badge/Architecture-Monolithic-lightgrey)
![Status](https://img.shields.io/badge/Project-Completed-success)

**IntelliMart** is a full‑stack e‑commerce web application built using **Spring Boot, React, JWT, and MySQL**, providing a secure and role‑based online shopping platform for customers and sellers.

---


## 📁 Recommended Folder Structure

### Backend

```text
intellimart-backend/
├── src
│   └── main
│       ├── java
│       │   └── com
│       │       └── intellimart
│       │           ├── controller
│       │           ├── service
│       │           ├── repository
│       │           ├── entity
│       │           ├── security
│       │           └── dto
│       └── resources
│           └── application.properties
└── pom.xml

```

Frontend
```


intellimart-frontend/
├── src
│   ├── components
│   ├── pages
│   ├── context
│   ├── api
│   └── utils
└── package.json

```

▶️ How to Run the Project
Backend
```
# Import as Maven project
# Configure MySQL in application.properties
mvn spring-boot:run
```

Frontend
```
cd intellimart-frontend
npm install
npm start
```

## 🚀 Features

### 👤 User (Customer)
- Secure user registration and login (JWT authentication)
- Browse and search products
- Add, update, and remove items from cart
- Manage delivery addresses
- Place orders and view order history

### 🧑‍💼 Seller
- Seller authentication and authorization
- Add, update, and delete products (CRUD operations)
- Manage product inventory
- View and process customer orders

### 🛠 Admin
- Monitor users and sellers
- Ensure system security and smooth operation
- Manage overall platform activities (basic / extendable)

---

## 🏗️ Architecture Overview

- **Architecture Style:** Monolithic, layered architecture
- **Backend:** Spring Boot REST APIs
- **Frontend:** React.js with Context API
- **Security:** JWT authentication & role‑based access control
- **Database:** MySQL

---


## 📸 Screenshots

<img width="940" height="477" alt="image" src="https://github.com/user-attachments/assets/489f9b62-90a5-44ea-85ac-914abc12bd81" />
<img width="940" height="475" alt="image" src="https://github.com/user-attachments/assets/a132f5cf-3303-4cde-a416-5b8b6e6fa070" />








## Customer


<img width="940" height="453" alt="image" src="https://github.com/user-attachments/assets/f31a05cf-40a0-4b77-b949-3b4ee8db4f96" />
<img width="940" height="453" alt="image" src="https://github.com/user-attachments/assets/0f1c9e1d-0149-4796-8a6e-4272f1dddb65" />
<img width="940" height="479" alt="image" src="https://github.com/user-attachments/assets/8124bfd4-a01f-4f81-80dc-eee738e62afb" />
<img width="940" height="451" alt="image" src="https://github.com/user-attachments/assets/10a6ef6b-f7e7-4cf9-8869-a5c3362b9c2a" />
<img width="940" height="452" alt="image" src="https://github.com/user-attachments/assets/f4f65732-8878-4594-aabc-08c317d97c85" />
<img width="940" height="476" alt="image" src="https://github.com/user-attachments/assets/1115dca7-dbe4-4e6b-8942-fad81cf3aed1" />
<img width="940" height="474" alt="image" src="https://github.com/user-attachments/assets/30c25896-013f-4ada-8293-fe6d2f8c80b8" />
<img width="940" height="481" alt="image" src="https://github.com/user-attachments/assets/8a900af8-99a3-4264-985a-050637498561" />

## Seller 

<img width="940" height="478" alt="image" src="https://github.com/user-attachments/assets/461a38f7-718e-432b-b4d2-f8b28c1b9451" />
<img width="940" height="486" alt="image" src="https://github.com/user-attachments/assets/ac774577-2962-497a-af86-7e45eac71c32" />
<img width="940" height="414" alt="image" src="https://github.com/user-attachments/assets/1fc80c78-ea2a-4ba9-a461-0d2b293fa2c9" />

## ADMIN 

<img width="940" height="455" alt="image" src="https://github.com/user-attachments/assets/177c5482-f5c0-48e3-adc3-658e576ef87e" />
<img width="940" height="336" alt="image" src="https://github.com/user-attachments/assets/6042d845-536f-46fb-b326-5f885dbd4522" />
<img width="940" height="478" alt="image" src="https://github.com/user-attachments/assets/929afab2-fefb-4fb4-8337-92e42e8e1d46" />
<img width="940" height="478" alt="image" src="https://github.com/user-attachments/assets/8dfa25b4-e630-4fab-b041-615d585ac78a" />
<img width="940" height="453" alt="image" src="https://github.com/user-attachments/assets/7189841f-1b40-4925-8fcc-1a36b5ebb896" />
<img width="940" height="454" alt="image" src="https://github.com/user-attachments/assets/4f5ccb08-5be8-439b-a757-932981c5b888" />
<img width="940" height="482" alt="image" src="https://github.com/user-attachments/assets/f6a95b8d-7c07-487e-a41c-b41232d26fdd" />
<img width="940" height="451" alt="image" src="https://github.com/user-attachments/assets/dedc8d64-ac72-422f-8585-109f2666b93c" />
<img width="940" height="451" alt="image" src="https://github.com/user-attachments/assets/136cd23d-9ec1-43a0-a7c8-6be014b09ae6" />
<img width="940" height="449" alt="image" src="https://github.com/user-attachments/assets/f1c64055-5505-4b7e-87ba-fd784447ea47" />
<img width="940" height="453" alt="image" src="https://github.com/user-attachments/assets/05124732-d000-4dbb-b062-0c8f37cf678d" />

## Forgot Password 
<img width="940" height="478" alt="image" src="https://github.com/user-attachments/assets/4ca11df5-5e13-48e0-8451-0b4410b6b136" />
<img width="940" height="478" alt="image" src="https://github.com/user-attachments/assets/34fcf6a0-0e0e-4ba0-8bd5-1f0fb5660392" />

---

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- JWT
- Hibernate / JPA

### Frontend
- React.js
- Context API
- Axios
- Tailwind CSS

### Database & Tools
- MySQL
- Git & GitHub
- Swagger
- Postman

---

## 📂 Project Modules

- Authentication & Authorization Module  
- Product Management Module  
- Cart Management Module  
- Order Management Module  
- Seller Dashboard Module  
- Admin Module  

---

## 🔐 Security Implementation

- JWT token‑based authentication
- Role‑based access control (User, Seller, Admin)
- Secured REST APIs using Spring Security
- Soft‑delete mechanism for data integrity

---

## 🧪 Testing

- REST API testing using Swagger
- Manual API testing using Postman
- UI testing through browser

---

## 🚀 Future Enhancements

- Order tracking with email/SMS notifications
- Advanced admin dashboard with analytics
- Product reviews and ratings
- Mobile application support
- Performance optimization and caching

---


## 🎓 Academic Details

- **Project Title:** IntelliMart – E‑Commerce Application
- **Course:** PG‑DAC August 2024
- **Student:**
  - Abhijit Shivaji More
- **Project Guide:** Mr. Harshal
- **Centre Coordinator:** Anil Sharma

---


