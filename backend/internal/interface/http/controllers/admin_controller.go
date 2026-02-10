package controllers

import (
	"net/http"

	"wizard-connect/internal/domain/entities"
	"wizard-connect/internal/domain/repositories"
	"wizard-connect/internal/infrastructure/database"

	"github.com/gin-gonic/gin"
)

type AdminController struct {
	adminRepo repositories.AdminRepository
	userRepo  repositories.UserRepository
	matchRepo *database.MatchRepository
}

type AddAdminRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type RemoveAdminRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ManualMatchRequest struct {
	UserID             string  `json:"user_id" binding:"required"`
	MatchedUserID      string  `json:"matched_user_id" binding:"required"`
	CompatibilityScore float64 `json:"compatibility_score"`
}

func NewAdminController(
	adminRepo repositories.AdminRepository,
	userRepo repositories.UserRepository,
	matchRepo *database.MatchRepository,
) *AdminController {
	return &AdminController{
		adminRepo: adminRepo,
		userRepo:  userRepo,
		matchRepo: matchRepo,
	}
}

func (ctrl *AdminController) ListAdmins(c *gin.Context) {
	admins, err := ctrl.adminRepo.ListAdmins(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch admins"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"admins": admins,
	})
}

func (ctrl *AdminController) AddAdmin(c *gin.Context) {
	var req AddAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.adminRepo.AddAdmin(c.Request.Context(), req.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add admin"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Admin added successfully",
		"email":   req.Email,
	})
}

func (ctrl *AdminController) RemoveAdmin(c *gin.Context) {
	var req RemoveAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.adminRepo.RemoveAdmin(c.Request.Context(), req.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove admin"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Admin removed successfully",
		"email":   req.Email,
	})
}

func (ctrl *AdminController) GetAllUsers(c *gin.Context) {
	users, err := ctrl.userRepo.ListAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"count": len(users),
	})
}

func (ctrl *AdminController) GetAllMatches(c *gin.Context) {
	matches, err := ctrl.matchRepo.ListAllWithUserDetails(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch matches: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"matches": matches,
		"count":   len(matches),
	})
}

func (ctrl *AdminController) CreateManualMatch(c *gin.Context) {
	var req ManualMatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	match := &entities.Match{
		UserID:             req.UserID,
		MatchedUserID:      req.MatchedUserID,
		CompatibilityScore: req.CompatibilityScore,
		Rank:               1, // Manual matches are top priority
		IsMutualCrush:      true,
	}

	if err := ctrl.matchRepo.Create(c.Request.Context(), match); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create manual match: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Manual match created successfully",
		"match":   match,
	})
}
