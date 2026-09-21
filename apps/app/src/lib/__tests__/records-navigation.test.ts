import { describe, expect, it } from "vitest";
import {
  getRecordDetailPath,
  getRecordListHref,
  getRequestHref,
  getValidationHref,
  parseRecordBlockParam,
  setRecordBlockParam,
} from "@/lib/records-navigation";

describe("records navigation", () => {
  it("builds record detail and list hrefs", () => {
    expect(getRecordDetailPath("record-1")).toBe("/registros/record-1");
    expect(getRecordDetailPath("record-1", "B")).toBe("/registros/record-1?bloco=B");
    expect(getRecordListHref("record-1")).toBe("/registros?registro=record-1");
  });

  it("builds cross-module hrefs", () => {
    expect(getRequestHref("request-1")).toBe("/solicitacoes?solicitacao=request-1");
    expect(getValidationHref()).toBe("/validacao");
    expect(getValidationHref("record-1")).toBe("/validacao?registro=record-1");
  });

  it("parses and updates block query params", () => {
    expect(parseRecordBlockParam("A")).toBe("A");
    expect(parseRecordBlockParam("Z")).toBeNull();

    const params = new URLSearchParams("bloco=A");
    setRecordBlockParam(params, "C");
    expect(params.toString()).toBe("bloco=C");

    setRecordBlockParam(params, null);
    expect(params.toString()).toBe("");
  });
});
