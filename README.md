
📊 Web Analytics Platform

This is a full-stack web analytics platform designed to track and analyze user interactions on your website.

---

🚀 Getting Started

Follow these steps to run the project locally.

---

🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

This will start the frontend on [http://localhost:3000](http://localhost:3000) (or another port if specified).

---

## 🛠️ Backend Setup

```bash
cd backend
npm install
npm run dev
```

This will start the backend on [http://localhost:8000](http://localhost:8000) (based on your `.env` config).
 🧾 Backend `.env` Example

Create a `.env` file in the `backend` directory with the following contents:

```env
PORT=8000
MONGODB_URI="Your Mongodb Url"
CORS_ORIGIN=5173
```

> **Note:** Change `CORS_ORIGIN` to match your frontend port (default is 5173 for Vite).

---

 🗃️ Seeding the Database

To populate the database with test data:

```bash
npm run seed
```

Make sure your MongoDB connection is active before running this command.

---

✅ Additional Notes

* Ensure MongoDB is running or accessible via the URI.
* Adjust ports and CORS settings based on your environment if needed.
