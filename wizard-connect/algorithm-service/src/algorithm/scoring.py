# ============================================
# COMPATIBILITY SCORING ALGORITHM
# ============================================

import numpy as np
from typing import Dict, List, Any
from scipy.spatial.distance import cosine


class CompatibilityScorer:
    """Calculate compatibility scores between users"""

    def __init__(self, weights: Dict[str, float]):
        """
        Initialize scorer with category weights

        Args:
            weights: Dict mapping categories to their weight (e.g., {
                'demographics': 0.10,
                'personality': 0.30,
                'values': 0.25,
                'lifestyle': 0.20,
                'interests': 0.15
            })
        """
        self.weights = weights

    def calculate_compatibility(
        self,
        user_a: Dict[str, Any],
        user_b: Dict[str, Any],
        crush_bonus: float = 1.0
    ) -> float:
        """
        Calculate overall compatibility score between two users

        Args:
            user_a: First user's data
            user_b: Second user's data
            crush_bonus: Bonus multiplier for crush matches (1.0, 1.1, or 1.2)

        Returns:
            Compatibility score (0-100)
        """
        # Check basic preferences first
        if not self._meets_preferences(user_a, user_b):
            return 0.0

        total_score = 0.0

        # Calculate scores for each category
        category_scores = {
            'demographics': self._score_demographics(user_a, user_b),
            'personality': self._score_personality(user_a, user_b),
            'values': self._score_values(user_a, user_b),
            'lifestyle': self._score_lifestyle(user_a, user_b),
            'interests': self._score_interests(user_a, user_b),
        }

        # Apply weights
        for category, score in category_scores.items():
            total_score += score * self.weights.get(category, 0)

        # Apply crush bonus
        total_score *= crush_bonus

        # Ensure score is between 0-100
        return min(max(total_score, 0.0), 100.0)

    def _meets_preferences(self, user_a: Dict, user_b: Dict) -> bool:
        """
        Check if users meet each other's basic preferences
        (gender preference, etc.)
        """
        # Get gender preferences
        seeking_a = set(user_a.get('seeking_gender', []))
        seeking_b = set(user_b.get('seeking_gender', []))

        gender_a = user_a.get('gender')
        gender_b = user_b.get('gender')

        # Check if A meets B's preferences
        if seeking_b and gender_a not in seeking_b:
            return False

        # Check if B meets A's preferences
        if seeking_a and gender_b not in seeking_a:
            return False

        return True

    def _score_demographics(self, user_a: Dict, user_b: Dict) -> float:
        """
        Score demographic similarity (10%)
        - Year proximity (same year = 100%, adjacent years = 75%, etc.)
        - Same major (bonus points)
        """
        score = 0.0

        # Year similarity
        year_order = {
            '1st_year': 1,
            '2nd_year': 2,
            '3rd_year': 3,
            '4th_year': 4,
            '5th_year': 5,
            'graduate': 6,
        }

        year_a = year_order.get(user_a.get('year', ''), 0)
        year_b = year_order.get(user_b.get('year', ''), 0)

        if year_a > 0 and year_b > 0:
            year_diff = abs(year_a - year_b)
            if year_diff == 0:
                score += 60  # Same year
            elif year_diff == 1:
                score += 45  # Adjacent years
            elif year_diff == 2:
                score += 30
            else:
                score += 15

        # Major bonus
        if user_a.get('major') == user_b.get('major'):
            score += 40  # Same major bonus

        return min(score, 100.0)

    def _score_personality(self, user_a: Dict, user_b: Dict) -> float:
        """
        Score personality compatibility (30%)
        Uses cosine similarity on personality vectors
        """
        personality_questions = [
            'personality_introvert',
            'personality_planner',
            'personality_social',
            'personality_adventurous',
        ]

        # Build personality vectors
        vector_a = []
        vector_b = []

        for q in personality_questions:
            # Normalize to 0-1 range (assuming 1-5 scale)
            val_a = (user_a.get('responses', {}).get(q, 3) - 1) / 4.0
            val_b = (user_b.get('responses', {}).get(q, 3) - 1) / 4.0

            vector_a.append(val_a)
            vector_b.append(val_b)

        # Calculate cosine similarity
        try:
            similarity = 1 - cosine(vector_a, vector_b)
            return similarity * 100
        except:
            return 50.0  # Default middle score if calculation fails

    def _score_values(self, user_a: Dict, user_b: Dict) -> float:
        """
        Score values alignment (25%)
        Higher similarity = better match
        """
        values_questions = [
            'values_family',
            'values_career',
            'values_religion',
            'values_politics',
        ]

        total_diff = 0
        count = 0

        for q in values_questions:
            val_a = user_a.get('responses', {}).get(q, 3)
            val_b = user_b.get('responses', {}).get(q, 3)

            # Calculate difference (assuming 1-5 scale)
            diff = abs(val_a - val_b)
            total_diff += diff
            count += 1

        if count == 0:
            return 50.0

        # Average difference (0-4 range)
        avg_diff = total_diff / count

        # Convert to similarity score (lower diff = higher score)
        similarity = 1 - (avg_diff / 4.0)
        return similarity * 100

    def _score_lifestyle(self, user_a: Dict, user_b: Dict) -> float:
        """
        Score lifestyle compatibility (20%)
        Mix of similarity and complement scoring
        """
        score = 0.0

        # Study habits - complement (night owl + early bird = good)
        study_a = user_a.get('responses', {}).get('lifestyle_study_habits', '')
        study_b = user_b.get('responses', {}).get('lifestyle_study_habits', '')

        complementary_pairs = [
            ('night_owl', 'early_bird'),
            ('last_minute', 'consistent'),
        ]

        if any(
            (study_a == pair[0] and study_b == pair[1]) or
            (study_a == pair[1] and study_b == pair[0])
            for pair in complementary_pairs
        ):
            score += 40  # Complementary bonus
        elif study_a == study_b:
            score += 30  # Similar but not complementary

        # Weekend preference - similarity
        weekend_a = user_a.get('responses', {}).get('lifestyle_weekend', '')
        weekend_b = user_b.get('responses', {}).get('lifestyle_weekend', '')

        if weekend_a == weekend_b:
            score += 35

        # Cleanliness - similarity
        cleanliness_a = user_a.get('responses', {}).get('lifestyle_cleanliness', 3)
        cleanliness_b = user_b.get('responses', {}).get('lifestyle_cleanliness', 3)

        diff = abs(cleanliness_a - cleanliness_b)
        cleanliness_score = 1 - (diff / 4.0)
        score += cleanliness_score * 25

        return min(score, 100.0)

    def _score_interests(self, user_a: Dict, user_b: Dict) -> float:
        """
        Score shared interests (15%)
        Uses Jaccard similarity coefficient
        """
        interests_a = set(user_a.get('interests_hobbies', []))
        interests_b = set(user_b.get('interests_hobbies', []))

        if not interests_a or not interests_b:
            return 50.0  # Default score if no interests

        # Jaccard similarity = (A ∩ B) / (A ∪ B)
        intersection = interests_a & interests_b
        union = interests_a | interests_b

        if not union:
            return 0.0

        jaccard_score = len(intersection) / len(union)

        # Add bonus for more shared interests
        shared_count = len(intersection)
        bonus = min(shared_count * 10, 30)  # Max 30 bonus points

        return (jaccard_score * 70) + bonus


def calculate_crush_bonus(
    user_a_id: str,
    user_b_id: str,
    crush_lists: List[Dict[str, Any]]
) -> float:
    """
    Determine crush bonus multiplier

    Returns:
        1.2 if mutual crush
        1.1 if one-way crush
        1.0 if no crush
    """
    # Check if A likes B
    a_likes_b = any(
        item.get('user_id') == user_a_id and item.get('crush_email') == user_b_id
        for item in crush_lists
    )

    # Check if B likes A
    b_likes_a = any(
        item.get('user_id') == user_b_id and item.get('crush_email') == user_a_id
        for item in crush_lists
    )

    if a_likes_b and b_likes_a:
        return 1.2  # Mutual crush - 20% boost
    elif a_likes_b or b_likes_a:
        return 1.1  # One-way crush - 10% boost
    else:
        return 1.0  # No crush bonus
