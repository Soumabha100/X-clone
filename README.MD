# X-Clone: A Full-Stack Social Media Platform

![X-Clone Application Showcase](assets/Final%20Video.mp4)
![Login Page](assets/Pic%201.png)
![Home Feed](assets/Pic%202.png)
![Profile Page](assets/Pic%203.png)
![Notifications Page](assets/Pic%204.png)
![Trending Section](assets/Pic%205.png)
![Bookmarks Section](assets/Pic%206.png)

X-Clone is a feature-rich, full-stack social media application engineered to mirror the core functionalities and user experience of X (formerly Twitter). Built on the MERN stack, this project demonstrates a robust, scalable, and high-performance web architecture, from a secure RESTful API to a dynamic, responsive frontend.

**Live Application:** **[https://x-clone-api-soumabha.onrender.com](https://x-clone-api-soumabha.onrender.com)**

---

## 🏛️ Architectural Overview

The application is architected with a decoupled frontend and backend, a standard practice for modern, scalable web services.

- **Frontend:** A dynamic Single-Page Application (SPA) built with **React** and **Vite**, deployed on **Vercel** for global content delivery and performance.
- **Backend:** A secure, stateless RESTful API powered by **Node.js** and **Express.js**, hosted on **Render**.
- **Database:** A **MongoDB Atlas** cluster serves as the data persistence layer, with schemas designed for efficient data relationships and query performance.

This architecture ensures a clear separation of concerns, allowing for independent development, scaling, and maintenance of the client and server.

---

## ✨ Core Features

### 1. Authentication & Security

- **Secure JWT Authentication:** Employs JSON Web Tokens stored in `httpOnly` cookies, providing robust protection against XSS attacks. The system is configured with secure, cross-domain policies for production environments.
- **Full Credential Management:** Includes user registration with validation, login with either email or username, and a secure password reset flow.

### 2. Content & Feed

- **Full Tweet CRUD Functionality:** Users can create (with text and images), read, update, and delete their own posts.
- **Dual-Mode Content Feed:** The main feed offers two distinct timelines: a public "For you" feed for content discovery and a personalized "Following" feed.
- **Infinite Scrolling:** Implemented for a smooth, uninterrupted browsing experience on all feeds.

### 3. Social Engagement Ecosystem

- **User Interaction:** Core social features including liking, commenting, and retweeting are fully implemented.
- **Bookmarking:** Users can save tweets to a private, dedicated "Bookmarks" page for later viewing.
- **Social Graph:** A complete follow/unfollow system allows users to curate their own social network.

### 4. User Experience & Performance

- **Optimistic UI Updates:** State is managed globally with **Redux Toolkit**, providing instant UI feedback for actions like liking and following.
- **High-Performance Data Fetching:** **TanStack Query (React Query)** is used as a caching layer to minimize network requests, resulting in instantaneous page loads for previously visited profiles and a significant reduction in loading states.
- **Real-Time Notifications:** A notification system alerts users to new followers, likes, and comments, with a dynamic badge in the UI displaying the unread count.
- **Cloud Media Management:** Image uploads for profiles and posts are handled seamlessly via **Cloudinary**, ensuring fast content delivery and optimized media transformations.
- **Responsive Design:** The UI is fully responsive, crafted with **Tailwind CSS** to provide an optimal experience across all devices.

---

## 🛠️ Tech Stack & Key Libraries

| Category             | Technology / Library                                        |
| -------------------- | ----------------------------------------------------------- |
| **Frontend**         | `React.js`, `Vite`, `React Router DOM`                      |
| **State Management** | `Redux Toolkit`, `TanStack Query (React Query)`             |
| **Styling**          | `Tailwind CSS`                                              |
| **Backend**          | `Node.js`, `Express.js`                                     |
| **Database**         | `MongoDB Atlas`, `Mongoose` (with indexing for performance) |
| **Authentication**   | `JSON Web Tokens (JWT)`, `bcryptjs`, `cookie-parser`        |
| **API & Networking** | `Axios`, `RESTful Principles`                               |
| **Image Handling**   | `Cloudinary`, `Multer`                                      |
| **Deployment**       | `Vercel` (Frontend), `Render` (Backend)                     |

---

## ⚙️ Local Development Setup

Follow these steps to get the project running on your local machine.

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/Soumabha100/X-clone.git](https://github.com/Soumabha100/X-clone.git)
    cd X-clone
    ```
2.  **Backend Setup**

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the `/backend` directory and add the required environment variables.

3.  **Frontend Setup**

    ```bash
    cd ../frontend
    npm install
    ```

    Create a `.env` file in the `/frontend` directory to specify the backend API URL.

4.  **Run the Application**
    - Start the backend server from the `/backend` directory: `npm run dev`
    - Start the frontend server from the `/frontend` directory: `npm run dev`

---

### 👥 Project Authors

This project was brought to life by a dedicated team of students from the **Swami Vivekananda Institute of Science and Technology (SVIST)**.

- **Soumabha Majumder**
- **Tamalika Das**
- **Suman Bera**

_Department of Computer Science & Engineering, 2nd Year_
