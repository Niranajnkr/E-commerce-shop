# Render Deployment Guide

## Backend Deployment (Already Done ✅)

Your backend is already deployed at: **https://e-commerce-shop-tal7.onrender.com**

### Update Backend Environment Variables

Go to your backend service on Render dashboard and add these environment variables:

1. `NODE_ENV` = `production`
2. `PORT` = `5000`
3. `MONGO_URI` = `mongodb+srv://niranjan:2oNhCTamztsaPzEa@cluster0.ikcxhi8.mongodb.net/?appName=Cluster0`
4. `JWT_SECRET` = `8f3a9b2c7d1e6f4a5b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a`
5. `JWT_REFRESH_SECRET` = `2b7e151628aed2a6abf7158809cf4f3c762e7160f38b4da56a784d9045190cfe`
6. `RAZORPAY_KEY_ID` = `rzp_test_RYRg4JzB8LBUcB`
7. `RAZORPAY_KEY_SECRET` = `oX0lhvq7GYtiGfQEqbBzsweB`
8. `SELLER_EMAIL` = `admin@gmail.com`
9. `SELLER_PASSWORD` = `admin123`
10. `CLOUDINARY_CLOUD_NAME` = `dpuqnbikq`
11. `CLOUDINARY_API_KEY` = `475778881531154`
12. `CLOUDINARY_API_SECRET` = `vRS9Jg_OV86WifoujBAN4G_VYac`
13. `FRONTEND_URL` = (Add this after deploying frontend)

### Update Backend Start Command

In Render dashboard → Your backend service → Settings:
- **Start Command**: `npm start`

---

## Frontend Deployment (New)

### Option 1: Deploy via Render Dashboard (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +" → "Static Site"**
3. **Connect your repository**
4. **Configure the service:**
   - **Name**: `e-commerce-frontend` (or any name you prefer)
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **Add Environment Variable:**
   - **Key**: `VITE_BACKEND_URL`
   - **Value**: `https://e-commerce-shop-tal7.onrender.com`

6. **Click "Create Static Site"**

7. **After deployment, copy your frontend URL** (e.g., `https://your-app.onrender.com`)

8. **Update Backend:**
   - Go to backend service → Environment
   - Add `FRONTEND_URL` = `https://your-frontend-url.onrender.com`
   - Save and redeploy backend

---

### Option 2: Deploy Using render.yaml (Automated)

1. **Push your code to GitHub** (including the `render.yaml` file I created)

2. **Go to Render Dashboard**: https://dashboard.render.com/

3. **Click "New +" → "Blueprint"**

4. **Connect your repository**

5. **Render will automatically detect `render.yaml` and create both services**

6. **Manually add environment variables** for backend (as listed above)

7. **After frontend deploys, update backend's `FRONTEND_URL`**

---

## Important Notes

### ⚠️ Security Warning
- Your `.env` files contain sensitive credentials
- Make sure `.env` files are in `.gitignore` (already added)
- **Never commit `.env` files to GitHub**
- Use the `.env.example` files as templates

### 🔄 CORS Configuration
- Backend now accepts requests from:
  - `http://localhost:5173` (local development)
  - `https://e-commerce-shop-tal7.onrender.com` (backend URL)
  - Your frontend URL (via `FRONTEND_URL` env variable)

### 📝 After Deployment Checklist

1. ✅ Backend deployed and running
2. ⬜ Frontend deployed
3. ⬜ Backend `FRONTEND_URL` environment variable added
4. ⬜ Test login functionality
5. ⬜ Test product creation (admin)
6. ⬜ Test cart and checkout
7. ⬜ Test payment integration

---

## Troubleshooting

### Backend Issues
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB connection string is correct
- Check start command is `npm start`

### Frontend Issues
- Check build logs for errors
- Verify `VITE_BACKEND_URL` is set correctly
- Clear browser cache
- Check browser console for CORS errors

### CORS Errors
- Ensure backend `FRONTEND_URL` matches your frontend URL exactly
- Check backend logs for allowed origins
- Verify backend is running

---

## Local Development

To run locally after deployment:

1. **Backend:**
   ```bash
   cd backend
   # Create .env from .env.example and add your values
   npm install
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd client
   # Create .env with VITE_BACKEND_URL=http://localhost:5000
   npm install
   npm run dev
   ```

---

## Support

If you encounter issues:
1. Check Render logs
2. Verify environment variables
3. Check browser console
4. Verify API endpoints are accessible
