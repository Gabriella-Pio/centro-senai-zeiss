import { describe, expect, it } from "vitest";
import { fromDateInputValue, toDateInputValue } from "@/app/(workspace)/registros/records-utils";

describe("records utils", () => {
  it("converts deliveredAt between ISO and date input", () => {
    const iso = "2026-08-15T12:00:00.000Z";
    expect(toDateInputValue(iso)).toBe("2026-08-15");
    expect(fromDateInputValue("2026-08-15")).toBe(iso);
    expect(toDateInputValue(null)).toBe("");
    expect(fromDateInputValue("")).toBeNull();
  });
});
