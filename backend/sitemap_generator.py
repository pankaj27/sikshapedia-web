"""
Generate sitemap.xml for SEO
"""
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import asyncio
import os

async def generate_sitemap():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client['college_portal']
    
    base_url = 'https://collegeportal-11.preview.emergentagent.com'
    
    sitemap_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''
    
    # Static pages
    static_pages = [
        ('/', '1.0', 'daily'),
        ('/colleges', '0.9', 'daily'),
        ('/exams', '0.9', 'daily'),
        ('/courses', '0.9', 'daily'),
        ('/study-abroad', '0.8', 'weekly'),
        ('/scholarships', '0.8', 'weekly'),
        ('/loans', '0.8', 'weekly'),
        ('/blog', '0.8', 'weekly'),
        ('/compare', '0.7', 'weekly'),
        ('/eligibility-checker', '0.7', 'weekly'),
        ('/about', '0.6', 'monthly'),
        ('/contact', '0.6', 'monthly'),
    ]
    
    for url, priority, changefreq in static_pages:
        sitemap_content += f'''  <url>
    <loc>{base_url}{url}</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>
'''
    
    # Dynamic college pages
    colleges = await db.colleges.find({}, {"_id": 0, "id": 1}).to_list(1000)
    for college in colleges[:100]:  # Limit to top 100 for now
        sitemap_content += f'''  <url>
    <loc>{base_url}/colleges/{college.get('id', '')}</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
'''
    
    # Dynamic exam pages
    exams = await db.exams.find({}, {"_id": 0, "id": 1}).to_list(100)
    for exam in exams[:50]:
        sitemap_content += f'''  <url>
    <loc>{base_url}/exams/{exam.get('id', '')}</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
'''
    
    # Dynamic course pages
    courses = await db.courses.find({}, {"_id": 0, "id": 1}).to_list(100)
    for course in courses[:50]:
        sitemap_content += f'''  <url>
    <loc>{base_url}/courses/{course.get('id', '')}</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
'''
    
    sitemap_content += '</urlset>'
    
    # Write sitemap to public folder
    with open('/app/frontend/public/sitemap.xml', 'w') as f:
        f.write(sitemap_content)
    
    print(f"✓ Sitemap generated with {len(colleges) + len(exams) + len(courses) + len(static_pages)} URLs")
    
    client.close()

if __name__ == '__main__':
    asyncio.run(generate_sitemap())
