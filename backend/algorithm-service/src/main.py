# ============================================
# FASTAPI APPLICATION - MATCHING SERVICE
# ============================================

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import os
from supabase import create_client, Client

from algorithm.matching import MatchingEngine, validate_matches
from algorithm.scoring import calculate_crush_bonus

app = FastAPI(
    title="Wizard Connect Matching Algorithm Service",
    description="Advanced compatibility matching using Hungarian algorithm",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
supabase: Client = create_client(
    os.getenv('SUPABASE_URL', ''),
    os.getenv('SUPABASE_ANON_KEY', '')
)

# Default weights
DEFAULT_WEIGHTS = {
    'demographics': 0.10,
    'personality': 0.30,
    'values': 0.25,
    'lifestyle': 0.20,
    'interests': 0.15,
}


# Pydantic models
class MatchRequest(BaseModel):
    campaign_id: str
    num_matches: Optional[int] = 7
    weights: Optional[Dict[str, float]] = None


class MatchResponse(BaseModel):
    success: bool
    message: str
    total_users: int
    total_matches_generated: int
    stats: Dict[str, Any]


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Wizard Connect Matching Algorithm",
        "status": "healthy",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post("/run-matching", response_model=MatchResponse)
async def run_matching(request: MatchRequest, background_tasks: BackgroundTasks):
    """
    Run the matching algorithm for a campaign

    This endpoint:
    1. Fetches all users and their survey responses
    2. Fetches crush lists
    3. Runs the matching algorithm
    4. Stores results in database
    """
    try:
        # 1. Fetch campaign details
        campaign_response = supabase.table('campaigns').select('*').eq('id', request.campaign_id).single()

        if campaign_response.data is None:
            raise HTTPException(status_code=404, detail="Campaign not found")

        campaign = campaign_response.data

        # 2. Fetch users with survey responses
        users_response = supabase.table('survey_responses').select('*').eq('campaign_id', request.campaign_id).execute()

        if not users_response.data:
            raise HTTPException(status_code=400, detail="No survey responses found")

        # Organize responses by user
        users_dict = {}

        for response in users_response.data:
            user_id = response['user_id']

            if user_id not in users_dict:
                # Fetch user details
                user_response = supabase.table('users').select('*').eq('id', user_id).single()

                if user_response.data:
                    users_dict[user_id] = {
                        'id': user_id,
                        'email': user_response.data.get('email'),
                        'first_name': user_response.data.get('first_name'),
                        'last_name': user_response.data.get('last_name'),
                        'year': user_response.data.get('year'),
                        'major': user_response.data.get('major'),
                        'gender': user_response.data.get('gender'),
                        'seeking_gender': user_response.data.get('seeking_gender'),
                        'responses': {},
                        'interests_hobbies': [],
                    }

            # Add survey response
            if user_id in users_dict:
                if response['question_id'] == 'interests_hobbies':
                    users_dict[user_id]['interests_hobbies'] = response['response_value']
                else:
                    users_dict[user_id]['responses'][response['question_id']] = response['response_value']

        users = list(users_dict.values())

        # 3. Fetch crush lists
        crush_response = supabase.table('crush_lists').select('*').eq('campaign_id', request.campaign_id).execute()
        crush_lists = crush_response.data or []

        # 4. Initialize matching engine
        weights = request.weights or DEFAULT_WEIGHTS
        engine = MatchingEngine(weights, num_matches=request.num_matches or 7)

        # 5. Generate matches
        matches = engine.generate_matches(users, crush_lists)

        # 6. Validate matches
        stats = validate_matches(matches, users)

        # 7. Create match records
        match_records = engine.create_match_records(matches, request.campaign_id)

        # 8. Store matches in database
        if match_records:
            # Delete existing matches for this campaign
            supabase.table('matches').delete().eq('campaign_id', request.campaign_id).execute()

            # Insert new matches
            supabase.table('matches').insert(match_records).execute()

        # 9. Update campaign stats
        supabase.table('campaigns').update({
            'total_participants': len(users),
            'total_matches_generated': len(match_records)
        }).eq('id', request.campaign_id).execute()

        return MatchResponse(
            success=True,
            message="Matching completed successfully",
            total_users=len(users),
            total_matches_generated=len(match_records),
            stats=stats
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")


@app.post("/test-matching")
async def test_matching():
    """
    Test endpoint with mock data
    """
    # Mock users
    users = [
        {
            'id': '1',
            'email': 'user1@mapua.edu.ph',
            'year': '3rd_year',
            'major': 'cs',
            'gender': 'male',
            'seeking_gender': ['female'],
            'responses': {
                'personality_introvert': 2,
                'personality_social': 4,
                'values_family': 5,
                'lifestyle_study_habits': 'night_owl',
            },
            'interests_hobbies': ['gaming', 'music', 'tech'],
        },
        {
            'id': '2',
            'email': 'user2@mapua.edu.ph',
            'year': '3rd_year',
            'major': 'cs',
            'gender': 'female',
            'seeking_gender': ['male'],
            'responses': {
                'personality_introvert': 3,
                'personality_social': 3,
                'values_family': 4,
                'lifestyle_study_habits': 'early_bird',
            },
            'interests_hobbies': ['gaming', 'music', 'art'],
        },
    ]

    # Mock crush lists
    crush_lists = []

    # Run matching
    engine = MatchingEngine(DEFAULT_WEIGHTS, num_matches=7)
    matches = engine.generate_matches(users, crush_lists)
    stats = validate_matches(matches, users)

    return {
        'users': users,
        'matches': matches,
        'stats': stats,
    }


if __name__ == '__main__':
    import uvicorn

    port = int(os.getenv('PORT', 8000))
    uvicorn.run(app, host='0.0.0.0', port=port)
