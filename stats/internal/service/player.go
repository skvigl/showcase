package service

import (
	"context"
	"time"

	"stats/internal/domain"
	"stats/internal/repository"
)

type RadarResponse struct {
	Player map[string]int `json:"player"`
	Max    map[string]int `json:"max"`
}

type MatchActions struct {
	Grab     int `json:"grab"`
	Move     int `json:"move"`
	Steal    int `json:"steal"`
	Knockout int `json:"knockout"`
	Score    int `json:"score"`
}

type PlayerMatchStatsResponse struct {
	MatchID string       `json:"matchId"`
	Date    time.Time    `json:"date"`
	Actions MatchActions `json:"actions"`
}

type PlayerService struct {
	repo *repository.PlayerRepository
}

func NewPlayerService(repo *repository.PlayerRepository) *PlayerService {
	return &PlayerService{repo: repo}
}

func (s *PlayerService) GetOverview(ctx context.Context, playerID, tournamentID string) (*RadarResponse, error) {
	actions, err := s.repo.GetActions(ctx, playerID, tournamentID)

	if err != nil {
		return nil, err
	}

	maxActions, err := s.repo.GetMaxActionsByTournament(ctx, tournamentID)

	if err != nil {
		return nil, err
	}

	actionsMap := map[string]int{"grab": 0, "move": 0, "steal": 0, "knockout": 0, "score": 0}
	maxMap := map[string]int{"grab": 0, "move": 0, "steal": 0, "knockout": 0, "score": 0}

	for _, a := range actions {
		actionsMap[a.Type.String] = int(a.Count.Int64)
	}

	for _, m := range maxActions {
		maxMap[m.Type.String] = int(m.MaxCount.Int64)
	}

	return &RadarResponse{
		Player: actionsMap,
		Max:    maxMap,
	}, nil
}

func (s *PlayerService) GetMatchStats(ctx context.Context, playerID, tournamentID string) (domain.Collection[PlayerMatchStatsResponse], error) {
	rows, err := s.repo.GetMatchStats(ctx, playerID, tournamentID)

	if err != nil {
		return domain.Collection[PlayerMatchStatsResponse]{}, err
	}

	res := make([]PlayerMatchStatsResponse, 0, len(rows))

	for _, r := range rows {
		dateVal, _ := r.Date.(time.Time)

		res = append(res, PlayerMatchStatsResponse{
			MatchID: r.MatchID,
			Date:    dateVal,
			Actions: MatchActions{
				Grab:     int(r.Grab.Int64),
				Move:     int(r.Move.Int64),
				Steal:    int(r.Steal.Int64),
				Knockout: int(r.Knockout.Int64),
				Score:    int(r.Score.Int64),
			},
		})
	}

	return domain.NewCollection(res), nil
}
