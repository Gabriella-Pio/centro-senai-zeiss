import { describe, expect, it } from "vitest";
import type { QuoteRequest } from "@/app/(workspace)/solicitacoes/types";
import {
  archiveRequestState,
  canTransition,
  convertRequestState,
  getAllowedActions,
  startRequestState,
  upgradeQuoteRequest,
} from "@/lib/request-lifecycle";

function createRequest(overrides: Partial<QuoteRequest> = {}): QuoteRequest {
  return {
    id: "request-test",
    requestNumber: "SO-2026-0099",
    requester: "Cliente",
    company: "Empresa",
    email: "cliente@example.com",
    phone: "+55 62 99999-0000",
    service: "Inspeção dimensional",
    message: "Mensagem de teste",
    receivedAt: "2026-09-18T08:42:00.000Z",
    status: "NEW",
    ...overrides,
  };
}

describe("request lifecycle", () => {
  it("allows valid transitions and blocks terminal states", () => {
    expect(canTransition("NEW", "ON_GOING")).toBe(true);
    expect(canTransition("NEW", "ARCHIVED")).toBe(true);
    expect(canTransition("ON_GOING", "CONVERTED")).toBe(true);
    expect(canTransition("ON_GOING", "ARCHIVED")).toBe(true);
    expect(canTransition("NEW", "CONVERTED")).toBe(false);
    expect(canTransition("CONVERTED", "ARCHIVED")).toBe(false);
    expect(canTransition("ARCHIVED", "NEW")).toBe(false);
  });

  it("returns contextual actions per status", () => {
    expect(getAllowedActions(createRequest())).toEqual(["convert", "archive"]);
    expect(getAllowedActions(createRequest({ status: "ON_GOING" }))).toEqual(["convert", "archive"]);
    expect(
      getAllowedActions(
        createRequest({
          status: "CONVERTED",
          linkedRecordId: "record-1",
          linkedRecordNumber: "RS-2026-0001",
        }),
      ),
    ).toEqual(["openRecord"]);
    expect(getAllowedActions(createRequest({ status: "ARCHIVED" }))).toEqual([]);
  });

  it("moves new requests to on going when conversion starts", () => {
    const started = startRequestState(createRequest());
    expect(started.status).toBe("ON_GOING");
  });

  it("blocks archiving converted requests", () => {
    expect(() =>
      archiveRequestState(createRequest({ status: "CONVERTED" }), "Motivo inválido"),
    ).toThrow();
  });

  it("sets linked record fields on conversion", () => {
    const converted = convertRequestState(createRequest({ status: "ON_GOING" }), {
      id: "record-42",
      recordNumber: "RS-2026-0042",
      company: "Empresa",
      service: "Serviço",
      requester: "Cliente",
      createdAt: "2026-09-18T08:42:00.000Z",
      isDemo: true,
      recordKind: "single",
      partTraitIds: [],
      resourceIds: [],
      estimatedCost: null,
      proposedValue: null,
      actualHours: null,
      actualCost: null,
      billedValue: null,
      deliveredAt: null,
      rework: false,
      scopeChange: false,
      deviationCauseId: null,
      lesson: "",
      relatedTopicIds: [],
      visibility: "PUBLIC",
      quantity: 1,
      stages: [],
      serviceStatus: "DRAFT",
      lessonStatus: "DRAFT",
    });

    expect(converted.status).toBe("CONVERTED");
    expect(converted.linkedRecordId).toBe("record-42");
    expect(converted.linkedRecordNumber).toBe("RS-2026-0042");
  });

  it("upgrades legacy assigned statuses to ON_GOING and strips assignee fields", () => {
    const upgraded = upgradeQuoteRequest({
      ...createRequest(),
      status: "ASSIGNED",
      assignedToUserId: "demo-user-01",
      assignedToName: "Técnico",
    });
    expect(upgraded.status).toBe("ON_GOING");
    expect(upgraded).not.toHaveProperty("assignedToUserId");
    expect(upgraded).not.toHaveProperty("assignedToName");
  });
});
