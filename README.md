# Sikshapedia - College & University Listing Portal

A comprehensive web platform for discovering, comparing, and connecting with colleges and universities across India.

## 🎓 Features

### For Students
- **Browse & Search**: Explore thousands of colleges with powerful search and filtering
- **Detailed Information**: View comprehensive college profiles including:
  - Courses offered with fees
  - Admission process and eligibility
  - Facilities and infrastructure
  - Rankings and accreditations
  - Contact information
- **Reviews & Ratings**: Read authentic student reviews and ratings
- **Compare Colleges**: Side-by-side comparison of colleges
- **Save Favorites**: Bookmark colleges for later review
- **Submit Inquiries**: Direct inquiry submission to colleges

### For Colleges (Admin)
- Add and manage college listings
- View and respond to student inquiries
- Manage course information

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: React 19
- **Routing**: React Router v7
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather)
- **HTTP Client**: Axios

## 📁 Project Structure

```
/app
├── backend/
│   ├── server.py          # Main FastAPI application
│   ├── seed_data.py       # Database seeding script
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js  # API configuration
│   │   ├── contexts/
│   │   │   └── AuthContext.js  # Authentication context
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── CollegeListingPage.js
│   │   │   ├── CollegeDetailPage.js
│   │   │   ├── LoginPage.js
│   │   │   └── RegisterPage.js
│   │   ├── components/
│   │   │   └── ui/        # Radix UI components
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB
- Yarn

### Installation

1. **Backend Setup**
```bash
cd /app/backend
pip install -r requirements.txt

# Seed the database with sample colleges
python seed_data.py
```

2. **Frontend Setup**
```bash
cd /app/frontend
yarn install
```

3. **Start Services**
```bash
# Using supervisor (recommended)
sudo supervisorctl restart all

# Or manually:
# Backend
cd /app/backend
uvicorn server:app --host 0.0.0.0 --port 8001

# Frontend
cd /app/frontend
yarn start
```

## 🔑 Environment Variables

### Backend (.env)
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="sikshapedia_db"
CORS_ORIGINS="*"
SECRET_KEY="your-secret-key-change-in-production"
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-domain.com
```

## 📊 Database Schema

### Collections

#### Users
- id, email, password_hash, name, role, saved_colleges[], created_at

#### Colleges
- id, name, slug, location{}, established_year, type, affiliation, ranking
- average_fees, total_courses, courses[], facilities[], contact_info{}
- images[], description, admission_process, accreditations[]
- rating, total_reviews, created_at

#### Reviews
- id, college_id, user_id, user_name, rating, review_text, helpful_count, created_at

#### Inquiries
- id, college_id, student_name, email, phone, course_interested, message, status, created_at

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Colleges
- `GET /api/colleges` - List all colleges (with filters)
- `GET /api/colleges/featured` - Get featured colleges
- `GET /api/colleges/:id` - Get college by ID
- `GET /api/colleges/slug/:slug` - Get college by slug
- `POST /api/colleges` - Create college (admin only)
- `PUT /api/colleges/:id` - Update college (admin only)
- `DELETE /api/colleges/:id` - Delete college (admin only)

### Reviews
- `POST /api/reviews` - Submit review (authenticated)
- `GET /api/reviews/college/:id` - Get college reviews

### Inquiries
- `POST /api/inquiries` - Submit inquiry
- `GET /api/inquiries/college/:id` - Get college inquiries (admin only)

### User Actions
- `POST /api/users/save-college/:id` - Save college to favorites
- `DELETE /api/users/save-college/:id` - Remove from favorites
- `GET /api/users/saved-colleges` - Get saved colleges

### Stats
- `GET /api/stats` - Get platform statistics

## 🎨 Key Features

### Search & Filter
- Text search (name, description)
- Filter by city, state, type (Government/Private/Deemed)
- Filter by course, fees range
- Sort by name, rating, fees, ranking

### College Detail Page
Comprehensive tabs:
- **Overview**: About, facilities, contact info, admission process
- **Courses & Fees**: Detailed course listing with fees
- **Reviews**: Student reviews and ratings
- **Apply/Inquire**: Inquiry submission form

### Authentication
- JWT-based secure authentication
- Protected routes for authenticated users
- Role-based access (student/admin)

## 🔐 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected API endpoints
- Input validation with Pydantic

## 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS for responsive layouts
- Works seamlessly on all devices

## 🧪 Sample Data
The database is pre-populated with 6 prestigious Indian institutions:
1. IIT Delhi - Engineering
2. BITS Pilani - Engineering & Management
3. AIIMS Delhi - Medical
4. IIM Ahmedabad - Management
5. Delhi University - Arts & Sciences
6. NIT Trichy - Engineering

## 🎓 User Roles
- **Student**: Browse colleges, submit reviews, save favorites, submit inquiries
- **Admin**: All student features + manage college listings, view inquiries

## 📈 Future Enhancements
- College comparison tool
- Application tracking system
- Scholarship information
- Virtual campus tours
- College events calendar
- Student forums
- Alumni network
- Predictive admission chances

## 🤝 Contributing
This is a portfolio project. Feel free to fork and customize!

## 📄 License
MIT License

## 👨‍💻 Developed By
Built with ❤️ for students seeking their perfect college

---

**Sikshapedia** - Your Gateway to Quality Education
