# Sikshapedia Admin Panel Guide

## 🔐 Accessing the Admin Panel

### Step 1: Create an Admin Account

1. **Register a new account** at `/register`
   - Email: `admin@sikshapedia.com`
   - Password: `admin123`
   - Name: `Admin User`

2. **Update your role to admin** using MongoDB:
   ```bash
   cd /app/backend
   python3 << EOF
   from motor.motor_asyncio import AsyncIOMotorClient
   import asyncio
   import os
   from dotenv import load_dotenv
   
   load_dotenv()
   
   async def make_admin():
       client = AsyncIOMotorClient(os.environ['MONGO_URL'])
       db = client[os.environ['DB_NAME']]
       
       result = await db.users.update_one(
           {"email": "admin@sikshapedia.com"},
           {"$set": {"role": "admin"}}
       )
       
       print(f"Updated {result.modified_count} user(s) to admin role")
       client.close()
   
   asyncio.run(make_admin())
   EOF
   ```

### Step 2: Access Admin Panel

Navigate to: **`/admin`**

## 📝 Adding a New College

### Quick Access
- Direct URL: `/admin/colleges/add`
- From Dashboard: Click "Add College" card

### Required Fields

#### Basic Information
- **College Name*** (auto-generates slug)
- **Established Year***
- **Type*** (Government/Private/Deemed)
- **Average Fees*** (per year in ₹)
- **Description***

#### Location
- **City***
- **State***  
- **Country*** (default: India)

#### Optional but Recommended

**Rankings:**
- NIRF Ranking
- India Today Ranking
- Outlook Ranking

**Facilities:**
- Add facilities one by one (Library, Hostel, Labs, etc.)

**Highlights:**
- Key selling points
- Rankings
- Notable alumni
- Achievements

**Accreditations:**
- NAAC, NBA, ABET, etc.

**Contact Information:**
- Phone
- Email
- Website
- Full Address

**Media:**
- Image URLs (use Unsplash or other image services)
- Video URLs (YouTube links)

**Courses:**
For each course, add:
- Course Name
- Degree Type (BTech, MTech, MBA, etc.)
- Duration (e.g., "4 years")
- Annual Fees
- Total Fees (optional)
- Seats
- Eligibility Criteria

## 🎓 Sample Course Data Format

```
Course Name: BTech Computer Science and Engineering
Degree Type: BTech
Duration: 4 years
Annual Fees: 200000
Total Fees: 800000
Seats: 120
Eligibility: JEE Advanced qualified with minimum rank
```

## 📊 Advanced Features (Coming in API)

To add these features, use the API directly:

### Placement Stats
```json
{
  "year": 2024,
  "highest_package": 20100000,
  "average_package": 2100000,
  "median_package": 1800000,
  "total_offers": 1450,
  "companies_participated": 450,
  "top_recruiters": ["Google", "Microsoft", "Amazon"]
}
```

### Faculty Information
```json
{
  "name": "Prof. John Doe",
  "designation": "Professor",
  "department": "Computer Science",
  "qualification": "PhD from IIT Delhi",
  "experience": 25,
  "specialization": "Machine Learning, AI"
}
```

### Cutoffs
```json
{
  "year": 2024,
  "exam_name": "JEE Advanced",
  "round": "Round 1",
  "category": "General",
  "opening_rank": 1,
  "closing_rank": 67
}
```

### Scholarships
```json
{
  "name": "Merit Scholarship",
  "amount": "₹50,000 per year",
  "eligibility": "Top 10% students",
  "description": "Based on academic performance"
}
```

## 🔧 API Endpoints for Advanced Data

Use these endpoints with admin authentication:

- **Add College**: `POST /api/colleges`
- **Update College**: `PUT /api/colleges/{id}` 
- **Delete College**: `DELETE /api/colleges/{id}`

## 📝 Tips for Best Results

1. **Use High-Quality Images**
   - Campus photos
   - Infrastructure images
   - Recommended size: 800x600px or larger

2. **Write Compelling Descriptions**
   - Highlight unique features
   - Mention rankings and achievements
   - Include admission statistics

3. **Keep Information Updated**
   - Update placement stats yearly
   - Refresh cutoff data
   - Update fees information

4. **Be Comprehensive**
   - Add all courses offered
   - List all facilities
   - Include complete contact details

## 🚀 Quick Start Guide

1. **Login** → `/login`
2. **Go to Admin Panel** → `/admin`
3. **Click "Add College"**
4. **Fill Required Fields** (marked with *)
5. **Add Courses** (at least one)
6. **Add Facilities & Highlights**
7. **Save College**

## 🎯 Example: Adding IIT Bombay

```
Name: Indian Institute of Technology Bombay
Slug: iit-bombay (auto-generated)
Established: 1958
Type: Government
NIRF Rank: 3
Average Fees: 210000
City: Mumbai
State: Maharashtra

Description: IIT Bombay is one of the premier engineering institutes...

Facilities: Library, Hostel, Sports Complex, Labs, Wi-Fi, Cafeteria

Highlights:
- NIRF Rank 3 in Engineering 2024
- QS World Ranking: 149
- 100% Placement Rate
- Highest Package: ₹2.01 Crore

Courses:
1. BTech Computer Science - ₹210,000/year - 120 seats
2. BTech Electrical - ₹210,000/year - 90 seats
3. MTech Computer Science - ₹150,000/year - 60 seats
```

## 📞 Support

For any issues or questions about the admin panel, contact the development team.

---

**Happy College Adding! 🎓**
