# 🚀 TaskFlow: Real-Time Collaborative Task Manager

> A full-stack MERN application built with **Next.js**, **TypeScript**, and **Socket.io** for instant, real-time team collaboration.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Overview
TaskFlow is a robust task management platform that allows users to create, track, and manage tasks in real-time. Unlike traditional CRUD apps, this project utilizes **WebSockets (Socket.io)** to push updates instantly to all connected users, eliminating the need for page refreshes.

## ✨ Key Features
* **⚡ Real-Time Collaboration:** New tasks and updates appear instantly on all clients via Socket.io.
* **🔐 Secure Authentication:** JWT (JSON Web Token) implementation.
* **📂 Smart Task Management:** Organize tasks by Priority (High, Medium, Low) and Status.
* **🎨 Modern UI/UX:** Responsive dashboard built with **Next.js 14** and **Tailwind CSS**.

## 🛠️ Tech Stack
* **Frontend:** Next.js, TypeScript, Tailwind CSS, Axios
* **Backend:** Node.js, Express.js, MongoDB, Socket.io
* **Architecture:** Controller-Service-Repository Pattern

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd server
npm install
# Create .env file with PORT, MONGO_URI, JWT_SECRET
npm run dev
```
### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The app should now be running at http://localhost:3000 🚀

### 👨‍💻 Author
**Tejas Kamble**

Full Stack Developer


