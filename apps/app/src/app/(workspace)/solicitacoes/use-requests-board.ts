'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  createEmptyRecord,
  pushNotification,
  updateDemoState,
} from '@/lib/demo/demo-store';
import { extractCnpjFromMessage } from '@/lib/contact-fields';
import { patchLeadStatus, syncLeadsFromApi } from '@/lib/leads';
import { ApiError } from '@/lib/api';
import { getRecordDetailPath } from '@/lib/records-navigation';
import { archiveRequestState, convertRequestState, startRequestState } from '@/lib/request-lifecycle';
import { useDemoStore } from '@/lib/use-demo-store';
import type { QuoteRequest, RequestStatus } from './types';
import { countRequestsByStatus, filterRequests } from './requests-utils';

export function useRequestsBoard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { requests, vocabulary } = useDemoStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'ALL' | RequestStatus>('ALL');
  const [pendingClose, setPendingClose] = useState(false);
  const [convertTarget, setConvertTarget] = useState<QuoteRequest | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<QuoteRequest | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [syncingLeads, setSyncingLeads] = useState(false);

  const serviceTypes = useMemo(
    () =>
      vocabulary
        .filter((term) => term.class === 'SERVICE_TYPE' && term.active !== false)
        .map((term) => ({ id: term.id, label: term.label })),
    [vocabulary],
  );

  const solicitacaoId = searchParams.get('solicitacao');
  const statusCounts = useMemo(() => countRequestsByStatus(requests), [requests]);
  const filtered = useMemo(
    () => filterRequests(requests, query, status),
    [query, requests, status],
  );
  const selected = useMemo(() => {
    if (pendingClose || !solicitacaoId) {
      return null;
    }
    return requests.find((request) => request.id === solicitacaoId) ?? null;
  }, [pendingClose, requests, solicitacaoId]);
  const filtering = Boolean(query.trim()) || status !== 'ALL';

  useEffect(() => {
    if (!solicitacaoId) {
      setPendingClose(false);
    }
  }, [solicitacaoId]);

  const syncSolicitacaoParam = useCallback(
    (requestId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (requestId) {
        if (params.get('solicitacao') === requestId) return;
        params.set('solicitacao', requestId);
      } else {
        if (!params.has('solicitacao')) return;
        params.delete('solicitacao');
      }
      const nextQuery = params.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const refreshLeadsFromSite = useCallback(async (options?: { silent?: boolean }) => {
    setSyncingLeads(true);
    try {
      const importedCount = await syncLeadsFromApi();
      if (importedCount === 0) {
        if (!options?.silent) {
          setNotice('Nenhuma solicitação nova para importar do site.');
        }
        return importedCount;
      }
      setNotice(
        importedCount === 1
          ? '1 nova solicitação importada do site.'
          : `${importedCount} novas solicitações importadas do site.`,
      );
      return importedCount;
    } catch (error) {
      const unauthorized = error instanceof ApiError && error.status === 401;
      setNotice(
        unauthorized
          ? 'Faça login com e-mail e senha reais para importar solicitações do site.'
          : 'Não foi possível sincronizar solicitações do site. Verifique se a API está no ar.',
      );
      return 0;
    } finally {
      setSyncingLeads(false);
    }
  }, []);

  useEffect(() => {
    void refreshLeadsFromSite({ silent: true });
  }, [refreshLeadsFromSite]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        void refreshLeadsFromSite({ silent: true });
      }
    }

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshLeadsFromSite]);

  function openRequest(request: QuoteRequest) {
    setPendingClose(false);
    syncSolicitacaoParam(request.id);
  }

  function closeRequest() {
    setPendingClose(true);
    syncSolicitacaoParam(null);
  }

  function persistRequests(next: QuoteRequest[], message: string) {
    updateDemoState((state) => ({ ...state, requests: next }));
    setNotice(message);
  }

  function handleStartConvert(request: QuoteRequest) {
    if (request.status === 'NEW') {
      let updated: QuoteRequest | null = null;
      updateDemoState((state) => {
        const nextRequests = state.requests.map((item) => {
          if (item.id !== request.id) {
            return item;
          }
          updated = startRequestState(item);
          return updated;
        });
        return { ...state, requests: nextRequests };
      });
      setConvertTarget(updated ?? startRequestState(request));
      return;
    }
    setConvertTarget(request);
  }

  function handleConvert(request: QuoteRequest, serviceTypeId: string) {
    const serviceType = vocabulary.find(
      (term) => term.class === 'SERVICE_TYPE' && term.id === serviceTypeId,
    );
    if (!serviceType) {
      setNotice('Selecione um tipo de serviço válido antes de converter.');
      return;
    }

    const cnpj = extractCnpjFromMessage(request.message);
    const phone = request.phone.trim() && request.phone !== '—' ? request.phone.trim() : undefined;

    const record = createEmptyRecord({
      requestId: request.id,
      requestNumber: request.requestNumber,
      company: request.company,
      service: serviceType.label,
      requester: request.requester,
      serviceTypeId: serviceType.id,
      assumptions: `Solicitação recebida: ${request.message}`,
      ...(cnpj ? { cnpj } : {}),
      ...(phone ? { phone } : {}),
    });
    updateDemoState((state) => ({
      ...state,
      records: [...state.records, record],
      requests: state.requests.map((item) =>
        item.id === request.id ? convertRequestState(item, record) : item,
      ),
    }));
    if (request.leadId) {
      void patchLeadStatus(request.leadId, 'WON');
    }
    pushNotification({
      roles: ['TECNICO'],
      message: `Novo registro ${record.recordNumber} pronto para orçamento.`,
      href: getRecordDetailPath(record.id),
    });
    setNotice('Registro criado a partir da solicitação.');
    setConvertTarget(null);
    setPendingClose(true);
    syncSolicitacaoParam(null);
    router.push(getRecordDetailPath(record.id));
  }

  function handleArchive(request: QuoteRequest, reason: string) {
    const next = requests.map((item) =>
      item.id === request.id ? archiveRequestState(item, reason) : item,
    );
    persistRequests(next, 'Solicitação arquivada com justificativa.');
    if (request.leadId) {
      void patchLeadStatus(request.leadId, 'LOST');
    }
    setArchiveTarget(null);
    setPendingClose(true);
    syncSolicitacaoParam(null);
  }

  function clearFilters() {
    setQuery('');
    setStatus('ALL');
  }

  return {
    query,
    setQuery,
    status,
    setStatus,
    selected,
    convertTarget,
    setConvertTarget,
    archiveTarget,
    setArchiveTarget,
    notice,
    syncingLeads,
    serviceTypes,
    statusCounts,
    filtered,
    filtering,
    openRequest,
    closeRequest,
    handleStartConvert,
    handleConvert,
    handleArchive,
    refreshLeadsFromSite,
    clearFilters,
  };
}
