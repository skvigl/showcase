package handler

import (
	"net/http"

	"github.com/labstack/echo/v5"

	"stats/internal/service"
)

type PlayerHandler struct {
	service *service.PlayerService
}

func NewPlayerHandler(s *service.PlayerService) *PlayerHandler {
	return &PlayerHandler{service: s}
}

func (h *PlayerHandler) RegisterRoutes(g *echo.Group) {
	players := g.Group("/players")
	players.GET("/:id/overview", h.GetOverview)
	players.GET("/:id/match-stats", h.GetMatchStats)
}

func (h *PlayerHandler) GetOverview(c *echo.Context) error {
	playerID := c.Param("id")
	tournamentID := c.QueryParam("tournamentId")

	if playerID == "" || tournamentID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "missing parameters"})
	}

	radar, err := h.service.GetOverview(c.Request().Context(), playerID, tournamentID)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, radar)
}

func (h *PlayerHandler) GetMatchStats(c *echo.Context) error {
	playerID := c.Param("id")
	tournamentID := c.QueryParam("tournamentId")

	if playerID == "" || tournamentID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "missing parameters"})
	}

	stats, err := h.service.GetMatchStats(c.Request().Context(), playerID, tournamentID)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, stats)
}
