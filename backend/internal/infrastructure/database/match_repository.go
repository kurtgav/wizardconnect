package database

import (
	"context"
	"database/sql"
	"time"
	"wizard-connect/internal/domain/entities"
)

type MatchRepository struct {
	db *Database
}

func NewMatchRepository(db *Database) *MatchRepository {
	return &MatchRepository{db: db}
}

func (r *MatchRepository) GetDB() *sql.DB {
	return r.db.DB
}

func (r *MatchRepository) GetByUserID(ctx context.Context, userID string) ([]*entities.Match, error) {
	query := `
		SELECT id, user_id, matched_user_id, compatibility_score, rank, is_mutual_crush, created_at
		FROM matches
		WHERE user_id = $1
		ORDER BY rank ASC
	`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var matches []*entities.Match
	for rows.Next() {
		match := &entities.Match{}
		err := rows.Scan(
			&match.ID, &match.UserID, &match.MatchedUserID, &match.CompatibilityScore, &match.Rank, &match.IsMutualCrush, &match.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		matches = append(matches, match)
	}

	return matches, nil
}

func (r *MatchRepository) GetMatch(ctx context.Context, userID, matchedUserID string) (*entities.Match, error) {
	query := `
		SELECT id, user_id, matched_user_id, compatibility_score, rank, is_mutual_crush, created_at
		FROM matches
		WHERE user_id = $1 AND matched_user_id = $2
	`

	match := &entities.Match{}
	err := r.db.QueryRow(ctx, query, userID, matchedUserID).Scan(
		&match.ID, &match.UserID, &match.MatchedUserID, &match.CompatibilityScore, &match.Rank, &match.IsMutualCrush, &match.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return match, nil
}

func (r *MatchRepository) Create(ctx context.Context, match *entities.Match) error {
	query := `
		INSERT INTO matches (user_id, matched_user_id, compatibility_score, rank, is_mutual_crush)
			VALUES ($1, $2, $3, $4, $5)
	`

	_, err := r.db.Exec(ctx, query,
		match.UserID, match.MatchedUserID, match.CompatibilityScore, match.Rank, match.IsMutualCrush,
	)

	return err
}

func (r *MatchRepository) DeleteByUserID(ctx context.Context, userID string) error {
	query := `DELETE FROM matches WHERE user_id = $1`

	_, err := r.db.Exec(ctx, query, userID)
	return err
}

func (r *MatchRepository) GetByUserIDWithUserDetails(ctx context.Context, userID string) ([]*MatchWithUserDetails, error) {
	query := `
		SELECT
			m.id,
			m.user_id,
			m.matched_user_id,
			m.compatibility_score,
			m.rank,
			m.is_mutual_crush,
			m.created_at,
			u.email as matched_email,
			COALESCE(u.first_name, '') as first_name,
			COALESCE(u.last_name, '') as last_name,
			COALESCE(u.avatar_url, '') as avatar_url,
			COALESCE(u.bio, '') as bio,
			COALESCE(u.year, '') as year,
			COALESCE(u.major, '') as major,
			COALESCE(u.gender, 'prefer_not_to_say') as gender,
			COALESCE(u.gender_preference, 'both') as gender_preference,
			COALESCE(u.visibility, 'matches_only') as visibility
		FROM matches m
		JOIN users u ON m.matched_user_id = u.id
		WHERE m.user_id = $1
		ORDER BY m.rank ASC
	`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var matches []*MatchWithUserDetails
	for rows.Next() {
		match := &MatchWithUserDetails{}
		err := rows.Scan(
			&match.ID, &match.UserID, &match.MatchedUserID, &match.CompatibilityScore, &match.Rank, &match.IsMutualCrush, &match.CreatedAt,
			&match.MatchedEmail, &match.FirstName, &match.LastName, &match.AvatarURL,
			&match.Bio, &match.Year, &match.Major,
			&match.Gender, &match.GenderPreference, &match.Visibility,
		)

		if err != nil {
			return nil, err
		}

		matches = append(matches, match)
	}

	return matches, nil
}

func (r *MatchRepository) ListAllWithUserDetails(ctx context.Context) ([]*MatchWithBothUserDetails, error) {
	query := `
		SELECT
			m.id,
			m.user_id,
			m.matched_user_id,
			m.compatibility_score,
			m.rank,
			m.is_mutual_crush,
			m.created_at,
			u1.email as user1_email,
			COALESCE(u1.first_name, '') as user1_first_name,
			COALESCE(u1.last_name, '') as user1_last_name,
			COALESCE(u1.avatar_url, '') as user1_avatar_url,
			u2.email as user2_email,
			COALESCE(u2.first_name, '') as user2_first_name,
			COALESCE(u2.last_name, '') as user2_last_name,
			COALESCE(u2.avatar_url, '') as user2_avatar_url
		FROM matches m
		JOIN users u1 ON m.user_id = u1.id
		JOIN users u2 ON m.matched_user_id = u2.id
		ORDER BY m.created_at DESC, m.rank ASC
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var matches []*MatchWithBothUserDetails
	for rows.Next() {
		match := &MatchWithBothUserDetails{}
		err := rows.Scan(
			&match.ID, &match.UserID, &match.MatchedUserID, &match.CompatibilityScore, &match.Rank, &match.IsMutualCrush, &match.CreatedAt,
			&match.User1Email, &match.User1FirstName, &match.User1LastName, &match.User1AvatarURL,
			&match.User2Email, &match.User2FirstName, &match.User2LastName, &match.User2AvatarURL,
		)

		if err != nil {
			return nil, err
		}

		matches = append(matches, match)
	}

	return matches, nil
}

type MatchWithUserDetails struct {
	ID                 string    `json:"id"`
	UserID             string    `json:"user_id"`
	MatchedUserID      string    `json:"matched_user_id"`
	CompatibilityScore float64   `json:"compatibility_score"`
	Rank               int       `json:"rank"`
	IsMutualCrush      bool      `json:"is_mutual_crush"`
	CreatedAt          time.Time `json:"created_at"`
	MatchedEmail       string    `json:"matched_email"`
	FirstName          string    `json:"first_name"`
	LastName           string    `json:"last_name"`
	AvatarURL          string    `json:"avatar_url"`
	Bio                string    `json:"bio"`
	Year               string    `json:"year"`
	Major              string    `json:"major"`
	Gender             string    `json:"gender"`
	GenderPreference   string    `json:"gender_preference"`
	Visibility         string    `json:"visibility"`
}

type MatchWithBothUserDetails struct {
	ID                 string    `json:"id"`
	UserID             string    `json:"user_id"`
	MatchedUserID      string    `json:"matched_user_id"`
	CompatibilityScore float64   `json:"compatibility_score"`
	Rank               int       `json:"rank"`
	IsMutualCrush      bool      `json:"is_mutual_crush"`
	CreatedAt          time.Time `json:"created_at"`
	User1Email         string    `json:"user1_email"`
	User1FirstName     string    `json:"user1_first_name"`
	User1LastName      string    `json:"user1_last_name"`
	User1AvatarURL     string    `json:"user1_avatar_url"`
	User2Email         string    `json:"user2_email"`
	User2FirstName     string    `json:"user2_first_name"`
	User2LastName      string    `json:"user2_last_name"`
	User2AvatarURL     string    `json:"user2_avatar_url"`
}
