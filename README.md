# Banking System Frontend

A modern, responsive frontend for a Banking System built with React, TypeScript, and Tailwind CSS. This application allows users to manage their accounts, perform transactions (deposits, withdrawals, transfers), and view their financial dashboard.

## 🚀 Features

*   **User Authentication**: Simple login mechanism using account names (Password-less for demo purposes).
*   **Account Dashboard**: Real-time view of account balance and status.
*   **Transactions**:
    *   **Deposit**: Add funds to your account.
    *   **Withdrawal**: Withdraw funds (with balance validation).
    *   **Transfer**: Send money to other accounts.
*   **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.
*   **State Management**: Efficient global state management using Zustand.
*   **Form Handling**: Robust form validation using React Hook Form and Yup.

## 🛠️ Tech Stack

*   **Framework**: [React](https://reactjs.org/) (v18)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Routing**: [React Router](https://reactrouter.com/) (v6)
*   **Forms**: [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **HTTP Client**: [Axios](https://axios-http.com/)

## 📋 Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (v9 or higher)
*   Backend Service (The frontend expects a backend running at `http://localhost:8000`)

## 🛠️ Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/WideSu/banking_system_frontend.git
    cd banking_system_frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

## 🏃‍♂️ Running Locally

1.  **Start the development server**
    ```bash
    npm run dev
    ```

2.  **Open in Browser**
    The application will be available at `http://localhost:5173`.
    *Note: The frontend is configured to proxy `/api` requests to `http://localhost:8000` during development.*

## 🏗️ Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate a `dist` folder containing the compiled static assets.

## 🐳 Docker Deployment

The project includes a `Dockerfile` and `nginx.conf` for easy containerization.

1.  **Build the Docker image**
    ```bash
    docker build -t banking-frontend .
    ```

2.  **Run the container**
    ```bash
    docker run -p 8080:80 banking-frontend
    ```

    The app will be accessible at `http://localhost:8080`.

    > **Note on Docker Networking**: The Nginx configuration proxies `/api` requests to `http://host.docker.internal:8000`. Ensure your backend is reachable at this address from within the container.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
