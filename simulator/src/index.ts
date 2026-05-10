import "dotenv/config";

import { MatchService } from "./services/MatchService.js";
import { TeamService } from "./services/TeamService.js";
import { Simulator } from "./Simulator.js";
import { MatchActionService } from "./services/MatchActionService.js";

const matchService = new MatchService();
const teamService = new TeamService();
const matchActionService = new MatchActionService();
const simulator = new Simulator(matchService, teamService, matchActionService);

simulator.start();
