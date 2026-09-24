package main

import (
	"context"
	"log"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"

	"stats/internal/config"
	"stats/internal/db"
	dbgen "stats/internal/db/dbgen"
	"stats/internal/handler"
	"stats/internal/repository"
	"stats/internal/service"
)

func main() {
	cfg := config.Load()
	ctx := context.Background()

	conn, err := db.NewPostgres(ctx, cfg.DatabaseURL)

	if err != nil {
		log.Fatalf("database error: %v", err)
	}

	defer conn.Close()

	e := echo.New()
	e.Pre(middleware.RemoveTrailingSlash())
	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	if len(cfg.CORSOrigins) > 0 {
		e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
			AllowOrigins: cfg.CORSOrigins,
		}))
	}

	api := e.Group("")

	queries := dbgen.New(conn)
	playerRepo := repository.NewPlayerRepository(queries)
	playerService := service.NewPlayerService(playerRepo)
	playerHandler := handler.NewPlayerHandler(playerService)
	playerHandler.RegisterRoutes(api)

	address := cfg.AppHost + ":" + cfg.AppPort

	if err := e.Start(address); err != nil && err != http.ErrServerClosed {
		e.Logger.Error("failed to start server", "error", err)
	}
}
