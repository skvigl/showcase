import { ActionResolver } from "../ActionResolver.js";
import { IMatchState, SimulatedMatch } from "../SimulatedMatch.js";
import { NeutralBallState } from "./NeutralState.js";

export class ControlledBallState implements IMatchState {
  handleTick(match: SimulatedMatch) {
    const owner = match.ballOwner;

    if (!owner) {
      match.setState(new NeutralBallState());
      return;
    }

    const opponentTeam = match.getOpponentTeam(owner);
    const defender = opponentTeam.getRandomPlayer();

    const result = defender ? ActionResolver.roll(defender.attack, owner.defence) : { success: false, isCrit: false };

    if (result.success) {
      if (result.isCrit) {
        const ownerTeam = match.home.hasPlayer(owner) ? match.home : match.away;

        match.addEvent("knockout", defender.id, owner.id);

        ownerTeam.knockoutPlayer(owner);
        match.ballOwner = defender;
      } else {
        match.addEvent("steal", defender.id, owner.id);
        match.ballOwner = defender;
      }
    } else {
      const isHomeOwner = match.home.hasPlayer(owner);
      const moveDistance = match.isGoldenGoalMode ? 100 : 20;

      if (isHomeOwner) {
        match.ballPosition += moveDistance;
      } else {
        match.ballPosition -= moveDistance;
      }

      if (match.ballPosition >= 100 || match.ballPosition <= 0) {
        match.registerGoal(match.ballPosition >= 100 ? "home" : "away");
        match.addEvent("score", owner.id);

        match.ballPosition = 50;
        match.ballOwner = null;
        match.home.resetActivePlayers();
        match.away.resetActivePlayers();
        match.setState(new NeutralBallState());
      } else {
        match.addEvent("move", owner.id);
      }
    }
  }
}
