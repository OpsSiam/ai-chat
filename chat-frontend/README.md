# Chat Frontend

This is the frontend part of a chat application using React that communicates with a backend server. The frontend allows users to send messages, upload files, and interact with an AI assistant (Azure OpenAI).

## Features

- **Send Messages**: Users can type messages and send them to the server for processing.
- **File Upload**: Users can upload up to 3 files at a time, with support for several file types (e.g., `.txt`, `.json`, `.pdf`, `.yaml`).
- **Real-time AI Responses**: The frontend supports streaming of AI responses from Azure OpenAI in real-time.
- **Multiple File Uploads**: Upload multiple files, with each file’s content sent to the server and a response generated for each.
- **Session Management**: Each conversation is stored as a session, which can be renamed or deleted.
- **Loading States**: Displays loading indicators when waiting for AI responses.
- **File Type Validation**: Rejects unsupported file types with a friendly assistant message.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Supported File Types](#supported-file-types)

## Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 14.x)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/chat-frontend.git
   cd chat-frontend
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Configure environment variables:**
    Create a .env file in the root directory and set up your API base URL:

   ```bash
   REACT_APP_API_BASE_URL=http://localhost:5001
      ```

4. **Start the development server:**

   ```bash
   yarn start
      ```            

    The app will start on http://localhost:3000.

3. **Running with Docker Compose:**

    If you have `docker-compose.yml` in the root folder:
    - Update environment variables directly in docker-compose.yml, modify the environment section of the docker-compose.

    ```bash  
    docker-compose up --build
    ```

    This will automatically build the API and start it on port 5001, as defined in the `docker-compose.yml`.

## Usage
1. Open the application in your browser at http://localhost:3000.
2. Type a message into the input box and press Enter or click the "Send" button to send the message.
3. You can also click the paperclip icon to upload files.
4. AI responses are streamed in real-time, and you'll see a loading indicator while waiting for responses.