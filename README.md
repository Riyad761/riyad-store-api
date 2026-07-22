# 🚀 Riyad Store API

Production-ready Node.js + Express REST API designed for the **Riyad Bot Framework**. This API serves as a centralized store directory for bot commands, plugins, media downloaders, AI utilities, and moderation scripts.

---

## 🌟 Key Features

- **Express REST API**: Fast, lightweight, structured controllers, routes, and middlewares.
- **MongoDB Atlas Integration**: Powered by Mongoose with auto-incrementing numeric IDs and text search.
- **Raw Code Distribution Endpoint (`GET /api/store/raw/:id`)**: Directly outputs raw JavaScript code strings (`Content-Type: text/plain`), allowing WhatsApp/Telegram/Discord bots to fetch and execute plugins dynamically.
- **High Availability & Memory Fallback**: Works out-of-the-box with or without `MONGODB_URI` set.
- **Metrics**: Track **Downloads** and **Likes** for every command plugin.
- **Search & Filtering**: Filter commands by **Category**, **Author**, **Featured**, **Trending**, or custom search query `?q=`.
- **Production Security**:
  - **Helmet**: Essential security headers.
  - **CORS**: Cross-origin configuration.
  - **Rate Limiting**: IP request limiters (`express-rate-limit`).
  - **Input Validation**: Sanitization & parameters check via `express-validator`.
- **Render Ready**: Includes preconfigured `render.yaml` for 1-click cloud deployment.

---

## 📂 Project Directory Structure

```
.
├── config/
│   └── db.js               # MongoDB Mongoose connection & status
├── controllers/
│   └── storeController.js  # Store request handlers (list, search, raw, upload, like, etc.)
├── models/
│   ├── StoreItem.js        # Mongoose Schema for Commands
│   └── Counter.js          # Auto-increment sequence model for numeric IDs
├── routes/
│   └── storeRoutes.js      # Express router endpoints mapping
├── middlewares/
│   ├── rateLimiter.js      # Rate limiters
│   ├── validator.js        # Express-validator input validation
│   └── errorHandler.js    # Global error handlers
├── utils/
│   ├── responseHandler.js  # Standardized JSON response helper
│   ├── seedData.js         # Initial command plugins seed data
│   └── inMemoryDb.js       # Fast in-memory sync store layer
├── app.js                  # Express application assembly
├── server.js               # Node.js server entry point
├── render.yaml             # Render deployment configuration
├── .env.example            # Environment variables template
└── README.md               # API documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/riyad_store?retryWrites=true&w=majority
NODE_ENV=development
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
# Production mode
npm start

# Development mode with live reload
npm run dev
```

The server will start listening on `http://localhost:3000`.

---

## 📌 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/store/list` | List commands with optional filters (`category`, `author`, `sort`, `page`) |
| `GET` | `/api/store/search?q=` | Search commands by name, description, author, or code |
| `GET` | `/api/store/info/:id` | Get detailed command JSON object by numeric `id` or Mongo ID |
| `GET` | `/api/store/raw/:id` | Get **raw JavaScript script** directly as plain text |
| `POST` | `/api/store/upload` | Upload a new command plugin |
| `PUT` | `/api/store/update/:id` | Update command details or source code |
| `DELETE` | `/api/store/delete/:id` | Delete a command by ID |
| `POST` | `/api/store/like/:id` | Increment like counter |
| `POST` | `/api/store/download/:id` | Increment download counter |
| `GET` | `/api/store/categories` | Get distinct categories list |
| `GET` | `/api/health` | API health check & MongoDB connection status |

---

## 📡 Request & Response Examples

### 1. List Commands
```bash
curl http://localhost:3000/api/store/list?sort=trending&limit=10
```

### 2. Search Commands
```bash
curl http://localhost:3000/api/store/search?q=gemini
```

### 3. Fetch Raw Command Code
```bash
curl http://localhost:3000/api/store/raw/1
```

### 4. Upload New Command
```bash
curl -X POST http://localhost:3000/api/store/upload \
  -H "Content-Type: application/json" \
  -d '{
    "name": "welcome-card",
    "version": "1.0.0",
    "author": "Riyad Dev",
    "category": "Tools",
    "description": "Generates welcome cards for new group members",
    "rawCode": "module.exports = { name: \"welcome\", execute: (bot, msg) => msg.reply(\"Welcome!\") };"
  }'
```

---

## 🤖 Riyad Bot Framework - Client Usage Example

In your **Riyad Bot** instance, you can auto-install commands directly from this API:

```javascript
const axios = require('axios');
const fs = require('fs');

async function installCommandFromRiyadStore(commandId) {
  const STORE_API = 'https://riyad-store-api.onrender.com';
  
  try {
    // 1. Fetch info
    const infoRes = await axios.get(`${STORE_API}/api/store/info/${commandId}`);
    const command = infoRes.data.data;
    
    // 2. Fetch raw JS code
    const rawCodeRes = await axios.get(`${STORE_API}/api/store/raw/${commandId}`);
    
    // 3. Save to plugins folder
    const filePath = `./plugins/${command.name}.js`;
    fs.writeFileSync(filePath, rawCodeRes.data);
    
    // 4. Record download metric
    await axios.post(`${STORE_API}/api/store/download/${commandId}`);
    
    console.log(`✅ Installed plugin "${command.name}" v${command.version} successfully!`);
  } catch (error) {
    console.error('❌ Plugin installation failed:', error.message);
  }
}
```

---

## 🌐 Deploying to Render

1. Push your repository to **GitHub**.
2. Connect your repository on [Render.com](https://render.com).
3. Select **Blueprint** deploy using `render.yaml` OR create a **Web Service**:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add `MONGODB_URI` and `PORT=3000`.

---

## 📄 License

MIT © Hasan Riyad - Riyad Bot Framework
