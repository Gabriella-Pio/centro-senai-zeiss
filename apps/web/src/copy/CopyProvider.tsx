"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getCatalog, type CopyCatalog } from "@/copy/catalog";

const CopyContext = createContext<CopyCatalog>(getCatalog("pt"));

export function CopyProvider({
  catalog,
  children,
}: {
  catalog: CopyCatalog;
  children: ReactNode;
}) {
  return <CopyContext.Provider value={catalog}>{children}</CopyContext.Provider>;
}

export function useCopy() {
  return useContext(CopyContext);
}
