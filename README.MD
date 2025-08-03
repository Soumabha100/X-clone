X-Clone 🐦
X-Clone is a full-stack social media application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that replicates the core functionalities of X (formerly Twitter). It provides a complete user experience, from secure authentication and real-time notifications to creating, editing, and interacting with posts. This project serves as a comprehensive demonstration of modern web development principles, showcasing a robust backend API connected to a dynamic, responsive React frontend.

✨ Features
🔐 Secure JWT Authentication: Robust user registration and login system using JSON Web Tokens stored in secure httpOnly cookies. Users can sign in with either their email or username.

👤 Dynamic User Profiles: View user profiles with their tweets, follower/following counts, and an interactive follow/unfollow button.

✍️ Full Tweet Functionality (CRUD):

Create: Post new tweets that appear instantly on the feed.

Read: View a public "For you" feed with all users' posts or a private "Following" feed.

Update: Securely edit your own tweets with an "(edited)" indicator.

Delete: Securely delete your own tweets.

❤️ Rich Engagement System:

Like/Dislike: Instantly like and dislike tweets with a real-time UI update.

Commenting: Post comments on tweets in a beautifully designed modal and view comment threads.

🔔 Real-time Notification System:

Receive notifications for new followers, likes, and comments on your posts.

A dynamic badge in the sidebar shows the count of unread notifications.

A dedicated page to view and clear all notifications.

📱 Modern & Responsive UI:

Built with Tailwind CSS for a clean, modern, and fully responsive design.

Features smooth animations, loading states, and confirmation modals for a polished user experience.

🛠 Tech Stack
Frontend: React.js, Redux Toolkit, React Router, Tailwind CSS, Axios

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JSON Web Tokens (JWT), bcryptjs, cookie-parser

📁 Project Structure
The project is organized into a monorepo structure with separate directories for the backend and frontend.

x-clone/
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── .env
│ └── index.js
├── frontend/
│ ├── public/
│ └── src/
│ ├── components/
│ ├── hooks/
│ └── redux/
└── README.md

⚙️ Getting Started
Follow these steps to get your local development environment set up and running.

1. Clone the Repository
   git clone https://github.com/Soumabha100/X-clone.git
   cd X-clone

2. Backend Setup

# Navigate to the backend directory

cd backend

# Install dependencies

npm install

# Create a .env file in the /backend directory and add the following variables:

PORT=8000
MONGO_URI=your_mongodb_connection_string
TOKEN_SECRET=a_very_strong_and_random_secret_key

# Start the backend server

npm run dev

3. Frontend Setup

# Navigate to the frontend directory from the root

cd frontend

# Install dependencies

npm install

# Start the frontend development server

npm run dev

The application should now be live! The backend will be running on http://localhost:8000 and the frontend on http://localhost:5173.

👥 Authors & Contributors
This project is the result of the collaborative effort of a dedicated team of students from the Swami Vivekananda Institute of Science and Technology (SVIST).

Soumabha Majumder

Tamalika Das

Suman Bera

Department of Computer Science & Engineering, 2nd Year

📡 API Endpoints Overview
The API is structured around REST principles. All protected routes are secured by a JWT authentication middleware.

User Routes (/api/v1/user)
POST /register: Register a new user.

POST /login: Log in an existing user with email/username and password.

GET /logout: Log out the current user.

GET /me: Get the profile of the currently authenticated user (protected).

GET /profile/:id: Get the public profile of any user (protected).

GET /otheruser/:id: Get a list of users to follow (protected).

POST /follow/:id: Follow another user (protected).

POST /unfollow/:id: Unfollow another user (protected).

PUT /bookmark/:id: Bookmark a tweet (protected).

Tweet Routes (/api/v1/tweet)
POST /create: Create a new tweet (protected).

DELETE /delete/:id: Delete a tweet (protected).

PUT /edit/:id: Edit a tweet (protected).

PUT /like/:id: Like or dislike a tweet (protected).

POST /comment/:id: Add a comment to a tweet (protected).

GET /public: Get all tweets from all users for the "For you" feed (protected).

GET /alltweets/:id: Get tweets from the user and people they follow (protected).

GET /user/:id: Get all tweets for a specific user's profile (protected).

Notification Routes (/api/v1/notifications)
GET /: Get all notifications for the logged-in user (protected).

DELETE /clear: Delete all notifications for the logged-in user (protected).

GET /unread-count: Get the count of unread notifications (protected).

🚧 Future Improvements
This project has a solid foundation that can be extended with many exciting features:

Retweet Functionality: Allow users to share or quote-tweet other posts.

Image & Video Uploads: Integrate a cloud storage service like Cloudinary or AWS S3 to handle media uploads.

Real-time Updates: Use WebSockets (e.g., Socket.io) for real-time notifications and feed updates without needing to refresh.

Advanced Search: Implement a more powerful search functionality for users and tweets.

Direct Messaging: Build a private messaging system between users.
