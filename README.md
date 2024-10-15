# Document Management Application (cute cats)

## Overview

This project is a drag-and-drop document management application built using **React** for the frontend and **FastAPI** for the backend. The application allows users to visually manage documents, reorder them via drag-and-drop, and automatically saves the document state every five seconds.

## Features

- **Drag-and-Drop Interface**: Users can easily drag and drop documents into different categories.
- **Auto-Save Functionality**: Changes are saved automatically every five seconds if modifications are detected.
- **RESTful API**: The backend provides endpoints to fetch and update documents.

## Architecture

The application is designed using a microservices architecture, separating the frontend and backend components. This approach allows for independent development, deployment, and scaling.

### API Design

The backend API exposes two main endpoints:

- **GET `/documents`**: Fetches the list of documents.
- **PUT `/documents`**: Updates the documents in storage.

This design follows REST principles, utilizing standard HTTP methods for interactions.

### Data Handling

The backend currently uses in-memory storage for documents. This can be replaced with a database for production use, providing flexibility and scalability.

## Getting Started

### Prerequisites

- **Docker**: Ensure you have Docker and Docker Compose installed on your machine.

### Clone the Repository

```bash
git clone https://github.com/Kr18-creator/Cute-cats.git
cd cute-cats


├── backend
│   ├── app.py
│   ├── Dockerfile  # Backend Dockerfile
├── package.json
├── Dockerfile  # Frontend Dockerfile
└── docker-compose.yml

