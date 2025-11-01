# Category Admin Management System

## Overview
Complete admin privilege system for managing categories with full CRUD operations (Create, Read, Update, Delete).

## Backend Implementation

### 1. Database Model
**File:** `backend/models/category.model.js`
- Category schema with fields: text, path, image, bgColor, isActive
- Timestamps for tracking creation and updates
- Unique path constraint to prevent duplicates

### 2. API Controller
**File:** `backend/controller/category.controller.js`

**Available Endpoints:**
- `GET /api/category/list` - Get all active categories (Public)
- `GET /api/category/:id` - Get single category by ID (Public)
- `POST /api/category/create` - Create new category (Admin only)
- `PUT /api/category/update/:id` - Update existing category (Admin only)
- `DELETE /api/category/delete/:id` - Delete category (Admin only)
- `PATCH /api/category/toggle/:id` - Toggle category active status (Admin only)

**Features:**
- Image upload to Cloudinary
- Automatic image deletion when updating/deleting
- Path uniqueness validation
- Active/Inactive status management

### 3. Routes
**File:** `backend/routes/category.routes.js`
- Public routes for fetching categories
- Protected routes with `authSeller` middleware for admin operations
- Multer middleware for image upload handling

### 4. Server Integration
**File:** `backend/index.js`
- Category routes registered at `/api/category`

## Frontend Implementation

### 1. Admin Category Management Page
**File:** `client/src/pages/seller/CategoryManagement.jsx`

**Features:**
- ✅ View all categories in a responsive grid
- ✅ Create new categories with image upload
- ✅ Edit existing categories
- ✅ Delete categories with confirmation
- ✅ Toggle category active/inactive status
- ✅ Beautiful modal for create/edit operations
- ✅ Loading states and error handling
- ✅ Toast notifications for all actions

**UI Components:**
- Grid layout showing category cards
- Each card displays: image, name, path, status badge
- Action buttons: Edit, Activate/Deactivate, Delete
- Modal form with fields: Category Name, Path, Background Color, Image

### 2. Category Display Component
**File:** `client/src/components/Category.jsx`
- Updated to fetch categories from backend API
- Loading spinner while fetching
- Empty state when no categories available
- Dynamic rendering based on database data

### 3. Navigation Integration
**File:** `client/src/pages/seller/SellerLayout.jsx`
- Added "Categories" link to seller sidebar
- Icon: box_icon
- Route: `/seller/categories`

### 4. Routing
**File:** `client/src/App.jsx`
- Added route: `/seller/categories` → `CategoryManagement` component
- Protected with `isSeller` check
- Fixed AppContext import casing issue

## How to Use

### For Admin/Seller:

1. **Login as Seller/Admin**
   - Navigate to `/seller` and login

2. **Access Category Management**
   - Click "Categories" in the sidebar
   - Or navigate to `/seller/categories`

3. **Create New Category**
   - Click "Add Category" button
   - Fill in:
     - Category Name (e.g., "Fresh Fruits")
     - Category Path (e.g., "Fruits")
     - Background Color (color picker)
     - Upload Image
   - Click "Create"

4. **Edit Category**
   - Click "Edit" button on any category card
   - Update fields as needed
   - Image is optional (keeps existing if not uploaded)
   - Click "Update"

5. **Delete Category**
   - Click "Delete" button
   - Confirm deletion in popup
   - Category and associated image will be permanently removed

6. **Toggle Status**
   - Click "Activate" or "Deactivate" button
   - Active categories appear on the website
   - Inactive categories are hidden from customers

### For Customers:
- Categories are automatically displayed on the home page
- Only active categories are visible
- Click any category to view products in that category

## API Authentication

All admin operations require authentication:
```javascript
headers: {
  Authorization: `Bearer ${sellerToken}`
}
```

Token is stored in localStorage as `sellerToken`

## Image Handling

- Images uploaded to Cloudinary
- Stored in `categories` folder
- Automatic cleanup on update/delete
- Supports: JPG, PNG, GIF, WebP

## Database Schema

```javascript
{
  text: String,        // Display name
  path: String,        // URL path (unique)
  image: String,       // Cloudinary URL
  bgColor: String,     // Hex color code
  isActive: Boolean,   // Visibility status
  createdAt: Date,     // Auto-generated
  updatedAt: Date      // Auto-generated
}
```

## Security Features

- ✅ Admin-only access with JWT authentication
- ✅ Input validation on backend
- ✅ Unique path constraint
- ✅ Secure image upload to Cloudinary
- ✅ Protected routes with middleware

## Responsive Design

- Mobile: 2 columns
- Tablet: 3-4 columns
- Desktop: 4-5 columns
- Large screens: 5-6 columns

## Error Handling

- Network errors caught and displayed
- Validation errors shown to user
- Loading states during operations
- Success/error toast notifications

## Future Enhancements

- Bulk category operations
- Category sorting/reordering
- Category analytics
- Product count per category
- Category search/filter
- Export/Import categories
