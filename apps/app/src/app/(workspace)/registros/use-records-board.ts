'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { UserRole } from '@/lib/api';
import { formatBrPhone, formatCnpj, isValidBrPhone, isValidCnpj } from '@/lib/contact-fields';
import { createEmptyRecord, updateDemoState } from '@/lib/demo/demo-store';
import { canViewRecord } from '@/lib/formalized-knowledge';
import { getRecordDetailPath } from '@/lib/records-navigation';
import { useDemoStore } from '@/lib/use-demo-store';
import type { ServiceRecord, ServiceStatus } from './types';
import { countRecordsByStatus, filterRecords } from './records-utils';

const EMPTY_DRAFT = {
  company: '',
  cnpj: '',
  requester: '',
  phone: '',
  service: '',
  serviceTypeId: '',
};

export function useRecordsBoard(userRole: UserRole, userName: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { records, vocabulary } = useDemoStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'ALL' | ServiceStatus>('ALL');
  const [company, setCompany] = useState('ALL');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const registroId = searchParams.get('registro');
  const serviceTypes = vocabulary.filter((term) => term.class === 'SERVICE_TYPE' && term.active);
  const canCreate = userRole !== 'CONSULTA';

  useEffect(() => {
    if (!registroId) {
      return;
    }
    router.replace(getRecordDetailPath(registroId));
  }, [registroId, router]);

  const visibleRecords = useMemo(
    () => records.filter((record) => canViewRecord(record, userRole)),
    [records, userRole],
  );

  const companies = useMemo(
    () =>
      [...new Set(visibleRecords.map((record) => record.company))].sort((a, b) =>
        a.localeCompare(b, 'pt-BR'),
      ),
    [visibleRecords],
  );

  const statusCounts = useMemo(() => countRecordsByStatus(visibleRecords), [visibleRecords]);
  const filtered = useMemo(
    () => filterRecords(visibleRecords, query, status, company),
    [company, query, status, visibleRecords],
  );
  const filtering = Boolean(query.trim()) || status !== 'ALL' || company !== 'ALL';

  function createRecord() {
    const companyValue = draft.company.trim();
    const requesterValue = draft.requester.trim();
    const cnpjValue = draft.cnpj.trim();
    const phoneValue = draft.phone.trim();

    if (!companyValue || !requesterValue || !draft.serviceTypeId) {
      setFormError('Preencha empresa, responsável e tipo de serviço.');
      return;
    }

    if (cnpjValue && !isValidCnpj(cnpjValue)) {
      setFormError('Confira o CNPJ informado.');
      return;
    }

    if (phoneValue && !isValidBrPhone(phoneValue)) {
      setFormError('Confira o telefone informado.');
      return;
    }

    const serviceType = serviceTypes.find((term) => term.id === draft.serviceTypeId);
    const record = createEmptyRecord({
      company: companyValue,
      requester: requesterValue,
      service: serviceType?.label ?? draft.service.trim(),
      serviceTypeId: draft.serviceTypeId,
      estimatedBy: userName,
      ...(cnpjValue ? { cnpj: cnpjValue } : {}),
      ...(phoneValue ? { phone: phoneValue } : {}),
    });
    updateDemoState((state) => ({ ...state, records: [...state.records, record] }));
    setDraft(EMPTY_DRAFT);
    setFormError(null);
    setCreating(false);
    router.push(getRecordDetailPath(record.id));
  }

  function clearFilters() {
    setQuery('');
    setStatus('ALL');
    setCompany('ALL');
  }

  return {
    query,
    setQuery,
    status,
    setStatus,
    company,
    setCompany,
    creating,
    setCreating,
    formError,
    setFormError,
    draft,
    setDraft,
    formatCnpj,
    formatBrPhone,
    serviceTypes,
    canCreate,
    companies,
    statusCounts,
    filtered,
    filtering,
    createRecord,
    clearFilters,
  };
}
