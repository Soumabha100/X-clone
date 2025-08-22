X-Clone 🐦: A Journey in Full-Stack Development
Welcome to X-Clone, a passion project born from a love for learning and a fascination with the intricate world of social media. This is more than just a clone; it's a handcrafted, full-stack social media application that captures the essence of X (formerly Twitter), brought to life with the powerful MERN stack (MongoDB, Express.js, React.js, Node.js).

This project was built from the ground up to be a canvas for exploring modern web development. It's a testament to the challenges, breakthroughs, and collaborative spirit that define the journey of a developer. We invite you to explore, interact, and see what's possible when curiosity meets code.

👥 The Team Behind the Code
This project is the result of the collaborative energy and dedication of a team of aspiring software engineers from the Swami Vivekananda Institute of Science and Technology (SVIST).

Soumabha Majumder

Tamalika Das

Suman Bera

Department of Computer Science & Engineering, 2nd Year

✨ A Tour of Our Creation (Features)
We focused on building a feature-rich, intuitive, and robust user experience.

🔐 Seamless & Secure Onboarding: A secure user registration and login system using JWTs stored in httpOnly cookies. New users are automatically logged in after registering, creating a smooth, uninterrupted first experience.

👤 Dynamic User Profiles: Every user has a unique space. View profiles with custom profile & banner images, bios, and real-time follower/following counts.

✍️ Express Yourself (Full Tweet CRUD):

Create: Share your thoughts with text and images, uploaded seamlessly to Cloudinary.

Read: Enjoy a dynamic, dual-mode feed. Choose the algorithmic "For you" tab or the chronological "Following" tab.

Update & Delete: Users have full control to securely edit or delete their own posts.

❤️ A Rich Engagement Ecosystem:

Like, Comment, Retweet: The three pillars of social interaction are fully implemented. Like posts, leave comments in a beautiful modal, and share content with the retweet feature.

Bookmark Your Favorites: Save important or interesting tweets with a single click and revisit them on a dedicated, private Bookmarks page.

🔔 Real-Time Notification System:

Never miss a moment with notifications for new followers, likes, comments, and retweets.

A dynamic badge in the sidebar keeps you updated on unread notifications.

📱 Polished & Responsive UI:

Crafted with Tailwind CSS for a clean, modern aesthetic that looks beautiful on any device.

Enhanced with smooth animations, skeleton loaders for a fluid data-fetching experience, and intuitive confirmation modals.

🛠️ Our Digital Blueprint (Tech Stack)
Frontend: React.js with Vite for a lightning-fast development experience.

State Management: Redux Toolkit for predictable and scalable state.

Routing: React Router DOM for seamless client-side navigation.

Styling: Tailwind CSS for a modern, utility-first design system.

API Communication: Axios for handling HTTP requests.

Backend: Node.js with the Express.js framework.

Database: MongoDB with Mongoose for elegant schema design and data modeling.

Authentication: JSON Web Tokens (JWT) and bcryptjs for secure password hashing.

Image Uploads: Multer and Cloudinary for handling media storage in the cloud.

⚙️ Getting Started
Follow these steps to get your local development environment set up and running.

Clone the Repository

Bash

git clone https://github.com/Soumabha100/X-clone.git
cd X-clone
Backend Setup

Bash

# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and add the required variables (see .env.example)
# PORT, MONGO_URI, TOKEN_SECRET, CLOUD_NAME, API_KEY, API_SECRET

# Start the backend server
npm run dev
Frontend Setup

Bash

# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
The application should now be live! The backend will be running on http://localhost:8000 and the frontend on http://localhost:5173.

📡 API Endpoints Overview
The API is structured around REST principles and secured by a JWT authentication middleware.

User Routes (/api/v1/user): Handles registration, login, logout, profiles, following, bookmarking, and user deletion with data cleanup.

Tweet Routes (/api/v1/tweet): Handles full CRUD for tweets, plus liking, commenting, and retweeting.

Notification Routes (/api/v1/notifications): Handles fetching, clearing, and counting unread notifications.

🚀 Our Learning Journey & Future Horizons
This project was an incredible learning experience, pushing us to solve real-world problems from database schema design to frontend state management. While we're proud of the final product, our journey as developers is never truly over. Here are some exciting features we envision for the future:

Real-time Updates: Integrating WebSockets (Socket.io) to push live notifications and feed updates to users without needing a refresh.

Direct Messaging: Building a private, real-time chat system between users.

Advanced Search: Implementing a more powerful search for users and tweets.