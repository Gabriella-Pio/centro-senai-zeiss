import type { QuoteRequest } from '@/app/(workspace)/solicitacoes/types';
import { apiRequest, ensureApiSession } from './api';
import { DEMO_MODE } from './demo/demo';
import { nextRequestNumber, pushNotification, updateDemoState } from './demo/demo-store';

export type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'CONTACTED' | 'WON' | 'LOST';

export type ApiLead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  service: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
};

const IMPORTABLE_LEAD_STATUSES = new Set<LeadStatus>(['NEW', 'IN_PROGRESS', 'CONTACTED']);

export function extractServiceLabelFromLead(message: string, serviceIds: string | null): string {
  const match = message.match(/^Serviços:\s*(.+)$/m);
  if (match?.[1]?.trim()) {
    return match[1].trim();
  }

  if (serviceIds?.trim()) {
    return serviceIds
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .join(', ');
  }

  return 'Serviço não informado';
}

export function mapLeadToQuoteRequest(lead: ApiLead, requestNumber: string): QuoteRequest {
  return {
    id: `lead-${lead.id}`,
    leadId: lead.id,
    requestNumber,
    requester: lead.name,
    company: lead.company?.trim() || '—',
    email: lead.email,
    phone: lead.phone?.trim() || '—',
    service: extractServiceLabelFromLead(lead.message, lead.service),
    message: lead.message,
    receivedAt: lead.createdAt,
    status: 'NEW',
  };
}

export function mergeLeadsIntoRequests(
  leads: ApiLead[],
  existingRequests: QuoteRequest[],
): { requests: QuoteRequest[]; importedCount: number } {
  const existingLeadIds = new Set(
    existingRequests.flatMap((request) => (request.leadId ? [request.leadId] : [])),
  );

  const toImport = leads.filter(
    (lead) => !existingLeadIds.has(lead.id) && IMPORTABLE_LEAD_STATUSES.has(lead.status),
  );

  if (toImport.length === 0) {
    return { requests: existingRequests, importedCount: 0 };
  }

  let nextRequests = [...existingRequests];
  for (const lead of toImport) {
    const requestNumber = nextRequestNumber(nextRequests);
    nextRequests = [mapLeadToQuoteRequest(lead, requestNumber), ...nextRequests];
  }

  return { requests: nextRequests, importedCount: toImport.length };
}

export async function patchLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
  try {
    if (DEMO_MODE) {
      await ensureApiSession();
    }
    await apiRequest<ApiLead>(`leads/${leadId}`, {
      method: 'PATCH',
      body: { status },
    });
  } catch {
    // Falha de sincronização não bloqueia o fluxo interno.
  }
}

export async function syncLeadsFromApi(): Promise<number> {
  await ensureApiSession();
  const leads = await apiRequest<ApiLead[]>('leads');
  let importedCount = 0;

  updateDemoState((state) => {
    const merged = mergeLeadsIntoRequests(leads, state.requests);
    importedCount = merged.importedCount;
    if (importedCount === 0) {
      return state;
    }
    return { ...state, requests: merged.requests };
  });

  if (importedCount > 0) {
    pushNotification({
      roles: ['ADMIN', 'VALIDADOR'],
      message:
        importedCount === 1
          ? 'Nova solicitação de orçamento recebida pelo site.'
          : `${importedCount} novas solicitações de orçamento recebidas pelo site.`,
      href: '/solicitacoes',
    });
  }

  return importedCount;
}
