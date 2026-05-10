import { IMatchState, SimulatedMatch } from "../SimulatedMatch.js";
import { ControlledBallState } from "./ControlledBallState.js";
import { ActionResolver } from "../ActionResolver.js";

export class NeutralBallState implements IMatchState {
  handleTick(match: SimulatedMatch) {
    const isHomeInitiator = Math.random() < 0.5;

    const teamA = isHomeInitiator ? match.home : match.away;
    const teamB = isHomeInitiator ? match.away : match.home;

    const actor = teamA.getRandomPlayer();
    const target = teamB.getRandomPlayer();

    const { success } = ActionResolver.roll(actor.attack, target.defence);

    if (success) {
      match.ballOwner = actor;
    } else {
      match.ballOwner = target;
    }

    match.addEvent("grab", match.ballOwner.id);
    match.setState(new ControlledBallState());
  }
}
