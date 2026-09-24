package repository

import (
	"context"

	dbgen "stats/internal/db/dbgen"

	"github.com/jackc/pgx/v5/pgtype"
)

type PlayerRepository struct {
	q *dbgen.Queries
}

func NewPlayerRepository(q *dbgen.Queries) *PlayerRepository {
	return &PlayerRepository{q: q}
}

func (r *PlayerRepository) GetActions(ctx context.Context, playerID string, tournamentID string) ([]dbgen.GetPlayerTournamentActionCountsRow, error) {
	return r.q.GetPlayerTournamentActionCounts(ctx, dbgen.GetPlayerTournamentActionCountsParams{
		ActorID:      pgtype.Text{String: playerID, Valid: true},
		TournamentID: pgtype.Text{String: tournamentID, Valid: true},
	})
}

func (r *PlayerRepository) GetMaxActionsByTournament(ctx context.Context, tournamentID string) ([]dbgen.GetMaxTournamentActionCountsRow, error) {
	return r.q.GetMaxTournamentActionCounts(ctx, pgtype.Text{
		String: tournamentID,
		Valid:  true,
	})
}

func (r *PlayerRepository) GetMatchStats(ctx context.Context, playerID string, tournamentID string) ([]dbgen.GetPlayerTournamentMatchStatsRow, error) {
	return r.q.GetPlayerTournamentMatchStats(ctx, dbgen.GetPlayerTournamentMatchStatsParams{
		ActorID:      pgtype.Text{String: playerID, Valid: true},
		TournamentID: pgtype.Text{String: tournamentID, Valid: true},
	})
}
