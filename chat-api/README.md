# Chat API Backend

This is the backend for the chat application using Express.js. It manages session creation, message storage, file uploads, and communicates with Azure OpenAI to provide AI-driven responses. The API is designed to work with the frontend part of the application.

## Features

- **Session Management**: Create, fetch, rename, and delete chat sessions.
- **Message History**: Store and retrieve messages for each session.
- **File Uploads**: Support for text, JSON, PDF, and other file types.
- **Real-time AI Responses**: Stream responses from Azure OpenAI API.
- **Error Handling**: Graceful error handling for invalid inputs, unsupported files, and API errors.
  
## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)

## Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 14.x)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- SQLite (for database)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/chat-api.git
   cd chat-api
    ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add the following:
   
   ```
   REACT_APP_API_BASE_URL=http://localhost:5001
   AZURE_OPENAI_API_KEY=your-azure-openai-api-key
   AZURE_OPENAI_API_VERSION=your-api-version
   AZURE_OPENAI_ENDPOINT=your-azure-endpoint
   AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
   PORT=5001
   ALLOWED_FRONTEND_URL=http://localhost:3000
   ```

5. **Start the server:**
   ```bash
   yarn start
   ```

   The server will start on [http://localhost:5001](http://localhost:5001).

6. **Running with Docker Compose:**

    If you have `docker-compose.yml` in the root folder:
    - Update environment variables directly in docker-compose.yml, modify the environment section of the docker-compose.

    ```bash  
    docker-compose up --build
    ```

    This will automatically build the API and start it on port 5001, as defined in the `docker-compose.yml`.

## Environment Variables

This project requires several environment variables. You can set them in the `.env` file in the root directory:

- `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key.
- `AZURE_OPENAI_API_VERSION`: API version for OpenAI.
- `AZURE_OPENAI_ENDPOINT`: Endpoint for Azure OpenAI.
- `AZURE_OPENAI_DEPLOYMENT_NAME`: Deployment name for Azure OpenAI.
- `PORT`: Port for the Express server.
- `ALLOWED_FRONTEND_URL` Your Chat Frontend URL.
## API Endpoints

### Session Management

- **Create a session**
  - `POST /api/sessions`
  - Request body: `{ "title": "Session title" }`
  - Response: `{ "id": 1, "title": "Session title" }`

- **Get all sessions**
  - `GET /api/sessions`
  - Response: Array of session objects.

- **Delete a session**
  - `DELETE /api/sessions/:sessionId`
  - Response: `{ "message": "Session deleted successfully" }`

- **Rename a session**
  - `PUT /api/sessions/:id`
  - Request body: `{ "title": "New session title" }`
  - Response: `{ "id": 1, "title": "New session title" }`

### Chat Messages

- **Get messages for a session**
  - `GET /api/sessions/:sessionId/messages`
  - Response: Array of messages for the session.

- **Send a chat message**
  - `POST /api/chat`
  - Request body: `{ "messages": [...], "sessionId": 1 }`
  - Response: AI-generated response from OpenAI.

### File Upload

- **Upload a file**
  - `POST /api/upload`
  - Supported file types: `.txt`, `.json`, `.pdf`, `.yaml`, etc.
  - Response: Confirmation of upload and content extraction (if applicable).


## Supported Upload File Types
The following file types are supported for uploading and interaction with Azure OpenAI:

- .txt
- .json
- .pdf
- .yaml, .yml
- .csv
- .xml
- .html
- .doc, .docx
- .xls, .xlsx
- .rtf
- .md (Markdown)

Files that are not supported will trigger a friendly rejection message from the AI assistant.


## Usage
1. **Start the server**: Run the server locally by executing `yarn start`. The server will run on `http://localhost:5001`.
2. **Interact with the API**: Use tools like [Postman](https://www.postman.com/) or [curl](https://curl.se/) to test the API.
3. **Integrate with the frontend**: Ensure the frontend is configured to communicate with the backend API.

## Additional Notes
1. Ensure the backend API is running for the frontend to work properly.
2. The AI assistant supports real-time message streaming and the display of code snippets with language-specific formatting.
3. Make sure to define all required environment variables before running the application.