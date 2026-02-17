# Book Aura Backend (Spring Boot)

This is the Java Spring Boot backend for the Book Aura application.

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- MongoDB Atlas Account (or local MongoDB)

## Setup

1.  **Configure Database**:
    Open `src/main/resources/application.properties` and replace `YOUR_MONGO_CONNECTION_STRING` with your actual MongoDB connection string.
    
    ```properties
    spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/bookaura_db
    ```

2.  **JWT Secret**:
    The `jwt.secret` is pre-configured for development. For production, use a secure random string.

## Running the Application

Navigate to the `backend-spring` directory and run:

```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create a book (Admin)
- `PUT /api/books/{id}` - Update a book (Admin)
- `DELETE /api/books/{id}` - Delete a book (Admin)

### Messages (Admin)
- `GET /api/messages`
- `POST /api/messages`
- `DELETE /api/messages/{id}`

### FAQs
- `GET /api/faqs`
- `POST /api/faqs`
- `PUT /api/faqs/{id}`
- `DELETE /api/faqs/{id}`
