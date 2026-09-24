import { describe, expect, it } from "vitest";
import type { QuoteRequest } from "@/app/(workspace)/solicitacoes/types";
import {
  extractServiceLabelFromLead,
  mapLeadToQuoteRequest,
  mergeLeadsIntoRequests,
  type ApiLead,
} from "@/lib/leads";

function createLead(overrides: Partial<ApiLead> = {}): ApiLead {
  return {
    id: "lead-abc",
    name: "Maria Souza",
    email: "maria@empresa.example",
    company: "Empresa Beta",
    phone: "+55 62 99999-1111",
    service: "controle-qualidade-dimensional,cad-engenharia",
    message: [
      "CNPJ: 12.345.678/0001-90",
      "Serviços: Metrologia dimensional, CAD",
      "Precisamos de orçamento para 20 peças.",
    ].join("\n"),
    status: "NEW",
    createdAt: "2026-09-24T12:00:00.000Z",
    updatedAt: "2026-09-24T12:00:00.000Z",
    ...overrides,
  };
}

function createRequest(overrides: Partial<QuoteRequest> = {}): QuoteRequest {
  return {
    id: "request-seed",
    requestNumber: "SO-2026-0001",
    requester: "Cliente seed",
    company: "Seed Co",
    email: "seed@example.com",
    phone: "+55 62 99999-0000",
    service: "Serviço seed",
    message: "Mensagem seed",
    receivedAt: "2026-09-18T08:42:00.000Z",
    status: "ON_GOING",
    ...overrides,
  };
}

describe("leads sync", () => {
  it("extracts readable service labels from lead message", () => {
    const lead = createLead();
    expect(extractServiceLabelFromLead(lead.message, lead.service)).toBe(
      "Metrologia dimensional, CAD",
    );
  });

  it("falls back to service ids when message has no service line", () => {
    expect(
      extractServiceLabelFromLead("Precisamos de orçamento.", "cad-engenharia,scan-3d"),
    ).toBe("cad-engenharia, scan-3d");
  });

  it("maps lead fields into a quote request", () => {
    const mapped = mapLeadToQuoteRequest(createLead(), "SO-2026-0099");
    expect(mapped).toMatchObject({
      id: "lead-lead-abc",
      leadId: "lead-abc",
      requestNumber: "SO-2026-0099",
      requester: "Maria Souza",
      company: "Empresa Beta",
      email: "maria@empresa.example",
      phone: "+55 62 99999-1111",
      service: "Metrologia dimensional, CAD",
      status: "NEW",
    });
  });

  it("imports only new active leads and keeps existing requests", () => {
    const existing = [
      createRequest({ leadId: "lead-existing", id: "lead-lead-existing" }),
      createRequest({ id: "request-seed-2", requestNumber: "SO-2026-0002" }),
    ];
    const leads = [
      createLead({ id: "lead-existing", status: "NEW" }),
      createLead({ id: "lead-new", status: "NEW" }),
      createLead({ id: "lead-won", status: "WON" }),
    ];

    const merged = mergeLeadsIntoRequests(leads, existing);

    expect(merged.importedCount).toBe(1);
    expect(merged.requests).toHaveLength(3);
    expect(merged.requests[0]?.leadId).toBe("lead-new");
    expect(merged.requests.some((request) => request.leadId === "lead-won")).toBe(false);
  });
});
