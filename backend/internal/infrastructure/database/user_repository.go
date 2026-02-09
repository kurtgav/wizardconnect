package database

import (
	"context"
	"fmt"
	"sync"
	"time"

	"wizard-connect/internal/domain/entities"
)

type UserRepository struct {
	db     *Database
	cache  map[string]*entities.User
	mu     sync.RWMutex
	ttl    time.Duration
	stopCh chan struct{}
}

func NewUserRepository(db *Database) *UserRepository {
	repo := &UserRepository{
		db:     db,
		cache:  make(map[string]*entities.User),
		ttl:    5 * time.Minute, // Cache entries for 5 minutes
		stopCh: make(chan struct{}),
	}

	// Start cache cleanup goroutine
	go repo.cacheCleanup()

	return repo
}

// cacheCleanup periodically removes expired cache entries
func (r *UserRepository) cacheCleanup() {
	ticker := time.NewTicker(r.ttl)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			r.mu.Lock()
			r.cache = make(map[string]*entities.User) // Clear cache
			r.mu.Unlock()
		case <-r.stopCh:
			return
		}
	}
}

// Close stops the cache cleanup goroutine
func (r *UserRepository) Close() {
	close(r.stopCh)
}

func (r *UserRepository) Create(ctx context.Context, user *entities.User) error {
	query := `
		INSERT INTO users (id, email, first_name, last_name, avatar_url, bio, instagram, phone, contact_preference, visibility, year, major, gender, gender_preference)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		ON CONFLICT (id) DO UPDATE
		SET email = EXCLUDED.email,
		    first_name = EXCLUDED.first_name,
		    last_name = EXCLUDED.last_name,
		    avatar_url = EXCLUDED.avatar_url,
		    bio = EXCLUDED.bio,
		    instagram = EXCLUDED.instagram,
		    phone = EXCLUDED.phone,
		    contact_preference = EXCLUDED.contact_preference,
		    visibility = EXCLUDED.visibility,
		    year = EXCLUDED.year,
		    major = EXCLUDED.major,
		    gender = EXCLUDED.gender,
		    gender_preference = EXCLUDED.gender_preference,
		    updated_at = NOW()
	`

	_, err := r.db.Exec(ctx, query,
		user.ID, user.Email, user.FirstName, user.LastName, user.AvatarURL,
		user.Bio, user.Instagram, user.Phone, user.ContactPref, user.Visibility,
		user.Year, user.Major, user.Gender, user.GenderPreference,
	)

	if err != nil {
		return err
	}

	// Cache the new user
	r.mu.Lock()
	r.cache[user.ID] = user
	r.mu.Unlock()

	return nil
}

func (r *UserRepository) GetByID(ctx context.Context, id string) (*entities.User, error) {
	// Try cache first
	r.mu.RLock()
	if user, found := r.cache[id]; found {
		r.mu.RUnlock()
		return user, nil
	}
	r.mu.RUnlock()

	// Cache miss - query database
	query := `
		SELECT id, email, first_name, last_name, avatar_url, bio, instagram, phone,
		       contact_preference, visibility, year, major, gender, gender_preference, created_at, updated_at
		FROM users
		WHERE id = $1
	`

	user := &entities.User{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.AvatarURL,
		&user.Bio, &user.Instagram, &user.Phone, &user.ContactPref, &user.Visibility,
		&user.Year, &user.Major, &user.Gender, &user.GenderPreference, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	// Update cache
	r.mu.Lock()
	r.cache[id] = user
	r.mu.Unlock()

	return user, nil
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*entities.User, error) {
	query := `
		SELECT id, email, first_name, last_name, avatar_url, bio, instagram, phone,
		       contact_preference, visibility, year, major, gender, gender_preference, created_at, updated_at
		FROM users
		WHERE email = $1
	`

	user := &entities.User{}
	err := r.db.QueryRow(ctx, query, email).Scan(
		&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.AvatarURL,
		&user.Bio, &user.Instagram, &user.Phone, &user.ContactPref, &user.Visibility,
		&user.Year, &user.Major, &user.Gender, &user.GenderPreference, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	return user, nil
}

func (r *UserRepository) Update(ctx context.Context, user *entities.User) error {
	query := `
		UPDATE users
		SET first_name = $2, last_name = $3, avatar_url = $4, bio = $5,
		    instagram = $6, phone = $7, contact_preference = $8,
		    visibility = $9, year = $10, major = $11, gender = $12,
		    gender_preference = $13, updated_at = NOW()
		WHERE id = $1
	`

	_, err := r.db.Exec(ctx, query,
		user.ID, user.FirstName, user.LastName, user.AvatarURL, user.Bio,
		user.Instagram, user.Phone, user.ContactPref, user.Visibility,
		user.Year, user.Major, user.Gender, user.GenderPreference,
	)

	if err != nil {
		return err
	}

	// Update cache with fresh data
	r.mu.Lock()
	r.cache[user.ID] = user
	r.mu.Unlock()

	return nil
}

func (r *UserRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM users WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *UserRepository) List(ctx context.Context, limit, offset int) ([]*entities.User, error) {
	query := `
		SELECT id, email, first_name, last_name, avatar_url, bio, instagram, phone,
		       contact_preference, visibility, year, major, gender, gender_preference, created_at, updated_at
		FROM users
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.db.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*entities.User
	for rows.Next() {
		user := &entities.User{}
		err := rows.Scan(
			&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.AvatarURL,
			&user.Bio, &user.Instagram, &user.Phone, &user.ContactPref, &user.Visibility,
			&user.Year, &user.Major, &user.Gender, &user.GenderPreference, &user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (r *UserRepository) ListAll(ctx context.Context) ([]*entities.User, error) {
	query := `
		SELECT id, email, first_name, last_name, avatar_url, bio, instagram, phone,
		       contact_preference, visibility, year, major, gender, gender_preference, created_at, updated_at
		FROM users
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*entities.User
	for rows.Next() {
		user := &entities.User{}
		err := rows.Scan(
			&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.AvatarURL,
			&user.Bio, &user.Instagram, &user.Phone, &user.ContactPref, &user.Visibility,
			&user.Year, &user.Major, &user.Gender, &user.GenderPreference, &user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}
