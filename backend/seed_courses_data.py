"""
Seed script for Comprehensive Indian Courses data
Run: DB_NAME=sikshapedia_db python seed_courses_data.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
import uuid

def generate_slug(name):
    return name.lower().replace(' ', '-').replace('.', '').replace('(', '').replace(')', '').replace('/', '-')

# Comprehensive Indian Courses Data
INDIAN_COURSES = [
    # ============= ENGINEERING & TECHNOLOGY =============
    # Undergraduate Engineering
    {"name": "B.Tech", "full_name": "Bachelor of Technology", "degree_type": "UG", "stream": "Engineering", "duration": "4 Years", "eligibility": "10+2 with PCM", "exams_accepted": ["JEE Main", "JEE Advanced", "State CETs"]},
    {"name": "B.E", "full_name": "Bachelor of Engineering", "degree_type": "UG", "stream": "Engineering", "duration": "4 Years", "eligibility": "10+2 with PCM", "exams_accepted": ["JEE Main", "State CETs"]},
    {"name": "B.Tech (Lateral Entry)", "full_name": "Bachelor of Technology (Lateral Entry)", "degree_type": "UG", "stream": "Engineering", "duration": "3 Years", "eligibility": "Diploma in Engineering", "exams_accepted": ["State Lateral Entry Exams"]},
    
    # Postgraduate Engineering
    {"name": "M.Tech", "full_name": "Master of Technology", "degree_type": "PG", "stream": "Engineering", "duration": "2 Years", "eligibility": "B.Tech/B.E", "exams_accepted": ["GATE"]},
    {"name": "M.E", "full_name": "Master of Engineering", "degree_type": "PG", "stream": "Engineering", "duration": "2 Years", "eligibility": "B.Tech/B.E", "exams_accepted": ["GATE"]},
    {"name": "M.S (Engineering)", "full_name": "Master of Science in Engineering", "degree_type": "PG", "stream": "Engineering", "duration": "2 Years", "eligibility": "B.Tech/B.E", "exams_accepted": ["GATE", "Institute Exams"]},
    
    # Diploma Engineering
    {"name": "Diploma in Engineering", "full_name": "Diploma in Engineering/Polytechnic", "degree_type": "Diploma", "stream": "Engineering", "duration": "3 Years", "eligibility": "10th Pass", "exams_accepted": ["State Polytechnic Exams"]},
    {"name": "Diploma in Computer Engineering", "full_name": "Diploma in Computer Engineering", "degree_type": "Diploma", "stream": "Engineering", "duration": "3 Years", "eligibility": "10th Pass", "exams_accepted": ["State Polytechnic Exams"]},
    {"name": "Diploma in Mechanical Engineering", "full_name": "Diploma in Mechanical Engineering", "degree_type": "Diploma", "stream": "Engineering", "duration": "3 Years", "eligibility": "10th Pass", "exams_accepted": ["State Polytechnic Exams"]},
    {"name": "Diploma in Electrical Engineering", "full_name": "Diploma in Electrical Engineering", "degree_type": "Diploma", "stream": "Engineering", "duration": "3 Years", "eligibility": "10th Pass", "exams_accepted": ["State Polytechnic Exams"]},
    {"name": "Diploma in Civil Engineering", "full_name": "Diploma in Civil Engineering", "degree_type": "Diploma", "stream": "Engineering", "duration": "3 Years", "eligibility": "10th Pass", "exams_accepted": ["State Polytechnic Exams"]},
    {"name": "Diploma in Electronics", "full_name": "Diploma in Electronics & Communication", "degree_type": "Diploma", "stream": "Engineering", "duration": "3 Years", "eligibility": "10th Pass", "exams_accepted": ["State Polytechnic Exams"]},
    
    # ============= MEDICAL & HEALTHCARE =============
    # MBBS & Medical UG
    {"name": "MBBS", "full_name": "Bachelor of Medicine and Bachelor of Surgery", "degree_type": "UG", "stream": "Medical", "duration": "5.5 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["NEET UG"]},
    {"name": "BDS", "full_name": "Bachelor of Dental Surgery", "degree_type": "UG", "stream": "Medical", "duration": "5 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["NEET UG"]},
    {"name": "BAMS", "full_name": "Bachelor of Ayurvedic Medicine and Surgery", "degree_type": "UG", "stream": "Medical", "duration": "5.5 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["NEET UG"]},
    {"name": "BHMS", "full_name": "Bachelor of Homeopathic Medicine and Surgery", "degree_type": "UG", "stream": "Medical", "duration": "5.5 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["NEET UG"]},
    {"name": "BUMS", "full_name": "Bachelor of Unani Medicine and Surgery", "degree_type": "UG", "stream": "Medical", "duration": "5.5 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["NEET UG"]},
    {"name": "BNYS", "full_name": "Bachelor of Naturopathy and Yogic Sciences", "degree_type": "UG", "stream": "Medical", "duration": "5.5 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["NEET UG"]},
    {"name": "BSMS", "full_name": "Bachelor of Siddha Medicine and Surgery", "degree_type": "UG", "stream": "Medical", "duration": "5.5 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["NEET UG"]},
    
    # Nursing & Allied Health
    {"name": "B.Sc Nursing", "full_name": "Bachelor of Science in Nursing", "degree_type": "UG", "stream": "Nursing", "duration": "4 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["NEET UG", "State Nursing Exams"]},
    {"name": "GNM", "full_name": "General Nursing and Midwifery", "degree_type": "Diploma", "stream": "Nursing", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["State Nursing Exams"]},
    {"name": "ANM", "full_name": "Auxiliary Nursing and Midwifery", "degree_type": "Diploma", "stream": "Nursing", "duration": "2 Years", "eligibility": "10th Pass", "exams_accepted": ["State Nursing Exams"]},
    {"name": "M.Sc Nursing", "full_name": "Master of Science in Nursing", "degree_type": "PG", "stream": "Nursing", "duration": "2 Years", "eligibility": "B.Sc Nursing", "exams_accepted": ["Institute Exams"]},
    {"name": "Post Basic B.Sc Nursing", "full_name": "Post Basic B.Sc Nursing", "degree_type": "UG", "stream": "Nursing", "duration": "2 Years", "eligibility": "GNM", "exams_accepted": ["State Nursing Exams"]},
    
    # Paramedical
    {"name": "BPT", "full_name": "Bachelor of Physiotherapy", "degree_type": "UG", "stream": "Paramedical", "duration": "4.5 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["State Entrance Exams"]},
    {"name": "BOT", "full_name": "Bachelor of Occupational Therapy", "degree_type": "UG", "stream": "Paramedical", "duration": "4.5 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["State Entrance Exams"]},
    {"name": "BASLP", "full_name": "Bachelor in Audiology and Speech Language Pathology", "degree_type": "UG", "stream": "Paramedical", "duration": "4 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["Institute Exams"]},
    {"name": "B.Sc MLT", "full_name": "Bachelor of Science in Medical Lab Technology", "degree_type": "UG", "stream": "Paramedical", "duration": "3 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["Institute Exams"]},
    {"name": "B.Sc Radiology", "full_name": "Bachelor of Science in Radiology/Medical Imaging", "degree_type": "UG", "stream": "Paramedical", "duration": "3 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["Institute Exams"]},
    {"name": "B.Sc Optometry", "full_name": "Bachelor of Science in Optometry", "degree_type": "UG", "stream": "Paramedical", "duration": "4 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["Institute Exams"]},
    {"name": "DMLT", "full_name": "Diploma in Medical Lab Technology", "degree_type": "Diploma", "stream": "Paramedical", "duration": "2 Years", "eligibility": "10+2 with Science", "exams_accepted": ["Institute Exams"]},
    {"name": "MPT", "full_name": "Master of Physiotherapy", "degree_type": "PG", "stream": "Paramedical", "duration": "2 Years", "eligibility": "BPT", "exams_accepted": ["Institute Exams"]},
    
    # Medical PG
    {"name": "MD", "full_name": "Doctor of Medicine", "degree_type": "PG", "stream": "Medical", "duration": "3 Years", "eligibility": "MBBS", "exams_accepted": ["NEET PG"]},
    {"name": "MS", "full_name": "Master of Surgery", "degree_type": "PG", "stream": "Medical", "duration": "3 Years", "eligibility": "MBBS", "exams_accepted": ["NEET PG"]},
    {"name": "MDS", "full_name": "Master of Dental Surgery", "degree_type": "PG", "stream": "Medical", "duration": "3 Years", "eligibility": "BDS", "exams_accepted": ["NEET MDS"]},
    {"name": "DM", "full_name": "Doctorate of Medicine (Super Specialty)", "degree_type": "Super Specialty", "stream": "Medical", "duration": "3 Years", "eligibility": "MD/MS", "exams_accepted": ["NEET SS"]},
    {"name": "MCh", "full_name": "Master of Chirurgiae (Super Specialty)", "degree_type": "Super Specialty", "stream": "Medical", "duration": "3 Years", "eligibility": "MS", "exams_accepted": ["NEET SS"]},
    
    # ============= PHARMACY =============
    {"name": "B.Pharm", "full_name": "Bachelor of Pharmacy", "degree_type": "UG", "stream": "Pharmacy", "duration": "4 Years", "eligibility": "10+2 with PCM/PCB", "exams_accepted": ["GPAT", "State Pharmacy Exams"]},
    {"name": "D.Pharm", "full_name": "Diploma in Pharmacy", "degree_type": "Diploma", "stream": "Pharmacy", "duration": "2 Years", "eligibility": "10+2 with PCM/PCB", "exams_accepted": ["State Pharmacy Exams"]},
    {"name": "M.Pharm", "full_name": "Master of Pharmacy", "degree_type": "PG", "stream": "Pharmacy", "duration": "2 Years", "eligibility": "B.Pharm", "exams_accepted": ["GPAT"]},
    {"name": "Pharm.D", "full_name": "Doctor of Pharmacy", "degree_type": "UG", "stream": "Pharmacy", "duration": "6 Years", "eligibility": "10+2 with PCM/PCB", "exams_accepted": ["State Pharmacy Exams"]},
    
    # ============= MANAGEMENT =============
    # MBA & PGDM
    {"name": "MBA", "full_name": "Master of Business Administration", "degree_type": "PG", "stream": "Management", "duration": "2 Years", "eligibility": "Graduation", "exams_accepted": ["CAT", "XAT", "SNAP", "MAT", "CMAT", "GMAT"]},
    {"name": "PGDM", "full_name": "Post Graduate Diploma in Management", "degree_type": "PG Diploma", "stream": "Management", "duration": "2 Years", "eligibility": "Graduation", "exams_accepted": ["CAT", "XAT", "SNAP", "MAT", "CMAT"]},
    {"name": "Executive MBA", "full_name": "Executive Master of Business Administration", "degree_type": "PG", "stream": "Management", "duration": "1-2 Years", "eligibility": "Graduation + Work Experience", "exams_accepted": ["GMAT", "Institute Exams"]},
    {"name": "BBA", "full_name": "Bachelor of Business Administration", "degree_type": "UG", "stream": "Management", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["IPMAT", "SET", "NPAT", "DU JAT"]},
    {"name": "BMS", "full_name": "Bachelor of Management Studies", "degree_type": "UG", "stream": "Management", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["DU JAT", "SET"]},
    {"name": "BBM", "full_name": "Bachelor of Business Management", "degree_type": "UG", "stream": "Management", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["State Entrance Exams"]},
    {"name": "MBA (Part-Time)", "full_name": "Part-Time MBA", "degree_type": "PG", "stream": "Management", "duration": "3 Years", "eligibility": "Graduation + Work Experience", "exams_accepted": ["CAT", "Institute Exams"]},
    
    # ============= COMMERCE & ACCOUNTING =============
    {"name": "B.Com", "full_name": "Bachelor of Commerce", "degree_type": "UG", "stream": "Commerce", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "DU JAT"]},
    {"name": "B.Com (Hons)", "full_name": "Bachelor of Commerce (Honours)", "degree_type": "UG", "stream": "Commerce", "duration": "3 Years", "eligibility": "10+2 with Commerce", "exams_accepted": ["CUET", "DU JAT"]},
    {"name": "M.Com", "full_name": "Master of Commerce", "degree_type": "PG", "stream": "Commerce", "duration": "2 Years", "eligibility": "B.Com", "exams_accepted": ["CUET PG", "University Exams"]},
    {"name": "CA", "full_name": "Chartered Accountancy", "degree_type": "Professional", "stream": "Commerce", "duration": "3-5 Years", "eligibility": "10+2/Graduation", "exams_accepted": ["CA Foundation", "CA Intermediate", "CA Final"]},
    {"name": "CS", "full_name": "Company Secretary", "degree_type": "Professional", "stream": "Commerce", "duration": "3-4 Years", "eligibility": "10+2/Graduation", "exams_accepted": ["CS Foundation", "CS Executive", "CS Professional"]},
    {"name": "CMA", "full_name": "Cost and Management Accountant", "degree_type": "Professional", "stream": "Commerce", "duration": "3-4 Years", "eligibility": "10+2/Graduation", "exams_accepted": ["CMA Foundation", "CMA Intermediate", "CMA Final"]},
    {"name": "ACCA", "full_name": "Association of Chartered Certified Accountants", "degree_type": "Professional", "stream": "Commerce", "duration": "2-3 Years", "eligibility": "Graduation", "exams_accepted": ["ACCA Exams"]},
    
    # ============= LAW =============
    {"name": "BA LLB", "full_name": "Bachelor of Arts + Bachelor of Laws (Integrated)", "degree_type": "UG", "stream": "Law", "duration": "5 Years", "eligibility": "10+2", "exams_accepted": ["CLAT", "AILET", "LSAT", "State Law CETs"]},
    {"name": "BBA LLB", "full_name": "Bachelor of Business Administration + Bachelor of Laws", "degree_type": "UG", "stream": "Law", "duration": "5 Years", "eligibility": "10+2", "exams_accepted": ["CLAT", "AILET", "LSAT"]},
    {"name": "B.Com LLB", "full_name": "Bachelor of Commerce + Bachelor of Laws", "degree_type": "UG", "stream": "Law", "duration": "5 Years", "eligibility": "10+2", "exams_accepted": ["CLAT", "AILET"]},
    {"name": "B.Sc LLB", "full_name": "Bachelor of Science + Bachelor of Laws", "degree_type": "UG", "stream": "Law", "duration": "5 Years", "eligibility": "10+2 with Science", "exams_accepted": ["CLAT", "AILET"]},
    {"name": "LLB", "full_name": "Bachelor of Laws", "degree_type": "UG", "stream": "Law", "duration": "3 Years", "eligibility": "Graduation", "exams_accepted": ["DU LLB", "State Law CETs"]},
    {"name": "LLM", "full_name": "Master of Laws", "degree_type": "PG", "stream": "Law", "duration": "1-2 Years", "eligibility": "LLB", "exams_accepted": ["CLAT PG", "AILET PG"]},
    {"name": "Ph.D in Law", "full_name": "Doctor of Philosophy in Law", "degree_type": "Doctorate", "stream": "Law", "duration": "3-5 Years", "eligibility": "LLM", "exams_accepted": ["University Entrance"]},
    
    # ============= ARTS & HUMANITIES =============
    {"name": "BA", "full_name": "Bachelor of Arts", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "BA (Hons)", "full_name": "Bachelor of Arts (Honours)", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "DU JAT"]},
    {"name": "MA", "full_name": "Master of Arts", "degree_type": "PG", "stream": "Arts", "duration": "2 Years", "eligibility": "BA", "exams_accepted": ["CUET PG", "University Exams"]},
    {"name": "BA Psychology", "full_name": "Bachelor of Arts in Psychology", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "MA Psychology", "full_name": "Master of Arts in Psychology", "degree_type": "PG", "stream": "Arts", "duration": "2 Years", "eligibility": "BA Psychology", "exams_accepted": ["CUET PG", "TISSNET"]},
    {"name": "BA Economics", "full_name": "Bachelor of Arts in Economics", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "DU JAT"]},
    {"name": "MA Economics", "full_name": "Master of Arts in Economics", "degree_type": "PG", "stream": "Arts", "duration": "2 Years", "eligibility": "BA Economics", "exams_accepted": ["DSE", "ISI", "JNU Entrance"]},
    {"name": "BA English", "full_name": "Bachelor of Arts in English", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "BA History", "full_name": "Bachelor of Arts in History", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "BA Political Science", "full_name": "Bachelor of Arts in Political Science", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "BA Sociology", "full_name": "Bachelor of Arts in Sociology", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "BA Philosophy", "full_name": "Bachelor of Arts in Philosophy", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "University Exams"]},
    
    # ============= SCIENCE =============
    {"name": "B.Sc", "full_name": "Bachelor of Science", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with Science", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc (Hons)", "full_name": "Bachelor of Science (Honours)", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with Science", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "M.Sc", "full_name": "Master of Science", "degree_type": "PG", "stream": "Science", "duration": "2 Years", "eligibility": "B.Sc", "exams_accepted": ["JAM", "CUET PG", "University Exams"]},
    {"name": "B.Sc Physics", "full_name": "Bachelor of Science in Physics", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with PCM", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc Chemistry", "full_name": "Bachelor of Science in Chemistry", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with PCM", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc Mathematics", "full_name": "Bachelor of Science in Mathematics", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with Mathematics", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc Biology", "full_name": "Bachelor of Science in Biology", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc Biotechnology", "full_name": "Bachelor of Science in Biotechnology", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with PCB/PCM", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc Microbiology", "full_name": "Bachelor of Science in Microbiology", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc Biochemistry", "full_name": "Bachelor of Science in Biochemistry", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc Zoology", "full_name": "Bachelor of Science in Zoology", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc Botany", "full_name": "Bachelor of Science in Botany", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc Statistics", "full_name": "Bachelor of Science in Statistics", "degree_type": "UG", "stream": "Science", "duration": "3 Years", "eligibility": "10+2 with Mathematics", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "Integrated M.Sc", "full_name": "Integrated Master of Science", "degree_type": "Integrated", "stream": "Science", "duration": "5 Years", "eligibility": "10+2 with Science", "exams_accepted": ["JAM", "IISc Entrance"]},
    
    # ============= COMPUTER SCIENCE & IT =============
    {"name": "BCA", "full_name": "Bachelor of Computer Applications", "degree_type": "UG", "stream": "Computer Science", "duration": "3 Years", "eligibility": "10+2 with Mathematics", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "MCA", "full_name": "Master of Computer Applications", "degree_type": "PG", "stream": "Computer Science", "duration": "2 Years", "eligibility": "BCA/B.Sc with Mathematics", "exams_accepted": ["NIMCET", "State MCA CETs"]},
    {"name": "B.Sc Computer Science", "full_name": "Bachelor of Science in Computer Science", "degree_type": "UG", "stream": "Computer Science", "duration": "3 Years", "eligibility": "10+2 with Mathematics", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc IT", "full_name": "Bachelor of Science in Information Technology", "degree_type": "UG", "stream": "Computer Science", "duration": "3 Years", "eligibility": "10+2 with Mathematics", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "M.Sc Computer Science", "full_name": "Master of Science in Computer Science", "degree_type": "PG", "stream": "Computer Science", "duration": "2 Years", "eligibility": "B.Sc CS/BCA", "exams_accepted": ["CUET PG", "University Exams"]},
    {"name": "B.Sc Data Science", "full_name": "Bachelor of Science in Data Science", "degree_type": "UG", "stream": "Computer Science", "duration": "3 Years", "eligibility": "10+2 with Mathematics", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "B.Sc Artificial Intelligence", "full_name": "Bachelor of Science in Artificial Intelligence", "degree_type": "UG", "stream": "Computer Science", "duration": "3 Years", "eligibility": "10+2 with Mathematics", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "PGDCA", "full_name": "Post Graduate Diploma in Computer Applications", "degree_type": "PG Diploma", "stream": "Computer Science", "duration": "1 Year", "eligibility": "Graduation", "exams_accepted": ["University Exams"]},
    
    # ============= ARCHITECTURE & DESIGN =============
    {"name": "B.Arch", "full_name": "Bachelor of Architecture", "degree_type": "UG", "stream": "Architecture", "duration": "5 Years", "eligibility": "10+2 with Mathematics", "exams_accepted": ["NATA", "JEE Main Paper 2"]},
    {"name": "M.Arch", "full_name": "Master of Architecture", "degree_type": "PG", "stream": "Architecture", "duration": "2 Years", "eligibility": "B.Arch", "exams_accepted": ["GATE"]},
    {"name": "B.Planning", "full_name": "Bachelor of Planning", "degree_type": "UG", "stream": "Architecture", "duration": "4 Years", "eligibility": "10+2 with Mathematics", "exams_accepted": ["JEE Main Paper 2"]},
    {"name": "M.Planning", "full_name": "Master of Planning", "degree_type": "PG", "stream": "Architecture", "duration": "2 Years", "eligibility": "B.Arch/B.Planning", "exams_accepted": ["GATE"]},
    {"name": "B.Des", "full_name": "Bachelor of Design", "degree_type": "UG", "stream": "Design", "duration": "4 Years", "eligibility": "10+2", "exams_accepted": ["UCEED", "NID DAT", "NIFT", "CEED"]},
    {"name": "M.Des", "full_name": "Master of Design", "degree_type": "PG", "stream": "Design", "duration": "2 Years", "eligibility": "B.Des/B.Arch", "exams_accepted": ["CEED", "NID DAT"]},
    {"name": "B.Des Fashion Design", "full_name": "Bachelor of Design in Fashion Design", "degree_type": "UG", "stream": "Design", "duration": "4 Years", "eligibility": "10+2", "exams_accepted": ["NIFT", "NID DAT"]},
    {"name": "B.Des Interior Design", "full_name": "Bachelor of Design in Interior Design", "degree_type": "UG", "stream": "Design", "duration": "4 Years", "eligibility": "10+2", "exams_accepted": ["UCEED", "NID DAT"]},
    {"name": "B.Des Product Design", "full_name": "Bachelor of Design in Product Design", "degree_type": "UG", "stream": "Design", "duration": "4 Years", "eligibility": "10+2", "exams_accepted": ["UCEED", "NID DAT", "CEED"]},
    {"name": "B.Des Communication Design", "full_name": "Bachelor of Design in Communication Design", "degree_type": "UG", "stream": "Design", "duration": "4 Years", "eligibility": "10+2", "exams_accepted": ["NID DAT", "NIFT"]},
    
    # ============= HOTEL MANAGEMENT & HOSPITALITY =============
    {"name": "BHMCT", "full_name": "Bachelor of Hotel Management and Catering Technology", "degree_type": "UG", "stream": "Hotel Management", "duration": "4 Years", "eligibility": "10+2", "exams_accepted": ["NCHMCT JEE", "State HM Exams"]},
    {"name": "BHM", "full_name": "Bachelor of Hotel Management", "degree_type": "UG", "stream": "Hotel Management", "duration": "4 Years", "eligibility": "10+2", "exams_accepted": ["NCHMCT JEE", "State HM Exams"]},
    {"name": "BTTM", "full_name": "Bachelor of Travel and Tourism Management", "degree_type": "UG", "stream": "Hotel Management", "duration": "4 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "BBA Hospitality", "full_name": "BBA in Hospitality and Tourism", "degree_type": "UG", "stream": "Hotel Management", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["University Exams"]},
    {"name": "MHMCT", "full_name": "Master of Hotel Management and Catering Technology", "degree_type": "PG", "stream": "Hotel Management", "duration": "2 Years", "eligibility": "BHMCT/BHM", "exams_accepted": ["University Exams"]},
    {"name": "Diploma in Hotel Management", "full_name": "Diploma in Hotel Management", "degree_type": "Diploma", "stream": "Hotel Management", "duration": "1-3 Years", "eligibility": "10+2/10th", "exams_accepted": ["Institute Exams"]},
    
    # ============= MEDIA & JOURNALISM =============
    {"name": "BJMC", "full_name": "Bachelor of Journalism and Mass Communication", "degree_type": "UG", "stream": "Media", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "IPU CET", "University Exams"]},
    {"name": "BMM", "full_name": "Bachelor of Mass Media", "degree_type": "UG", "stream": "Media", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["University Exams"]},
    {"name": "BA Journalism", "full_name": "Bachelor of Arts in Journalism", "degree_type": "UG", "stream": "Media", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "MJMC", "full_name": "Master of Journalism and Mass Communication", "degree_type": "PG", "stream": "Media", "duration": "2 Years", "eligibility": "BJMC/BA", "exams_accepted": ["CUET PG", "JMI Entrance", "University Exams"]},
    {"name": "PG Diploma in Journalism", "full_name": "Post Graduate Diploma in Journalism", "degree_type": "PG Diploma", "stream": "Media", "duration": "1 Year", "eligibility": "Graduation", "exams_accepted": ["University Exams"]},
    {"name": "B.Sc Film Making", "full_name": "Bachelor of Science in Film Making", "degree_type": "UG", "stream": "Media", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["FTII Entrance", "Institute Exams"]},
    {"name": "BA Film Studies", "full_name": "Bachelor of Arts in Film Studies", "degree_type": "UG", "stream": "Media", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["University Exams"]},
    
    # ============= EDUCATION =============
    {"name": "B.Ed", "full_name": "Bachelor of Education", "degree_type": "UG", "stream": "Education", "duration": "2 Years", "eligibility": "Graduation", "exams_accepted": ["State B.Ed Entrance", "CTET"]},
    {"name": "B.El.Ed", "full_name": "Bachelor of Elementary Education", "degree_type": "UG", "stream": "Education", "duration": "4 Years", "eligibility": "10+2", "exams_accepted": ["DU B.El.Ed Entrance"]},
    {"name": "M.Ed", "full_name": "Master of Education", "degree_type": "PG", "stream": "Education", "duration": "2 Years", "eligibility": "B.Ed", "exams_accepted": ["State M.Ed Entrance"]},
    {"name": "D.Ed", "full_name": "Diploma in Education", "degree_type": "Diploma", "stream": "Education", "duration": "2 Years", "eligibility": "10+2", "exams_accepted": ["State D.Ed Entrance"]},
    {"name": "D.El.Ed", "full_name": "Diploma in Elementary Education", "degree_type": "Diploma", "stream": "Education", "duration": "2 Years", "eligibility": "10+2", "exams_accepted": ["State D.El.Ed Entrance"]},
    {"name": "BPEd", "full_name": "Bachelor of Physical Education", "degree_type": "UG", "stream": "Education", "duration": "3-4 Years", "eligibility": "10+2", "exams_accepted": ["State BPEd Entrance"]},
    {"name": "MPEd", "full_name": "Master of Physical Education", "degree_type": "PG", "stream": "Education", "duration": "2 Years", "eligibility": "BPEd", "exams_accepted": ["State MPEd Entrance"]},
    
    # ============= AGRICULTURE =============
    {"name": "B.Sc Agriculture", "full_name": "Bachelor of Science in Agriculture", "degree_type": "UG", "stream": "Agriculture", "duration": "4 Years", "eligibility": "10+2 with PCB/PCM", "exams_accepted": ["ICAR AIEEA", "State Agriculture CETs"]},
    {"name": "B.Sc Horticulture", "full_name": "Bachelor of Science in Horticulture", "degree_type": "UG", "stream": "Agriculture", "duration": "4 Years", "eligibility": "10+2 with PCB/Agriculture", "exams_accepted": ["ICAR AIEEA", "State Entrance"]},
    {"name": "B.Sc Forestry", "full_name": "Bachelor of Science in Forestry", "degree_type": "UG", "stream": "Agriculture", "duration": "4 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["ICAR AIEEA", "State Entrance"]},
    {"name": "B.V.Sc", "full_name": "Bachelor of Veterinary Science", "degree_type": "UG", "stream": "Agriculture", "duration": "5 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["NEET UG", "State Veterinary Entrance"]},
    {"name": "B.F.Sc", "full_name": "Bachelor of Fisheries Science", "degree_type": "UG", "stream": "Agriculture", "duration": "4 Years", "eligibility": "10+2 with PCB", "exams_accepted": ["ICAR AIEEA", "State Entrance"]},
    {"name": "M.Sc Agriculture", "full_name": "Master of Science in Agriculture", "degree_type": "PG", "stream": "Agriculture", "duration": "2 Years", "eligibility": "B.Sc Agriculture", "exams_accepted": ["ICAR AIEEA PG"]},
    {"name": "M.V.Sc", "full_name": "Master of Veterinary Science", "degree_type": "PG", "stream": "Agriculture", "duration": "2 Years", "eligibility": "B.V.Sc", "exams_accepted": ["ICAR AIEEA PG"]},
    
    # ============= PERFORMING ARTS =============
    {"name": "BFA", "full_name": "Bachelor of Fine Arts", "degree_type": "UG", "stream": "Arts", "duration": "4 Years", "eligibility": "10+2", "exams_accepted": ["BHU UET", "University Entrance"]},
    {"name": "BPA", "full_name": "Bachelor of Performing Arts", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["University Exams"]},
    {"name": "BA Music", "full_name": "Bachelor of Arts in Music", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["University Exams"]},
    {"name": "BA Dance", "full_name": "Bachelor of Arts in Dance", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["University Exams"]},
    {"name": "BA Theatre", "full_name": "Bachelor of Arts in Theatre/Drama", "degree_type": "UG", "stream": "Arts", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["NSD Entrance", "University Exams"]},
    {"name": "MFA", "full_name": "Master of Fine Arts", "degree_type": "PG", "stream": "Arts", "duration": "2 Years", "eligibility": "BFA", "exams_accepted": ["University Exams"]},
    
    # ============= SOCIAL WORK =============
    {"name": "BSW", "full_name": "Bachelor of Social Work", "degree_type": "UG", "stream": "Social Work", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["CUET", "University Exams"]},
    {"name": "MSW", "full_name": "Master of Social Work", "degree_type": "PG", "stream": "Social Work", "duration": "2 Years", "eligibility": "BSW/Graduation", "exams_accepted": ["TISSNET", "University Exams"]},
    {"name": "MA Social Work", "full_name": "Master of Arts in Social Work", "degree_type": "PG", "stream": "Social Work", "duration": "2 Years", "eligibility": "Graduation", "exams_accepted": ["TISSNET", "University Exams"]},
    
    # ============= AVIATION =============
    {"name": "B.Sc Aviation", "full_name": "Bachelor of Science in Aviation", "degree_type": "UG", "stream": "Aviation", "duration": "3 Years", "eligibility": "10+2 with PCM", "exams_accepted": ["University Exams"]},
    {"name": "BBA Aviation Management", "full_name": "BBA in Aviation Management", "degree_type": "UG", "stream": "Aviation", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["University Exams"]},
    {"name": "CPL", "full_name": "Commercial Pilot License", "degree_type": "Professional", "stream": "Aviation", "duration": "18-24 Months", "eligibility": "10+2 with PCM", "exams_accepted": ["DGCA Exams"]},
    {"name": "AME", "full_name": "Aircraft Maintenance Engineering", "degree_type": "Professional", "stream": "Aviation", "duration": "3 Years", "eligibility": "10+2 with PCM", "exams_accepted": ["DGCA Exams"]},
    {"name": "Diploma in Airport Management", "full_name": "Diploma in Airport Management", "degree_type": "Diploma", "stream": "Aviation", "duration": "1 Year", "eligibility": "10+2", "exams_accepted": ["Institute Exams"]},
    
    # ============= EVENT MANAGEMENT =============
    {"name": "BBA Event Management", "full_name": "BBA in Event Management", "degree_type": "UG", "stream": "Management", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["University Exams"]},
    {"name": "MBA Event Management", "full_name": "MBA in Event Management", "degree_type": "PG", "stream": "Management", "duration": "2 Years", "eligibility": "Graduation", "exams_accepted": ["CAT", "MAT", "University Exams"]},
    {"name": "Diploma in Event Management", "full_name": "Diploma in Event Management", "degree_type": "Diploma", "stream": "Management", "duration": "1 Year", "eligibility": "10+2", "exams_accepted": ["Institute Exams"]},
    
    # ============= SPORTS =============
    {"name": "B.Sc Sports Science", "full_name": "Bachelor of Science in Sports Science", "degree_type": "UG", "stream": "Sports", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["University Exams"]},
    {"name": "BPES", "full_name": "Bachelor of Physical Education and Sports", "degree_type": "UG", "stream": "Sports", "duration": "3 Years", "eligibility": "10+2", "exams_accepted": ["State Entrance"]},
    {"name": "M.Sc Sports Science", "full_name": "Master of Science in Sports Science", "degree_type": "PG", "stream": "Sports", "duration": "2 Years", "eligibility": "B.Sc Sports Science", "exams_accepted": ["University Exams"]},
    {"name": "Diploma in Sports Management", "full_name": "Diploma in Sports Management", "degree_type": "Diploma", "stream": "Sports", "duration": "1 Year", "eligibility": "10+2", "exams_accepted": ["Institute Exams"]},
]


async def seed_courses():
    """Seed comprehensive Indian Courses data"""
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    db_name = os.getenv("DB_NAME", "sikshapedia_db")
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("📚 Seeding Comprehensive Indian Courses Data...")
    print(f"   Database: {db_name}")
    
    # Clear existing courses
    existing_count = await db.courses.count_documents({})
    if existing_count > 0:
        print(f"   Clearing {existing_count} existing courses...")
        await db.courses.delete_many({})
    
    # Insert courses
    courses_to_insert = []
    for course in INDIAN_COURSES:
        course_doc = {
            "id": str(uuid.uuid4()),
            "name": course["name"],
            "full_name": course.get("full_name", course["name"]),
            "slug": generate_slug(course["name"]),
            "degree_type": course.get("degree_type", "UG"),
            "stream": course.get("stream", "General"),
            "duration": course.get("duration", "3 Years"),
            "eligibility": course.get("eligibility", ""),
            "exams_accepted": course.get("exams_accepted", []),
            "selection_criteria": ", ".join(course.get("exams_accepted", [])),
            "is_popular": course.get("is_popular", False),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        courses_to_insert.append(course_doc)
    
    await db.courses.insert_many(courses_to_insert)
    
    # Print summary by stream
    print(f"\n✅ Successfully seeded {len(courses_to_insert)} Courses:")
    
    streams = {}
    degree_types = {}
    for course in INDIAN_COURSES:
        stream = course.get("stream", "General")
        dtype = course.get("degree_type", "UG")
        streams[stream] = streams.get(stream, 0) + 1
        degree_types[dtype] = degree_types.get(dtype, 0) + 1
    
    print("\n   📊 By Stream:")
    for stream, count in sorted(streams.items(), key=lambda x: -x[1]):
        print(f"      {stream}: {count}")
    
    print("\n   🎓 By Degree Type:")
    for dtype, count in sorted(degree_types.items(), key=lambda x: -x[1]):
        print(f"      {dtype}: {count}")
    
    client.close()
    print("\n🎉 Seeding complete!")


if __name__ == "__main__":
    asyncio.run(seed_courses())
