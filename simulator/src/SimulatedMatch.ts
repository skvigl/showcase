import { MINUTE } from "./utils.js";
import type { ISimulatedTeam } from "./SimulatedTeam.js";
import type { Match } from "./types/match.js";

const TICK_MS = MINUTE;

export class SimulatedMatch {
  private homeScore = 0;
  private awayScore = 0;
  private time = 0;
  private started = false;
  private finished = false;
  private intervalId: NodeJS.Timeout | number = 0;
  private homeStrength: number;
  private awayStrength: number;

  constructor(
    private match: Match,
    private home: ISimulatedTeam,
    private away: ISimulatedTeam,
    private duration: number = 40,
    private onGoalCb: (match: Match) => void,
    private onFinishCb: (match: Match) => void
  ) {
    this.time = 0;
    this.homeStrength = this.home.getStrength();
    this.awayStrength = this.away.getStrength();
  }

  start(mode: "fast" | "live") {
    if (this.started || this.finished) return;

    this.started = true;

    if (mode === "live") {
      this.tick();

      this.intervalId = setInterval(() => {
        this.tick();
      }, TICK_MS);
    }

    if (mode === "fast") {
      while (this.time < this.duration) {
        this.tick();
      }
    }
  }

  stop() {
    clearInterval(this.intervalId);
  }

  tick() {
    this.time++;

    if (this.time < this.duration) {
      this.processEvents();
      return;
    }

    if (!this.hasWinner()) {
      this.setWinnerRandomly();
    }

    this.finish();
    this.stop();
    this.onFinish();
  }

  processEvents() {
    if (Math.random() > 0.05) return;

    const diff = Math.abs(this.homeStrength - this.awayStrength);
    const maxDiff = 160;

    const baseWinChance = 0.5 + (diff / maxDiff) * 0.2;
    const chance = this.homeStrength > this.awayStrength ? baseWinChance : 1 - baseWinChance;

    const randomFactor = 0.7 + Math.random() * 0.6;
    const finalChance = chance * randomFactor;

    if (Math.random() < finalChance) {
      this.homeScore++;
    } else {
      this.awayScore++;
    }

    this.onGoal();
  }

  hasWinner() {
    const match = this.serialize();

    return match.home.score !== match.away.score;
  }

  setWinnerRandomly() {
    if (Math.random() > 0.5) {
      this.homeScore++;
    } else {
      this.awayScore++;
    }
  }

  finish() {
    this.finished = true;
  }

  isFinished() {
    return this.finished;
  }

  serialize(status: Match["status"] = "live"): Match {
    return {
      ...this.match,
      status: status,
      home: {
        ...this.match.home,
        score: this.homeScore,
      },
      away: {
        ...this.match.away,
        score: this.awayScore,
      },
    };
  }

  onGoal() {
    if (this.onGoalCb) {
      this.onGoalCb(this.serialize());
    }
  }

  onFinish() {
    if (this.onFinishCb) {
      this.onFinishCb(this.serialize("finished"));
    }
  }
}
