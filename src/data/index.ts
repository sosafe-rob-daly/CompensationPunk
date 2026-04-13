export { ROLES } from './roles';
export { LEVELS } from './levels';
export { TIERS } from './tiers';
export { CITIES } from './cities';
export { PCTS, PCT_KEYS } from './percentiles';
export { PRESETS } from './presets';

import { ROLES } from './roles';
import { LEVELS } from './levels';
import { TIERS } from './tiers';
import { CITIES } from './cities';

export const CATEGORY_KEYS = Object.keys(ROLES);
export const LEVEL_KEYS = Object.keys(LEVELS);
export const TIER_KEYS = Object.keys(TIERS);
export const CITY_NAMES = Object.keys(CITIES);
export const COUNTRIES = [...new Set(Object.values(CITIES).map(c => c.country))];
