# Deployment Guide: CAT Agentic Engine

This project is built with **React (Vite)** and **Tailwind CSS**. It is ready for deployment on Vercel or Netlify.

## 1. Prerequisites
- **Node.js** (v18+)
- **Git** installed
- A **GitHub** account
- A **Vercel** account (recommended for easiest deployment)

## 2. Pushing to GitHub

1.  Initialize Git (if not already done):
    ```bash
    git init
    ```

2.  Add files:
    ```bash
    git add .
    ```

3.  Commit changes:
    ```bash
    git commit -m "Initial commit of CAT Agentic Engine"
    ```

4.  Create a new repository on GitHub.
5.  Link and push:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/cat-agentic-engine.git
    git branch -M main
    git push -u origin main
    ```

## 3. Deploying to Vercel

1.  Log in to [Vercel](https://vercel.com).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `cat-agentic-engine` repository.
4.  **Configure Project**:
    *   **Framework Preset**: Vite
    *   **Root Directory**: `frontend` (IMPORTANT: Since the React app is in the `frontend` folder, you must set this!)
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
5.  Click **Deploy**.

## 4. Updates
To update your deployment:
1.  Make changes locally.
2.  Run:
    ```bash
    git add .
    git commit -m "Update feature X"
    git push
    ```
3.  Vercel will automatically re-deploy.

## 5. Troubleshooting
- **Missing Dependencies**: Ensure `npm install` is run in the `frontend` directory.
- **Tailwind Styles Missing**: Ensure `postcss.config.js` and `tailwind.config.js` are present in `frontend`.
- **Images Not Loading**: Ensure images are in `frontend/public` or correctly imported.
