Centralized Task Management System

1. Problem Statement
Difficulty in organizing, tracking, and completing daily tasks due to the lack of a centralized task management system.

2. Project Description
The Centralized Task Management System is a web-based application developed to help users efficiently manage their daily tasks. The system allows users to create, view, update, and delete tasks while tracking task status and due dates. This improves productivity, organization, and time management.

3. Proposed Solution
The proposed solution is a RESTful web application developed using Node.js, Express.js, MongoDB, and React.js. The system provides CRUD functionality for managing tasks efficiently through a centralized platform.

4. Features
- Create new tasks
- View all tasks
- Update task details
- Delete tasks
- Task status tracking
- Due date management
- Responsive frontend UI
- API integration with React frontend
- Validation and error handling

5. Technologies Used
 Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

Frontend
- React.js
- Tailwind CSS
- Axios
- Vite

Tools
- Postman
- GitHub

6.Project Structure
•	task-management-system
    1.	backend
        -   controllers
        -   models
        -   routes
        -	.env
        -	index.js
        -	package.json

    2.  frontend
        -	src
        -	package.json
        -	vite.config.js
    3.	README.md

7.API Endpoints
 Create Task
    POST  'http://localhost:8000/api/task/create'

    Example Reques -  json
    {
    "title": "IT2234 ICA3",
    "description": "Solo project work",
    "status": "In Progress",
    "dueDate": "2026-05-17",
    "completed": false
    }
 Get All Tasks
    GET  'http://localhost:8000/api/task/'

 Update Task
    PUT  'http://localhost:8000/api/task/update/:id'

Delete Task
    DELETE 'http://localhost:8000/api/task/delete/:id'


8.Setup Instructions
    Git Repository link: https://github.com/Kajane05/task-management-system_2022ICT108.git
    Backend Setup
    cd backend
    npm install
    Create  ' .env'  file
    MONGO_URL="mongodb://localhost:27017/taskManager"
    PORT=8000
    Run Backend
    node index.js

    Frontend Setup
    cd frontend
    npm install
    npm run dev

9. How to Run the Project

    Start Backend:- In terminal 
    cd backend
    node index.js

    Start Frontend:- open new terminal and ,
    cd frontend
    npm run dev
