import { isTarget } from "./image.js";
import { TOLERANCE } from "./index.js";

const id = '1178489718447550494';

const res = await isTarget(id, TOLERANCE);
console.log('Test:', res.result, res.bestMatch.name, res.bestMatch.match);
process.exit(0);