"use client";

import { useMemo, useSyncExternalStore } from "react";
import { readDemoState, subscribeDemoStore } from "./demo-store";
import type { DemoState } from "./demo-store-types";

export function useDemoStore(): DemoState {
  const snapshot = useSyncExternalStore(subscribeDemoStore, () => JSON.stringify(readDemoState()), () => "");
  return useMemo(() => {
    if (!snapshot) {
      return readDemoState();
    }
    try {
      return JSON.parse(snapshot) as DemoState;
    } catch {
      return readDemoState();
    }
  }, [snapshot]);
}
