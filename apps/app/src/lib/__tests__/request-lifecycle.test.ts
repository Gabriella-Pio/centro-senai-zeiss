import { describe, expect, it } from "vitest";
import type { QuoteRequest } from "@/app/(workspace)/solicitacoes/types";
import {
  archiveRequestState,
  assignRequest,
  canTransition,
  convertRequestState,
  getAllowedActions,
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
    expect(canTransition("NEW", "ASSIGNED")).toBe(true);
    expect(canTransition("NEW", "CONVERTED")).toBe(true);
    expect(canTransition("ASSIGNED", "CONVERTED")).toBe(true);
    expect(canTransition("ASSIGNED", "ARCHIVED")).toBe(true);
    expect(canTransition("CONVERTED", "ARCHIVED")).toBe(false);
    expect(canTransition("ARCHIVED", "ASSIGNED")).toBe(false);
  });

  it("returns contextual actions per status", () => {
    expect(getAllowedActions(createRequest())).toEqual(["assign", "convert", "archive"]);
    expect(getAllowedActions(createRequest({ status: "ASSIGNED" }))).toEqual([
      "reassign",
      "convert",
      "archive",
    ]);
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

  it("assigns responsible fields", () => {
    const assigned = assignRequest(createRequest(), "demo-sebastiao", "Sebastião");
    expect(assigned.status).toBe("ASSIGNED");
    expect(assigned.assignedToUserId).toBe("demo-sebastiao");
    expect(assigned.assignedToName).toBe("Sebastião");
  });

  it("blocks archiving converted requests", () => {
    expect(() =>
      archiveRequestState(createRequest({ status: "CONVERTED" }), "Motivo inválido"),
    ).toThrow();
  });

  it("sets linked record fields on conversion", () => {
    const converted = convertRequestState(createRequest({ status: "ASSIGNED" }), {
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

  it("upgrades legacy IN_REVIEW status to ASSIGNED", () => {
    const upgraded = upgradeQuoteRequest({
      ...createRequest(),
      status: "IN_REVIEW",
    });
    expect(upgraded.status).toBe("ASSIGNED");
  });
});
