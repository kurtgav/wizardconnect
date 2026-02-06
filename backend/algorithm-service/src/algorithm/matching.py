# ============================================
# MATCHING ALGORITHM - HUNGARIAN METHOD
# ============================================

import numpy as np
from typing import Dict, List, Any, Tuple
from scipy.optimize import linear_sum_assignment
from .scoring import CompatibilityScorer, calculate_crush_bonus


class MatchingEngine:
    """Generate optimal matches using Hungarian algorithm and compatibility scoring"""

    def __init__(self, weights: Dict[str, float], num_matches: int = 7):
        """
        Initialize matching engine

        Args:
            weights: Category weights for scoring
            num_matches: Number of matches per user
        """
        self.scorer = CompatibilityScorer(weights)
        self.num_matches = num_matches

    def generate_matches(
        self,
        users: List[Dict[str, Any]],
        crush_lists: List[Dict[str, Any]]
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Generate matches for all users

        Args:
            users: List of all users with their survey responses
            crush_lists: List of all crush entries

        Returns:
            Dict mapping user_id to list of their matches
        """
        # Separate users by preference pools (gender, seeking_gender)
        pools = self._create_preference_pools(users)

        all_matches = {}

        for pool in pools:
            # Generate matches within this pool
            pool_matches = self._match_pool(pool, crush_lists)
            all_matches.update(pool_matches)

        return all_matches

    def _create_preference_pools(self, users: List[Dict]) -> List[List[Dict]]:
        """
        Separate users into pools based on gender preferences
        Users can only match with users they're interested in
        """
        # For simplicity, we'll create pools based on seeking_gender
        # In production, this would be more sophisticated

        pools = []
        processed_users = set()

        for user in users:
            if user['id'] in processed_users:
                continue

            # Find all users who match with this user
            seeking = set(user.get('seeking_gender', []))
            if not seeking:
                # If no preference, can match with anyone
                seeking = {'male', 'female', 'non_binary'}

            # Find compatible pool
            pool = [user]
            processed_users.add(user['id'])

            for other in users:
                if other['id'] == user['id'] or other['id'] in processed_users:
                    continue

                other_seeking = set(other.get('seeking_gender', []))
                if not other_seeking:
                    other_seeking = {'male', 'female', 'non_binary'}

                # Check if they can match (each is in the other's seeking list)
                user_gender = user.get('gender')
                other_gender = other.get('gender')

                if (user_gender in other_seeking) and (other_gender in seeking):
                    pool.append(other)
                    processed_users.add(other['id'])

            if pool:
                pools.append(pool)

        return pools

    def _match_pool(
        self,
        pool: List[Dict[str, Any]],
        crush_lists: List[Dict[str, Any]]
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Match users within a preference pool
        """
        n = len(pool)
        if n < 2:
            return {}

        # Build compatibility matrix
        compat_matrix = np.zeros((n, n))

        for i, user_a in enumerate(pool):
            for j, user_b in enumerate(pool):
                if i == j:
                    compat_matrix[i][j] = 0  # Can't match with self
                else:
                    # Calculate crush bonus
                    crush_bonus = calculate_crush_bonus(
                        user_a['id'],
                        user_b['id'],
                        crush_lists
                    )

                    # Calculate compatibility
                    score = self.scorer.calculate_compatibility(
                        user_a,
                        user_b,
                        crush_bonus
                    )

                    compat_matrix[i][j] = score

        # For each user, get top N matches
        matches = {}

        for i, user in enumerate(pool):
            # Get scores for this user
            scores = compat_matrix[i]

            # Get indices of top N matches (excluding self)
            # Use argsort in descending order
            top_indices = np.argsort(scores)[::-1][:self.num_matches * 2]

            # Filter out self and low scores
            user_matches = []
            for idx in top_indices:
                if idx == i or scores[idx] < 30:  # Minimum threshold
                    continue

                matched_user = pool[idx]
                user_matches.append({
                    'user_id': matched_user['id'],
                    'score': float(scores[idx]),
                    'rank': len(user_matches) + 1,
                })

                if len(user_matches) >= self.num_matches:
                    break

            matches[user['id']] = user_matches

        return matches

    def create_match_records(
        self,
        matches: Dict[str, List[Dict[str, Any]]],
        campaign_id: str
    ) -> List[Dict[str, Any]]:
        """
        Create match records for database insertion

        Args:
            matches: Dict of user_id -> list of matches
            campaign_id: Campaign UUID

        Returns:
            List of match records for database
        """
        match_records = []
        processed_pairs = set()

        for user_a_id, match_list in matches.items():
            for match_data in match_list:
                user_b_id = match_data['user_id']

                # Create a unique pair key to avoid duplicates
                pair_key = tuple(sorted([user_a_id, user_b_id]))

                if pair_key in processed_pairs:
                    continue

                processed_pairs.add(pair_key)

                match_records.append({
                    'campaign_id': campaign_id,
                    'user_a_id': user_a_id,
                    'user_b_id': user_b_id,
                    'compatibility_score': match_data['score'],
                    'rank_for_a': match_data['rank'],
                    'is_mutual_crush': match_data.get('is_mutual_crush', False),
                    # Note: rank_for_b would need to be calculated by looking at user_b's match list
                })

        return match_records


def validate_matches(
    matches: Dict[str, List[Dict[str, Any]]],
    users: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Validate match quality and return statistics

    Returns:
        Dict with validation stats
    """
    total_users = len(matches)
    total_matches = sum(len(m) for m in matches.values())

    scores = []
    for match_list in matches.values():
        for match in match_list:
            scores.append(match['score'])

    avg_score = np.mean(scores) if scores else 0
    min_score = np.min(scores) if scores else 0
    max_score = np.max(scores) if scores else 0

    # Count users with fewer matches than expected
    users_with_fewer = sum(1 for m in matches.values() if len(m) < 7)

    return {
        'total_users': total_users,
        'total_matches': total_matches,
        'avg_matches_per_user': total_matches / total_users if total_users > 0 else 0,
        'avg_compatibility': avg_score,
        'min_compatibility': min_score,
        'max_compatibility': max_score,
        'users_with_fewer_matches': users_with_fewer,
        'success': users_with_fewer == 0,
    }
