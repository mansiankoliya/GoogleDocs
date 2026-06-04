# AI Native Collaborative Document Editor

A lightweight, high-performance collaborative document editor modeled after Google Docs. Built with a modern full-stack JavaScript architecture, this application provides users with an intuitive rich text editing experience, document sharing capabilities, and the ability to seamlessly upload and parse markdown and text files.

## 🚀 Features

- **Document Management**: Create, rename, edit, and organize multiple documents.
- **Rich Text Editing**: Full formatting capabilities using React Quill (bold, italic, lists, headings, and more).
- **Auto-Saving**: Intelligent debounced saves to persist content continuously without manual action.
- **Document Sharing**: Share your owned documents with specific users for collaborative access.
- **File Uploads**: Drag and drop or select local `.txt` and `.md` files to automatically parse and convert them into fully editable cloud documents.
- **Clean UI**: Modern, responsive, and accessible interface built with TailwindCSS.

## 🛠 Tech Stack

- **Frontend**: React (Vite), TailwindCSS, React Router, React Quill, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas, Mongoose
- **Authentication**: JSON Web Tokens (JWT)

## ⚙️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local MongoDB instance

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the `server` directory and add the following variables:

```env
# server/.env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/googledocs
JWT_SECRET=your_super_secret_jwt_key
```

## 💻 Local Development

1. **Seed the Database** (Optional but recommended for testing):
   The application includes a script to seed initial users (`Mansi` and `Rahul`).
   ```bash
   cd server
   node seed.js
   ```

2. **Start the Backend Server**:
   ```bash
   cd server
   # Start with nodemon (if installed globally) or node:
   npm run dev
   ```

3. **Start the Frontend Client**:
   In a new terminal window:
   ```bash
   cd client
   npm run dev
   ```

4. **Open the App**:
   Navigate to `http://localhost:5173` in your browser. You can select one of the pre-seeded users to begin.

## 🌍 Deployment Instructions

### Backend (e.g., Render, Heroku)
1. Ensure your MongoDB Atlas network access allows IP addresses from your hosting provider (or allow `0.0.0.0/0`).
2. Add your `MONGODB_URI` and `JWT_SECRET` to the environment variables settings on your host.
3. Use the start command: `node index.js` within the `server` root.

### Frontend (e.g., Vercel, Netlify)
1. Change the base URL in `client/src/api/axios.js` to point to your deployed backend URL instead of `http://localhost:5000/api`.
2. Set the build command to `npm run build` and output directory to `dist`.
3. Deploy the `client` directory.

## 🔮 Future Improvements

- **Real-Time Collaboration**: Integrate WebSockets (Socket.io) or CRDTs (Yjs) to allow multiple users to edit the same document concurrently with live cursors.
- **Granular Permissions**: Differentiate between "Viewer", "Commenter", and "Editor" roles for shared documents.
- **Document Folders & Tags**: Add organizational tools for users with large collections of documents.
- **Exporting Options**: Allow users to download documents as PDF or Markdown formats.
