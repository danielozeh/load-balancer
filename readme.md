
# Load Balancing API

### Author: Daniel Ozeh
### Email: danielozeh@gmail.com

### Folder Structure

```plaintext
.
├── package.json
├── readme.md
├── .env-example
├── .gitignore
├── app.ts               # Main entry file
├── clock.ts             # Clock service to run periodic tasks
├── src
│   ├── config           # Configuration files
│   ├── controllers      # API controllers
│   ├── core             # Core modules and classes
│   ├── models           # Database models (Not used for this project)
│   ├── routes           # API route definitions
│   ├── services         # Business logic and services
│   ├── tests            # Unit tests
│   ├── utils            # Utility functions
│   ├── validations      # Validation for incoming requests
```

### Technologies Used
- Node.js
- Express
- TensorFlow
- Typescript
- Jest

## Task Description

### Project Overview

The goal of this project is to create a robust transaction processing system that:

- Processes transactions by directing requests to multiple server endpoints.
- Ensures high availability by selecting healthy servers.
- Caches server health status for performance optimization.
- Labels transactions using a combination of rule-based and machine learning (ML) methods (TensorFlow).
- Stores transaction data and labels in a File (No DB for this project).
- Includes a clock service (clock.ts) for periodic health checks on the servers.


### Installation
To set up this project locally:

### Clone the repository:
```bash
git clone https://github.com/danielozeh/load-balancer.git
```

### Navigate into the project directory:
```bash
cd load-balancer
```

### Install dependencies:
```bash
npm install
```

### Postman Collection
[Postman Collection](https://documenter.getpostman.com/view/6890514/2sAY517ziy)

Set up environment variables by creating a .env file in the root directory
You can copy the .env-example into .env

### Running the Application
This project requires running multiple instances of the server and the clock.ts file. Here’s how to start each:

### Start Development Servers
To run the main server along with four additional load-balanced servers, open separate terminal and run:

```bash
npm run dev       # Main server
npm run dev:1     # Server 1
npm run dev:2     # Server 2
npm run dev:3     # Server 3
npm run dev:4     # Server 4
npm run dev:5     # Server 5
```

### Start the Clock Service
To run the clock service, which periodically checks the health status of each server, use:
```bash
npm run clock
```

### Running the Tests
Unit and integration tests are included to verify the functionality of each module. To run the tests:
```bash
npm run test
```