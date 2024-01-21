# MyFlix Backend API 🎬 📼 

## Overview

The myFlix Backend API is a RESTful web service that provides access to a database of movies, directors, genres, actors, and user-related functionalities. This API allows users to retrieve information about movies, genres, directors, and actors, as well as manage user accounts and favorites. I made this as a project with CareerFoundry.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Authentication](#authentication)
  - [Documentation](#documentation)
- [License](#license)

## Getting Started

### Prerequisites

Before using the Movie Database Backend API, make sure you have the following prerequisites:

- Node.js installed
- MongoDB installed and running locally
- **Environment Variables:** This project does not require a separate environment file (`env` file). However, if you plan to deploy the API on platforms like Heroku, it automatically provides a `PORT` environment variable. The project uses `(process.env.PORT || 9999)` to dynamically assign the port. If you have specific environment configurations, you can set them accordingly.
  

### Installation

To install and set up the API, follow these steps:

1. Clone the repository: `git clone [repository-url]`
2. Install dependencies: `npm install`
3. Start the server: `npm start`

## Usage

The Movie Database Backend API offers various endpoints for interacting with the database. It includes functionality for retrieving movie information, managing user accounts, and handling favorites.

### Authentication

Before running the Movie Database Backend API, make sure to create a `config.js` file in the root directory of the project. This file should contain the JWT secret key for authentication. You can create the file with the following structure:

```javascript
// config.js

module.exports = {
  jwtSecret: "your-secret-key-here",
};
```
### Documentation

For the complete list of endpoints and detailed descriptions of requests and responses, please refer to the [Documentation](https://myflixapi.vanblaricom.dev:9999/documentation.html).

## License

This project is licensed under the [MIT License](LICENSE).
