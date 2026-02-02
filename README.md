# Banking System Frontend

A modern, responsive frontend for a Banking System built with React, TypeScript, and Tailwind CSS.

## ☁️ Deployment on Render (Fixing CORS)

Since the backend hosted on Render does not allow Cross-Origin (CORS) requests from other domains (including your frontend), you must configure a **Rewrite Rule** to proxy requests through your frontend's server.

### Option 1: Zero-Config Deployment (Recommended)

This project includes a `render.yaml` file that automatically configures the environment and rewrite rules.

1.  **Push your code** to GitHub.
2.  **Log in to Render** and go to "Blueprints".
3.  **Click "New Blueprint Instance"**.
4.  **Connect your repository** (`WideSu/banking_system_frontend`).
5.  **Click "Apply"**. Render will create the static site with all correct configurations.

### Option 2: Manual Configuration

If you prefer to set it up manually as a "Static Site":

1.  **Create New Static Site** on Render connected to your repo.
2.  **Build Command**: `npm install && npm run build`
3.  **Publish Directory**: `dist`
4.  **Environment Variables**:
    *   `VITE_API_URL` = `/api`
5.  **Redirects/Rewrites** (Crucial!):
    *   **Source**: `/api/*`
    *   **Destination**: `https://banking-system-backend-klt3.onrender.com/*`
    *   **Action**: `Rewrite`
    *   *(Add another rule for SPA routing)*:
    *   **Source**: `/*`
    *   **Destination**: `/index.html`
    *   **Action**: `Rewrite`

## 🚀 Features

*   **User Authentication**: Simple login mechanism using account names.
*   **Account Dashboard**: Real-time view of account balance and status.
*   **Transactions**: Deposit, Withdrawal, and Transfer capabilities.
*   **Responsive Design**: Optimized for all devices.

## 🛠️ Tech Stack

*   **Framework**: React (v18) + Vite
*   **Styling**: Tailwind CSS
*   **State Management**: Zustand
*   **HTTP Client**: Axios

## 🏃‍♂️ Running Locally

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/WideSu/banking_system_frontend.git
    cd banking_system_frontend
    npm install
    ```

2.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
    The app will start at `http://localhost:5173` and proxy API requests to the remote backend automatically.

## 📄 License

MIT License.
