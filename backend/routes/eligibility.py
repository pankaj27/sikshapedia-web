"""
Eligibility Checker / College Predictor API Routes
Provides endpoints to fetch exams and predict colleges based on exam scores
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
import os
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix="/eligibility", tags=["Eligibility"])

# Database connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'sikshapedia_db')
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


class PredictRequest(BaseModel):
    exam_id: str
    score: float  # Can be rank, marks, or percentile
    score_type: str  # 'rank', 'marks', 'percentile'
    category: str = 'General'  # General, OBC, SC, ST, EWS
    home_state: Optional[str] = None
    preferred_states: Optional[List[str]] = None


class ExamResponse(BaseModel):
    id: str
    name: str
    full_name: Optional[str] = None
    type: str  # Engineering, Medical, Management, Law, etc.
    level: str  # National, State-level
    conducting_body: Optional[str] = None
    exam_date: Optional[str] = None
    application_start_date: Optional[str] = None
    application_end_date: Optional[str] = None
    total_colleges: int = 0
    input_type: str = 'rank'  # rank, marks, percentile
    max_value: int = 100000
    icon: str = '🎓'


# Exam configuration for input types and max values
EXAM_CONFIG = {
    'JEE Main': {'input_type': 'rank', 'max_value': 250000, 'icon': '🎓'},
    'JEE Advanced': {'input_type': 'rank', 'max_value': 20000, 'icon': '🎓'},
    'NEET': {'input_type': 'marks', 'max_value': 720, 'icon': '⚕️'},
    'NEET UG': {'input_type': 'marks', 'max_value': 720, 'icon': '⚕️'},
    'CAT': {'input_type': 'percentile', 'max_value': 100, 'icon': '💼'},
    'CUET': {'input_type': 'marks', 'max_value': 800, 'icon': '🏛️'},
    'CUET UG': {'input_type': 'marks', 'max_value': 800, 'icon': '🏛️'},
    'GATE': {'input_type': 'marks', 'max_value': 100, 'icon': '🎓'},
    'CLAT': {'input_type': 'marks', 'max_value': 150, 'icon': '⚖️'},
    'MHT CET': {'input_type': 'percentile', 'max_value': 100, 'icon': '🎓'},
    'BITSAT': {'input_type': 'marks', 'max_value': 450, 'icon': '🎓'},
    'VITEEE': {'input_type': 'rank', 'max_value': 50000, 'icon': '🎓'},
    'NMAT': {'input_type': 'marks', 'max_value': 360, 'icon': '💼'},
    'WBJEE': {'input_type': 'rank', 'max_value': 100000, 'icon': '🎓'},
    'KCET': {'input_type': 'rank', 'max_value': 200000, 'icon': '🎓'},
    'AP EAMCET': {'input_type': 'rank', 'max_value': 200000, 'icon': '🎓'},
    'TS EAMCET': {'input_type': 'rank', 'max_value': 200000, 'icon': '🎓'},
    'COMEDK UGET': {'input_type': 'rank', 'max_value': 100000, 'icon': '🎓'},
    'SRMJEEE': {'input_type': 'rank', 'max_value': 50000, 'icon': '🎓'},
    'MET (Manipal)': {'input_type': 'rank', 'max_value': 50000, 'icon': '🎓'},
    'XAT': {'input_type': 'percentile', 'max_value': 100, 'icon': '💼'},
    'MAT': {'input_type': 'percentile', 'max_value': 100, 'icon': '💼'},
    'SNAP': {'input_type': 'percentile', 'max_value': 100, 'icon': '💼'},
    'CMAT': {'input_type': 'percentile', 'max_value': 100, 'icon': '💼'},
    'AILET': {'input_type': 'marks', 'max_value': 150, 'icon': '⚖️'},
    'LSAT India': {'input_type': 'percentile', 'max_value': 100, 'icon': '⚖️'},
}

# Icon mapping by exam type
TYPE_ICONS = {
    'Engineering': '🎓',
    'Medical': '⚕️',
    'Management': '💼',
    'Law': '⚖️',
    'University': '🏛️',
    'Design': '🎨',
    'Architecture': '🏗️',
    'Pharmacy': '💊',
    'Agriculture': '🌾',
    'Hotel Management': '🏨',
    'Defence': '🎖️',
    'Teaching': '📚',
}


@router.get("/exams")
async def get_eligibility_exams(
    type: Optional[str] = Query(None, description="Filter by exam type"),
    level: Optional[str] = Query(None, description="Filter by level (National, State)"),
    featured: Optional[bool] = Query(None, description="Get only featured exams"),
    limit: int = Query(50, description="Number of exams to return")
):
    """
    Get list of exams for college predictor.
    Returns exams with their input types (rank/marks/percentile) and configuration.
    """
    try:
        # Build query - don't require is_active as field may not exist
        query = {}
        if type:
            query['type'] = {'$regex': type, '$options': 'i'}
        if level:
            query['level'] = {'$regex': level, '$options': 'i'}
        if featured is not None:
            query['is_featured'] = featured
        
        # Fetch exams from database
        exams_cursor = db.exams.find(query, {'_id': 0}).sort([
            ('is_featured', -1),
            ('display_priority', -1),
            ('name', 1)
        ]).limit(limit)
        
        exams = await exams_cursor.to_list(length=limit)
        
        # Count colleges accepting each exam
        result = []
        for exam in exams:
            exam_name = exam.get('name', '')
            
            # Get config for this exam
            config = EXAM_CONFIG.get(exam_name, {
                'input_type': 'rank',
                'max_value': 100000,
                'icon': TYPE_ICONS.get(exam.get('type', ''), '🎓')
            })
            
            # Count institutions accepting this exam
            college_count = await db.institutions.count_documents({
                'exams_accepted': {'$regex': exam_name, '$options': 'i'}
            })
            
            # If no institutions, check colleges collection
            if college_count == 0:
                college_count = await db.colleges.count_documents({
                    'exams_accepted': {'$regex': exam_name, '$options': 'i'}
                })
            
            # Build response
            result.append({
                'id': exam.get('id', ''),
                'name': exam_name,
                'full_name': exam.get('full_name') or exam_name,
                'type': exam.get('type', 'General'),
                'level': exam.get('level', 'National'),
                'conducting_body': exam.get('conducting_body'),
                'exam_date': exam.get('exam_date'),
                'application_start_date': exam.get('application_start_date'),
                'application_end_date': exam.get('application_end_date'),
                'total_colleges': college_count,
                'input_type': config.get('input_type', 'rank'),
                'max_value': config.get('max_value', 100000),
                'icon': config.get('icon', '🎓'),
                'is_featured': exam.get('is_featured', False),
                'streams': exam.get('streams', []),
                'links': {
                    'exam_info': f"/exams/{exam.get('slug') or exam_name.lower().replace(' ', '-')}",
                    'cutoff': f"/exams/{exam.get('slug') or exam_name.lower().replace(' ', '-')}/cutoff",
                    'practice': f"/exams/{exam.get('slug') or exam_name.lower().replace(' ', '-')}/practice"
                }
            })
        
        return result
        
    except Exception as e:
        print(f"Error fetching eligibility exams: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/exam-types")
async def get_exam_types():
    """Get distinct exam types for filtering"""
    try:
        types = await db.exams.distinct('type')
        # Filter out None and empty values
        types = [t for t in types if t]
        return sorted(types)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/exam-levels")
async def get_exam_levels():
    """Get distinct exam levels for filtering"""
    try:
        levels = await db.exams.distinct('level')
        # Filter out None and empty values
        levels = [l for l in levels if l]
        return sorted(levels)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict")
async def predict_colleges(request: PredictRequest):
    """
    Predict colleges based on exam score.
    Uses cutoff data and college acceptance criteria.
    """
    try:
        # Get the exam details
        exam = await db.exams.find_one({'id': request.exam_id}, {'_id': 0})
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        exam_name = exam.get('name', '')
        exam_type = exam.get('type', 'Engineering')
        
        # Build query for colleges accepting this exam
        college_query = {
            '$or': [
                {'exams_accepted': {'$regex': exam_name, '$options': 'i'}},
                {'exams_accepted': {'$elemMatch': {'$regex': exam_name, '$options': 'i'}}}
            ]
        }
        
        # Add state filter if provided
        if request.preferred_states:
            college_query['state'] = {'$in': request.preferred_states}
        
        # Fetch colleges from institutions collection
        colleges = await db.institutions.find(
            college_query,
            {'_id': 0}
        ).sort([('rating', -1), ('ranking', 1)]).limit(100).to_list(100)
        
        # If no colleges found, try colleges collection
        if not colleges:
            colleges = await db.colleges.find(
                college_query,
                {'_id': 0}
            ).sort([('rating', -1), ('ranking', 1)]).limit(100).to_list(100)
        
        # If still no colleges, generate mock predictions
        if not colleges:
            colleges = generate_mock_predictions(exam, request)
        else:
            # Filter and rank colleges based on score
            colleges = filter_colleges_by_score(colleges, request, exam)
        
        # Calculate eligibility percentage
        config = EXAM_CONFIG.get(exam_name, {'input_type': 'rank', 'max_value': 100000})
        eligibility_score = calculate_eligibility_score(
            request.score,
            request.score_type,
            config['max_value']
        )
        
        return {
            'exam': {
                'id': exam.get('id'),
                'name': exam_name,
                'type': exam_type
            },
            'input': {
                'score': request.score,
                'score_type': request.score_type,
                'category': request.category,
                'home_state': request.home_state
            },
            'eligibility_score': eligibility_score,
            'total_colleges': len(colleges),
            'colleges': colleges[:20]  # Return top 20
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error predicting colleges: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def calculate_eligibility_score(score: float, score_type: str, max_value: int) -> float:
    """Calculate eligibility score as percentage (0-100)"""
    if score_type == 'rank':
        # Lower rank is better
        return max(0, min(100, (1 - score / max_value) * 100))
    else:
        # Higher marks/percentile is better
        return max(0, min(100, (score / max_value) * 100))


def filter_colleges_by_score(colleges: list, request: PredictRequest, exam: dict) -> list:
    """Filter and rank colleges based on user's score"""
    exam_name = exam.get('name', '')
    config = EXAM_CONFIG.get(exam_name, {'input_type': 'rank', 'max_value': 100000})
    
    eligibility_score = calculate_eligibility_score(
        request.score,
        request.score_type,
        config['max_value']
    )
    
    result = []
    for college in colleges:
        # Calculate match score based on eligibility
        # Higher eligibility = more premium colleges accessible
        base_score = 50
        
        # Adjust based on college tier/rating
        rating = college.get('rating', 3.0)
        if rating:
            if eligibility_score >= 90 and rating >= 4.5:
                base_score = 95
            elif eligibility_score >= 80 and rating >= 4.0:
                base_score = 85
            elif eligibility_score >= 70 and rating >= 3.5:
                base_score = 75
            elif eligibility_score >= 60 and rating >= 3.0:
                base_score = 65
            else:
                base_score = 55
        
        # Category-based adjustment
        if request.category in ['SC', 'ST']:
            base_score += 10
        elif request.category in ['OBC', 'EWS']:
            base_score += 5
        
        # Home state advantage
        if request.home_state and college.get('state', '').lower() == request.home_state.lower():
            base_score += 5
        
        result.append({
            'id': college.get('id', ''),
            'name': college.get('name', ''),
            'slug': college.get('slug', ''),
            'type': college.get('type', 'College'),
            'location': f"{college.get('city', '')}, {college.get('state', '')}",
            'state': college.get('state', ''),
            'city': college.get('city', ''),
            'rating': rating,
            'ranking': college.get('ranking'),
            'fees': college.get('average_fees') or college.get('fees', {}).get('annual', 0),
            'placement': college.get('placement_stats', {}).get('average_package', 'N/A'),
            'match_score': min(100, base_score),
            'admission_probability': 'High' if base_score >= 80 else 'Medium' if base_score >= 60 else 'Low',
            'logo': college.get('logo', ''),
            'image': college.get('image', '')
        })
    
    # Sort by match score
    result.sort(key=lambda x: x['match_score'], reverse=True)
    return result


def generate_mock_predictions(exam: dict, request: PredictRequest) -> list:
    """Generate mock predictions when no real college data exists"""
    exam_name = exam.get('name', '')
    exam_type = exam.get('type', 'Engineering')
    config = EXAM_CONFIG.get(exam_name, {'input_type': 'rank', 'max_value': 100000})
    
    eligibility_score = calculate_eligibility_score(
        request.score,
        request.score_type,
        config['max_value']
    )
    
    # Mock colleges based on exam type
    mock_colleges = {
        'Engineering': [
            {'name': 'Indian Institute of Technology Delhi', 'city': 'New Delhi', 'state': 'Delhi', 'type': 'IIT', 'rating': 4.8, 'fees': 250000, 'placement': '25 LPA', 'min_score': 90},
            {'name': 'Indian Institute of Technology Bombay', 'city': 'Mumbai', 'state': 'Maharashtra', 'type': 'IIT', 'rating': 4.9, 'fees': 260000, 'placement': '28 LPA', 'min_score': 92},
            {'name': 'Indian Institute of Technology Madras', 'city': 'Chennai', 'state': 'Tamil Nadu', 'type': 'IIT', 'rating': 4.7, 'fees': 240000, 'placement': '24 LPA', 'min_score': 88},
            {'name': 'National Institute of Technology Trichy', 'city': 'Tiruchirappalli', 'state': 'Tamil Nadu', 'type': 'NIT', 'rating': 4.3, 'fees': 150000, 'placement': '14 LPA', 'min_score': 75},
            {'name': 'Delhi Technological University', 'city': 'Delhi', 'state': 'Delhi', 'type': 'State', 'rating': 4.2, 'fees': 180000, 'placement': '12 LPA', 'min_score': 70},
            {'name': 'BITS Pilani', 'city': 'Pilani', 'state': 'Rajasthan', 'type': 'Private', 'rating': 4.5, 'fees': 450000, 'placement': '18 LPA', 'min_score': 80},
            {'name': 'VIT Vellore', 'city': 'Vellore', 'state': 'Tamil Nadu', 'type': 'Private', 'rating': 4.1, 'fees': 200000, 'placement': '8 LPA', 'min_score': 50},
            {'name': 'SRM Institute', 'city': 'Chennai', 'state': 'Tamil Nadu', 'type': 'Private', 'rating': 3.9, 'fees': 300000, 'placement': '7 LPA', 'min_score': 40},
            {'name': 'Manipal Institute of Technology', 'city': 'Manipal', 'state': 'Karnataka', 'type': 'Private', 'rating': 4.0, 'fees': 350000, 'placement': '9 LPA', 'min_score': 45},
            {'name': 'PESIT Bangalore', 'city': 'Bangalore', 'state': 'Karnataka', 'type': 'Private', 'rating': 3.8, 'fees': 180000, 'placement': '6 LPA', 'min_score': 35},
        ],
        'Medical': [
            {'name': 'AIIMS Delhi', 'city': 'New Delhi', 'state': 'Delhi', 'type': 'Government', 'rating': 4.9, 'fees': 50000, 'placement': 'Top Hospital Placements', 'min_score': 95},
            {'name': 'CMC Vellore', 'city': 'Vellore', 'state': 'Tamil Nadu', 'type': 'Private', 'rating': 4.7, 'fees': 350000, 'placement': 'Excellent', 'min_score': 90},
            {'name': 'Maulana Azad Medical College', 'city': 'New Delhi', 'state': 'Delhi', 'type': 'Government', 'rating': 4.5, 'fees': 80000, 'placement': 'Very Good', 'min_score': 85},
            {'name': 'Grant Medical College', 'city': 'Mumbai', 'state': 'Maharashtra', 'type': 'Government', 'rating': 4.3, 'fees': 100000, 'placement': 'Good', 'min_score': 75},
            {'name': 'KMC Manipal', 'city': 'Manipal', 'state': 'Karnataka', 'type': 'Private', 'rating': 4.2, 'fees': 900000, 'placement': 'Good', 'min_score': 60},
        ],
        'Management': [
            {'name': 'IIM Ahmedabad', 'city': 'Ahmedabad', 'state': 'Gujarat', 'type': 'IIM', 'rating': 4.9, 'fees': 2500000, 'placement': '35 LPA', 'min_score': 99},
            {'name': 'IIM Bangalore', 'city': 'Bangalore', 'state': 'Karnataka', 'type': 'IIM', 'rating': 4.9, 'fees': 2400000, 'placement': '33 LPA', 'min_score': 98},
            {'name': 'IIM Calcutta', 'city': 'Kolkata', 'state': 'West Bengal', 'type': 'IIM', 'rating': 4.8, 'fees': 2300000, 'placement': '32 LPA', 'min_score': 97},
            {'name': 'XLRI Jamshedpur', 'city': 'Jamshedpur', 'state': 'Jharkhand', 'type': 'Private', 'rating': 4.6, 'fees': 2200000, 'placement': '28 LPA', 'min_score': 95},
            {'name': 'FMS Delhi', 'city': 'Delhi', 'state': 'Delhi', 'type': 'Government', 'rating': 4.5, 'fees': 200000, 'placement': '30 LPA', 'min_score': 98},
            {'name': 'SP Jain Mumbai', 'city': 'Mumbai', 'state': 'Maharashtra', 'type': 'Private', 'rating': 4.3, 'fees': 1800000, 'placement': '22 LPA', 'min_score': 90},
        ],
        'Law': [
            {'name': 'NLSIU Bangalore', 'city': 'Bangalore', 'state': 'Karnataka', 'type': 'NLU', 'rating': 4.9, 'fees': 350000, 'placement': '25 LPA', 'min_score': 95},
            {'name': 'NALSAR Hyderabad', 'city': 'Hyderabad', 'state': 'Telangana', 'type': 'NLU', 'rating': 4.8, 'fees': 340000, 'placement': '22 LPA', 'min_score': 92},
            {'name': 'NLU Delhi', 'city': 'Delhi', 'state': 'Delhi', 'type': 'NLU', 'rating': 4.7, 'fees': 320000, 'placement': '20 LPA', 'min_score': 90},
            {'name': 'WBNUJS Kolkata', 'city': 'Kolkata', 'state': 'West Bengal', 'type': 'NLU', 'rating': 4.5, 'fees': 300000, 'placement': '18 LPA', 'min_score': 85},
            {'name': 'Symbiosis Law School', 'city': 'Pune', 'state': 'Maharashtra', 'type': 'Private', 'rating': 4.2, 'fees': 450000, 'placement': '12 LPA', 'min_score': 70},
        ],
    }
    
    # Get colleges for this exam type
    colleges = mock_colleges.get(exam_type, mock_colleges['Engineering'])
    
    result = []
    for i, college in enumerate(colleges):
        # Check if user's score meets minimum requirement
        if eligibility_score >= college['min_score']:
            match_score = min(100, eligibility_score - college['min_score'] + 70)
            probability = 'High' if match_score >= 85 else 'Medium' if match_score >= 70 else 'Low'
        elif eligibility_score >= college['min_score'] - 10:
            match_score = 50 + (eligibility_score - college['min_score'] + 10) * 2
            probability = 'Low'
        else:
            continue  # Skip colleges where score is too low
        
        result.append({
            'id': f'mock-{i+1}',
            'name': college['name'],
            'type': college['type'],
            'location': f"{college['city']}, {college['state']}",
            'state': college['state'],
            'city': college['city'],
            'rating': college['rating'],
            'fees': college['fees'],
            'placement': college['placement'],
            'match_score': round(match_score, 1),
            'admission_probability': probability,
            'logo': '',
            'image': ''
        })
    
    # Sort by match score
    result.sort(key=lambda x: x['match_score'], reverse=True)
    return result
