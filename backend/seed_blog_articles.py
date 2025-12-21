import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ARTICLES_DATA = [
    {
        "id": "article_jee_preparation",
        "title": "Complete Guide to JEE Main 2025 Preparation",
        "slug": "jee-main-2025-preparation-guide",
        "excerpt": "Comprehensive preparation strategy for JEE Main 2025 including study plans, important topics, and expert tips.",
        "content": """# Complete Guide to JEE Main 2025 Preparation

JEE Main is one of the most challenging entrance exams in India. Here's a comprehensive guide to help you prepare effectively.

## Study Plan
- Start early (at least 1 year before exam)
- Focus on NCERT textbooks first
- Practice previous year papers
- Take regular mock tests

## Important Topics
### Physics
- Mechanics, Thermodynamics, Modern Physics

### Chemistry  
- Organic Chemistry, Physical Chemistry, Inorganic Chemistry

### Mathematics
- Calculus, Algebra, Coordinate Geometry

## Time Management
Allocate equal time to all three subjects and maintain consistency in your preparation.

## Mock Tests
Take at least 50 mock tests before the actual exam to build speed and accuracy.""",
        "author_id": "admin",
        "author_name": "admissionbuddy Team",
        "category": "Exams",
        "tags": ["JEE Main", "Engineering", "Preparation", "Study Tips"],
        "views": 1250,
        "likes": 89,
        "published": True
    },
    {
        "id": "article_college_choice",
        "title": "How to Choose the Right College: A Complete Guide",
        "slug": "how-to-choose-right-college",
        "excerpt": "Learn the key factors to consider when selecting a college including placements, faculty, infrastructure, and location.",
        "content": """# How to Choose the Right College

Choosing the right college is a crucial decision that impacts your career. Here are the key factors to consider:

## 1. Accreditation & Recognition
Check if the college is accredited by UGC, AICTE, or NBA.

## 2. Placement Records
- Average package
- Top recruiters
- Placement percentage
- Industry connections

## 3. Faculty Quality
Research the qualifications and experience of faculty members.

## 4. Infrastructure
- Labs and equipment
- Library facilities
- Hostel accommodation
- Sports facilities

## 5. Location
Consider the city's opportunities for internships and job prospects.

## 6. Fee Structure
Ensure the fees align with your budget and check for scholarships.

## 7. Alumni Network
A strong alumni network can open doors to career opportunities.""",
        "author_id": "admin",
        "author_name": "admissionbuddy Team",
        "category": "Admissions",
        "tags": ["College Selection", "Admissions", "Career Planning"],
        "views": 2100,
        "likes": 156,
        "published": True
    },
    {
        "id": "article_study_abroad",
        "title": "Top 5 Countries for Indian Students to Study Abroad",
        "slug": "top-countries-study-abroad-indian-students",
        "excerpt": "Explore the best countries for higher education including USA, UK, Canada, Australia, and Germany.",
        "content": """# Top 5 Countries for Indian Students

Studying abroad opens doors to world-class education and global career opportunities.

## 1. United States
- Top universities: MIT, Stanford, Harvard
- Diverse programs and research opportunities
- Strong job market with OPT/CPT programs

## 2. United Kingdom
- Prestigious institutions: Oxford, Cambridge
- Shorter course duration (1-year Masters)
- Post-study work visa available

## 3. Canada
- Affordable tuition and living costs
- Immigration-friendly policies
- High quality of life

## 4. Australia
- Excellent universities
- Pleasant climate
- Work opportunities during and after studies

## 5. Germany
- Low or no tuition fees at public universities
- Strong engineering programs
- Growing job market

## Application Process
Start preparing 12-18 months before intended start date.""",
        "author_id": "admin",
        "author_name": "admissionbuddy Team",
        "category": "Study Abroad",
        "tags": ["Study Abroad", "International Education", "USA", "UK", "Canada"],
        "views": 3200,
        "likes": 245,
        "published": True
    },
    {
        "id": "article_scholarships_guide",
        "title": "Ultimate Guide to Scholarships in India 2025",
        "slug": "scholarships-india-2025-guide",
        "excerpt": "Everything you need to know about merit-based and need-based scholarships available for Indian students.",
        "content": """# Ultimate Guide to Scholarships in India

Scholarships can significantly reduce your financial burden. Here's everything you need to know.

## Types of Scholarships

### Merit-Based
For students with excellent academic performance.

### Need-Based
For students from economically weaker sections.

### Sports Scholarships
For students with exceptional sports achievements.

## Top Scholarship Programs

1. **National Scholarship Portal (NSP)**
   - Central government schemes
   - State government schemes

2. **Minority Scholarships**
   - Pre-matric and post-matric

3. **SC/ST Scholarships**
   - Various schemes for reserved categories

4. **Private Scholarships**
   - Corporate-funded programs
   - University-specific scholarships

## Application Tips
- Apply early
- Keep documents ready
- Write compelling essays
- Meet all deadlines

## Required Documents
- Academic marksheets
- Income certificate
- Caste certificate (if applicable)
- Bank details""",
        "author_id": "admin",
        "author_name": "admissionbuddy Team",
        "category": "Financial Aid",
        "tags": ["Scholarships", "Financial Aid", "NSP", "Education Funding"],
        "views": 1800,
        "likes": 132,
        "published": True
    },
    {
        "id": "article_career_after_12th",
        "title": "Career Options After 12th: Beyond Engineering and Medicine",
        "slug": "career-options-after-12th",
        "excerpt": "Explore diverse career paths including design, law, humanities, commerce, and emerging fields.",
        "content": """# Career Options After 12th

While engineering and medicine are popular, there are many other rewarding career paths.

## Creative Fields

### Design
- Fashion Design
- Graphic Design
- Interior Design
- Product Design

### Media & Entertainment
- Journalism
- Film Making
- Animation
- Digital Marketing

## Professional Courses

### Law
- 5-year integrated LLB programs
- Career in litigation or corporate law

### Commerce
- CA, CS, CMA
- Banking and finance careers

## Emerging Fields

### Data Science
High demand with excellent salaries.

### Digital Marketing
Growing field with creative opportunities.

### Entrepreneurship
Start your own venture with proper planning.

### Hotel Management
Opportunities in hospitality industry.

## How to Choose
- Assess your interests and strengths
- Research career prospects
- Consider long-term goals
- Take career counseling""",
        "author_id": "admin",
        "author_name": "admissionbuddy Team",
        "category": "Career",
        "tags": ["Career Planning", "12th Class", "Career Options", "Future"],
        "views": 2800,
        "likes": 198,
        "published": True
    }
]

async def seed_articles():
    print("Seeding blog articles...")
    
    await db.articles.delete_many({})
    
    for article in ARTICLES_DATA:
        await db.articles.insert_one(article)
        print(f"✓ Inserted article: {article['title']}")
    
    print(f"\n✅ {len(ARTICLES_DATA)} articles seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_articles())
