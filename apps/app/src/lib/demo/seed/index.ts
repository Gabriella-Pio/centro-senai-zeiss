import { SEED_REQUESTS } from "./requests";
import { SEED_RECORDS } from "./records";
import { SEED_VOCABULARY } from "./vocabulary";
import { MACHINE_TARIFF_SEED } from "./machine-tariff-seed";
import { SEED_NOTIFICATIONS } from "./notifications";

import {
  DEFAULT_LAB_SETTINGS,
  type DemoState,
} from "../demo-store-types";

export const DEMO_SEED_VERSION = 6;

export function createSeedState(): DemoState {
  return {
    seedVersion: DEMO_SEED_VERSION,
    requests: SEED_REQUESTS,
    records: SEED_RECORDS,
    vocabulary: SEED_VOCABULARY,
    machineTariffs: MACHINE_TARIFF_SEED,
    labSettings: DEFAULT_LAB_SETTINGS,
    notifications: SEED_NOTIFICATIONS,
  };
}