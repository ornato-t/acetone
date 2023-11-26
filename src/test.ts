import { isTarget } from "./image.js";
import { TOLERANCE } from "./index.js";

const id = '1178447641642811502';

console.log('Test:', await isTarget(id, TOLERANCE));