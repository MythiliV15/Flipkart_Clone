# Flipkart Clone - Full Stack E-Commerce Application

A premium, full-stack e-commerce application inspired by Flipkart, built with Spring Boot and React.

## 🚀 Deployed Links
- **Frontend (Vercel):** [Live Demo](https://flipkart-clone-9ipw.vercel.app)
- **Backend (Render):** [API Endpoint](https://flipkart-clone-x62y.onrender.com)
- **SonarQube Analysis:** [Analysis Report](your-sonarqube-link-here)

## 🛠️ Technology Stack
- **Frontend:** React (CRA), Redux Toolkit, Tailwind CSS, Stripe (Payments)
- **Backend:** Spring Boot 3.4.x, Java 21, Spring Security (JWT), Spring Data JPA
- **Database:** Aiven Cloud MySQL
- **Infrastructure:** Docker, GitHub Actions (CI/CD)

## 🏗️ Deployment Guide

### 1. Database (Aiven Cloud MySQL)
The application is configured to connect to Aiven Cloud MySQL. Ensure your environment variables are set correctly in your hosting platform.

### 2. Backend (Deploy on Render)
The backend is Dockerized. When creating a Web Service on Render:
1. Select the `flipkart_backend` folder as the root (or use the Dockerfile path).
2. Set the following **Environment Variables**:
   - `DB_HOST`: (Your DB Host)
   - `DB_PORT`: (Your DB port)
   - `DB_NAME`: (your db name)
   - `DB_USER`: `avnadmin`
   - `DB_PASSWORD`: (Your db password)
   - `SSL_MODE`: `REQUIRED`
   - `JWT_SECRET`: (Your Secret Key)
   - `STRIPE_SECRET_KEY`: (Your Stripe Secret)

### 3. Frontend (Deploy on Vercel)
Vercel will automatically detect the React application in `flipkart-frontend`.
1. Link your GitHub repository.
2. Select `flipkart-frontend` as the root directory.
3. Add environment variables if needed (e.g., `REACT_APP_API_URL` pointing to your Render backend).

## 🤖 CI/CD with GitHub Actions
The project includes a GitHub Actions workflow in `.github/workflows/main.yml` that automatically builds and tests the application on every push to `main` or `master`.

## 📁 Project Structure
- `flipkart_backend/`: Spring Boot Maven project containing the REST API.
- `flipkart-frontend/`: React application containing the user interface.
- `.github/`: CI/CD workflow configurations.

## 📄 License
This project is licensed under the MIT License.
