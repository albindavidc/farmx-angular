# 🌾 **FarmX - Clean Architecture Folder Structure**  

FarmX is a modern application designed using **Clean Architecture** principles, ensuring **scalability, maintainability, and separation of concerns**. The project is divided into:  

- 📌 **Frontend:** Built with **Angular**, using **NgRx** for state management.  
- 📌 **Backend:** Powered by **Node.js + Express.js**, following a structured Clean Architecture approach.  

---  

## 📂 **Project Folder Structure**  

### 🖥️ **Frontend (Angular)**  
The frontend follows **Angular best practices**, emphasizing modularity, reusable components, and state management with **NgRx**.  

### 📂 **Frontend Folder Structure**  




```
farmx-frontend/
├── src/
│   ├── app/
│   │   ├── core/                   # Core module
│   │   │   ├── auth/               # Authentication services and guards
│   │   │   │   ├── auth.service.ts # Auth service
│   │   │   │   ├── auth.guard.ts   # Auth guard
│   │   │   │   ├── auth.interceptor.ts # Auth interceptor
│   │   │   │   ├── otp.service.ts  # OTP service
│   │   │   │   └── google.auth.service.ts # Google Auth service
│   │   │   ├── services/           # Core services
│   │   │   │   ├── api.service.ts  # API service
│   │   │   │   ├── notification.service.ts # Notification service
│   │   │   │   └── role.service.ts # Role service
│   │   │   └── models/             # Core models
│   │   │       ├── user.model.ts   # User model
│   │   │       ├── role.model.ts   # Role model
│   │   │       └── otp.model.ts    # OTP model
│   │   │
│   │   ├── modules/                # Feature modules
│   │   │   ├── auth/               # Authentication module
│   │   │   │   ├── login/          # Login component
│   │   │   │   ├── register/       # Register component
│   │   │   │   ├── forgot-password/ # Forgot password component
│   │   │   │   └── otp-verification/ # OTP verification component
│   │   │   ├── user/               # User management module
│   │   │   │   ├── profile/        # Profile management component
│   │   │   │   ├── settings/       # Settings management component
│   │   │   │   └── role-management/ # Role management component
│   │   │   ├── article/            # Article management module
│   │   │   ├── event/              # Event management module
│   │   │   ├── course/             # Course management module
│   │   │   ├── certificate/        # Certificate management module
│   │   │   ├── chat/               # Chat management module
│   │   │   ├── community/          # Community management module
│   │   │   └── admin/              # Admin management module
│   │   │
│   │   ├── shared/                 # Shared components and utilities
│   │   │   ├── components/         # Reusable components
│   │   │   ├── directives/         # Custom directives
│   │   │   ├── pipes/              # Custom pipes
│   │   │   └── models/             # Shared models
│   │   │
│   │   ├── state/                  # NgRx state management
│   │   │   ├── auth/               # Auth state
│   │   │   ├── user/               # User state
│   │   │   ├── article/            # Article state
│   │   │   ├── event/              # Event state
│   │   │   ├── course/             # Course state
│   │   │   ├── certificate/        # Certificate state
│   │   │   ├── chat/               # Chat state
│   │   │   ├── community/          # Community state
│   │   │   └── admin/              # Admin state
│   │   │
│   │   ├── assets/                 # Static assets
│   │   ├── styles/                 # Global styles
│   │   │   ├── tailwind.css        # Tailwind CSS
│   │   │   └── global.scss         # Global SASS styles
│   │   │
│   │   ├── app.component.ts        # Root component
│   │   ├── app.module.ts           # Root module
│   │   ├── app-routing.module.ts   # Root routing
│   │   └── app.config.ts           # App-wide configuration
│   │
│   ├── environments/               # Environment configurations
│   │   ├── environment.ts          # Development environment
│   │   └── environment.prod.ts     # Production environment
│   │
│   ├── index.html                  # Main HTML file
│   ├── main.ts                     # Entry point
│   └── styles.scss                 # Global styles
│
├── .eslintrc.js                    # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── angular.json                    # Angular CLI configuration
├── package.json                    # Frontend dependencies
├── tailwind.config.js              # Tailwind CSS configuration
└── README.md                       # Project documentation
```


---

### 🖥️ **Backend (Node.js + Express.js)**  
The backend is structured based on **Clean Architecture**, dividing responsibilities into multiple layers.  

### 📂 **Backend Folder Structure**  

```
farmx-backend/
├── src/
│   ├── domain/                     # Pure Business Logic
│   │   ├── entities/               # Core business entities
│   │   │   ├── user.entity.ts      
│   │   │   ├── role.entity.ts      
│   │   │   ├── otp.entity.ts       
│   │   │   ├── article.entity.ts   
│   │   │   ├── event.entity.ts     
│   │   │   ├── course.entity.ts    
│   │   │   ├── certificate.entity.ts
│   │   │   ├── chat.entity.ts      
│   │   │   └── report.entity.ts    
│   │   ├── value-objects/          # Immutable domain primitives
│   │   │   ├── email.vo.ts
│   │   │   ├── password.vo.ts
│   │   │   └── uuid.vo.ts
│   │   ├── enums/                  # Domain enums
│   │   │   ├── user-role.enum.ts
│   │   │   └── event-status.enum.ts
│   │   ├── events/                 # Domain events
│   │   │   ├── user-created.event.ts
│   │   │   └── course-purchased.event.ts
│   │   ├── repositories/           # Repository interfaces (ports)
│   │   │   ├── user.repository.ts  
│   │   │   ├── article.repository.ts
│   │   │   └── ... (other interfaces)
│   │   └── services/               # Domain services
│   │       ├── auth.service.ts     
│   │       ├── otp.service.ts      
│   │       └── ... (other domain services)
│   │
│   ├── application/                # Application Business Rules
│   │   ├── use-cases/              # CQRS-style use cases
│   │   │   ├── auth/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── login.command.ts
│   │   │   │   │   ├── register.command.ts
│   │   │   │   │   └── ...
│   │   │   │   └── queries/
│   │   │   │       ├── get-user.query.ts
│   │   │   │       └── ...
│   │   │   ├── user/
│   │   │   │   ├── commands/
│   │   │   │   └── queries/
│   │   │   └── ... (other domains)
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   ├── auth/
│   │   │   │   ├── login.request.ts
│   │   │   │   └── login.response.ts
│   │   │   └── ... (other DTOs)
│   │   ├── mappers/               # Entity ↔ DTO transformations
│   │   │   ├── user.mapper.ts
│   │   │   └── ... (other mappers)
│   │   ├── interfaces/            # Application contracts
│   │   │   ├── crypto.service.ts
│   │   │   └── ... (other interfaces)
│   │   └── exceptions/            # Custom exceptions
│   │       ├── validation.error.ts
│   │       └── not-found.error.ts
│   │
│   ├── infrastructure/            # Frameworks & Drivers
│   │   ├── persistence/           # Database implementations
│   │   │   ├── mongodb/
│   │   │   │   ├── repositories/  # Concrete repositories
│   │   │   │   │   ├── user.repository.ts
│   │   │   │   │   └── ...
│   │   │   │   ├── models/        # ORM models
│   │   │   │   │   ├── user.model.ts
│   │   │   │   │   └── ...
│   │   │   │   └── migrations/
│   │   │   └── redis/
│   │   │       └── cache.repository.ts
│   │   ├── auth/                  # Authentication adapters
│   │   │   ├── jwt.service.ts     # Implements auth interface
│   │   │   └── google-auth.service.ts
│   │   ├── notification/          # Notification adapters
│   │   │   ├── email/
│   │   │   └── push/
│   │   ├── payment/               # Payment gateways
│   │   │   └── stripe.adapter.ts
│   │   └── server/               # Web server
│   │       ├── http/             # REST API
│   │       │   ├── controllers/
│   │       │   ├── middleware/
│   │       │   └── routes/
│   │       └── websocket/        # WebSocket
│   │           └── gateway.ts
│   │
│   ├── presentation/             # Delivery Mechanism (optional)
│   │   ├── rest/                 # REST API presentation
│   │   │   ├── controllers/      # Thin controllers
│   │   │   └── routes/
│   │   └── graphql/              # GraphQL presentation
│   │       ├── resolvers/
│   │       └── schemas/
│   │
│   ├── shared/                   # Cross-cutting concerns
│   │   ├── decorators/
│   │   ├── logger/
│   │   ├── utils/
│   │   └── config/               # Configuration
│   │       └── env.ts
│   └── main.ts                   # Composition Root
│
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   ├── application/
│   │   └── ...
│   └── integration/
│       ├── api/
│       └── ...
│
├── .env
├── package.json
└── README.md
```


---

## 🚀 **Key Features Implementation**  

### 🔒 **Backend Features**  
✅ **Authentication & Authorization**  
- JWT for secure **token-based authentication**.  
- OAuth2 for **Google login integration**.  
- **Role-Based Access Control (RBAC)** for managing user permissions.  

✅ **Real-Time Services**  
- **WebSockets** for live chat and notifications.  

✅ **Performance Optimization**  
- **Redis caching** for high-frequency data.  
- **Elasticsearch** for advanced search & filtering.  

✅ **Integrations**  
- **Payment Gateway** for secure transactions.  
- **Calendar API** for event scheduling.  

---

### 🎨 **Frontend Features**  
✅ **State Management**  
- **NgRx** for centralized, predictable state management.  

✅ **Styling & UI**  
- **Tailwind CSS** + **SASS** for flexible, utility-first styling.  
- **Reusable component library** for consistency across UI.  
- **Dynamic UI rendering** based on **user roles**.  

✅ **Offline & PWA**  
- **Angular PWA** for **offline functionality** and better performance.  
