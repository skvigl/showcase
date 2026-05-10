import { NeutralBallState } from "./states/NeutralState.js";
import { ISimulatedTeam } from "./SimulatedTeam.js";
import { Match } from "./types/match.js";
import { Player } from "./types/player.js";
import { MatchAction, MatchActionType } from "./types/match-action.js";
import { MINUTE } from "./utils.js";

const FAST_TICK_MS = 10;
const LIVE_TICK_MS = MINUTE;

export interface IMatchState {
  handleTick(match: SimulatedMatch): void;
}

export class SimulatedMatch {
  private state: IMatchState = new NeutralBallState();
  private started = false;
  private finished = false;
  private intervalId: NodeJS.Timeout | number = 0;

  public homeScore = 0;
  public awayScore = 0;
  public time = 0;
  public ballOwner: Player | null = null;
  public ballPosition: number = 50;
  public events: MatchAction[] = [];

  constructor(
    private match: Match,
    public readonly home: ISimulatedTeam,
    public readonly away: ISimulatedTeam,
    private duration: number = 40,
    private onActionCb: (event: MatchAction) => void,
    private onGoalCb: (match: Match) => void,
    private onFinishCb: (match: Match) => void,
  ) {}

  public get isGoldenGoalMode(): boolean {
    return this.time >= this.duration && this.homeScore === this.awayScore;
  }

  start(mode: "fast" | "live") {
    if (this.started || this.finished) return;

    this.started = true;

    this.intervalId = setInterval(() => this.tick(), mode === "live" ? LIVE_TICK_MS : FAST_TICK_MS);
  }

  registerGoal(side: "home" | "away") {
    if (side === "home") {
      this.homeScore++;
    } else {
      this.awayScore++;
    }

    this.onGoalCb(this.serialize());

    if (this.time >= this.duration) {
      this.finish();
    }
  }

  private finish() {
    if (this.finished) return;

    this.finished = true;
    clearInterval(this.intervalId);

    this.onFinishCb(this.serialize("finished"));
  }

  tick() {
    this.time++;
    this.state.handleTick(this);

    if (this.time >= this.duration && this.homeScore !== this.awayScore) {
      this.finish();
    }
  }

  setState(newState: IMatchState) {
    this.state = newState;
  }

  getOpponentTeam(actor: Player): ISimulatedTeam {
    return this.home.hasPlayer(actor) ? this.away : this.home;
  }

  addEvent(type: MatchActionType, actorId: string, targetId?: string) {

    this.onActionCb({
      matchId: this.match.id,
      tick: this.time,
      type,
      actorId: actorId,
      targetId: targetId || null,
      position: this.ballPosition,
    });
  }

  serialize(status: Match["status"] = "live"): Match {
    return {
      ...this.match,
      status: status,
      homeTeamScore: this.homeScore,
      awayTeamScore: this.awayScore,
      duration: this.time,
    };
  }
}
