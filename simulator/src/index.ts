import "dotenv/config";

import { MatchService } from "./services/MatchService.js";
import { TeamService } from "./services/TeamService.js";
import { Simulator } from "./Simulator.js";

const matchService = new MatchService();
const teamService = new TeamService();
const simulator = new Simulator(matchService, teamService);

simulator.start();
