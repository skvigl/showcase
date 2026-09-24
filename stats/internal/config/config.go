package config

import (
	"log"

	"github.com/caarlos0/env/v11"
	"github.com/joho/godotenv"
)

type Config struct {
	AppHost     string   `env:"APP_HOST,required"`
	AppPort     string   `env:"APP_PORT,required"`
	CORSOrigins []string `env:"CORS_ORIGIN" envSeparator:","`
	DatabaseURL string   `env:"DATABASE_URL,required"`
}

func Load() Config {
	_ = godotenv.Load()

	cfg := Config{}

	if err := env.Parse(&cfg); err != nil {
		log.Fatalf("config error: %v", err)
	}

	return cfg
}
