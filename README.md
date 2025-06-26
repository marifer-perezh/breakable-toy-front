## Breakable Toy — Inventory Manager - Frontend

This project is part of the Spark Internship Program by Encora. 
It is a full-stack Inventory Management System built with:

- 🔙 **Backend**: Java 17 + Spring Boot + Maven 3.5 + H2 DB
- 🎨 **Frontend**: React + Axios + TypeScript + TailwindCSS (don't forget node.js)
  
```bash
.
├── README.md
├── backend
│   ├── README.md
│   ├── src
│   ├── config
│   ├── controller
│   ├── model
│   ├── repository
│   ├── service
├── frontend
│   ├── README.md
│   ├── src
│   ├── components/products
│   ├── hooks
│   ├── services
│   ├── types
```
---
### How to run frontend
- Install npm dependencies
```bash
npm install
```
- Run the App
```bash
npm start
```

**The frontend runs on port 8080**

### Current Features
- CRUD Operations – Basic product management (create, update, delete).  
- Filtering & Sorting – Backend-powered, flexible querying via query parameters.  
- Pagination – Clients can request pages of results  
- ⁠Metrics Endpoint – Calculates overall and per-category totals.  
- ⁠Checkbox Logic – Toggling stock state updates backend state.  
- UI Feedback – Conditional row highlighting (e.g., expired soon = red). 

### 🧑‍💻 Developed by
- 💡 marifer-perezh
- ✉️ maria.perez@encora.com