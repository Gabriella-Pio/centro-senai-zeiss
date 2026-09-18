"use client";

import { useMemo, useSyncExternalStore, useState } from "react";
import { BookOpen, FilterX, Pencil, Plus, Search } from "lucide-react";
import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Label } from "@cem/ui";
import { DEMO_VOCABULARY_KEY } from "./demo";
import { VocabularyForm } from "./VocabularyForm";
import { VOCABULARY_CLASS_LABELS, VOCABULARY_CLASSES, type VocabularyClass, type VocabularyTerm } from "./types";
import "./vocabulary.css";

export function VocabularyBoard({ initialTerms, canEdit }: { initialTerms: VocabularyTerm[]; canEdit: boolean }) {
  const storedTerms = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("cem-demo-vocabulary-changed", onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("cem-demo-vocabulary-changed", onStoreChange);
      };
    },
    () => window.localStorage.getItem(DEMO_VOCABULARY_KEY) ?? "",
    () => "",
  );
  const terms = useMemo(() => {
    if (!storedTerms) return initialTerms;
    try { return JSON.parse(storedTerms) as VocabularyTerm[]; } catch { return initialTerms; }
  }, [initialTerms, storedTerms]);
  const [query, setQuery] = useState("");
  const [termClass, setTermClass] = useState<"ALL" | VocabularyClass>("ALL");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [editing, setEditing] = useState<VocabularyTerm | null>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return terms.filter((term) => {
      if (termClass !== "ALL" && term.class !== termClass) return false;
      if (status === "ACTIVE" && !term.active) return false;
      if (status === "INACTIVE" && term.active) return false;
      return !needle || term.label.toLowerCase().includes(needle) || term.guidance.toLowerCase().includes(needle);
    });
  }, [query, status, termClass, terms]);

  const filtering = Boolean(query.trim()) || termClass !== "ALL" || status !== "ALL";
  const activeCount = terms.filter((term) => term.active).length;

  function saveTerms(nextTerms: VocabularyTerm[], message: string) {
    window.localStorage.setItem(DEMO_VOCABULARY_KEY, JSON.stringify(nextTerms));
    window.dispatchEvent(new Event("cem-demo-vocabulary-changed"));
    setNotice(message);
    setCreating(false);
    setEditing(null);
  }

  function clearFilters() {
    setQuery("");
    setTermClass("ALL");
    setStatus("ALL");
  }

  function toggleActive(term: VocabularyTerm) {
    saveTerms(terms.map((item) => item.id === term.id ? { ...item, active: !item.active, updatedAt: new Date().toISOString() } : item), term.active ? "Termo desativado." : "Termo ativado.");
  }

  return (
    <main className="vocabulary-page">
      <header className="vocabulary-page__header">
        <div>
          <p className="vocabulary-page__eyebrow"><BookOpen aria-hidden="true" /> Base de conhecimento</p>
          <h1 className="vocabulary-page__title">Vocabulário</h1>
          <p className="vocabulary-page__intro">Organize os termos usados pela equipe para registrar e descrever os casos do laboratório.</p>
        </div>
        {canEdit ? <Button type="button" size="lg" onClick={() => setCreating(true)}><Plus aria-hidden="true" /> Novo termo</Button> : null}
      </header>

      <div className="vocabulary-page__summary">
        <div><strong>{terms.length}</strong><span>termos cadastrados</span></div>
        <div><strong>{activeCount}</strong><span>ativos para uso</span></div>
        <p>Dados da demonstração</p>
      </div>

      <section className="vocabulary-page__content" aria-labelledby="vocabulary-list-heading">
        <div className="vocabulary-page__toolbar">
          <div className="vocabulary-page__search"><Search aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar termo ou orientação" aria-label="Pesquisar termo ou orientação" className="h-12 pl-10 text-base" /></div>
          <div><Label htmlFor="vocabulary-class-filter" className="sr-only">Filtrar por classe</Label><select id="vocabulary-class-filter" value={termClass} onChange={(event) => setTermClass(event.target.value as "ALL" | VocabularyClass)} className="h-12 w-full rounded-(--radius) border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"><option value="ALL">Todas as classes</option>{VOCABULARY_CLASSES.map((value) => <option key={value} value={value}>{VOCABULARY_CLASS_LABELS[value]}</option>)}</select></div>
          <div><Label htmlFor="vocabulary-status-filter" className="sr-only">Filtrar por situação</Label><select id="vocabulary-status-filter" value={status} onChange={(event) => setStatus(event.target.value as "ALL" | "ACTIVE" | "INACTIVE")} className="h-12 w-full rounded-(--radius) border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"><option value="ALL">Todas as situações</option><option value="ACTIVE">Ativos</option><option value="INACTIVE">Inativos</option></select></div>
          {filtering ? <Button type="button" variant="ghost" size="sm" onClick={clearFilters}><FilterX aria-hidden="true" /> Limpar</Button> : <p className="vocabulary-page__count">{filtered.length} termos</p>}
        </div>

        {notice ? <p className="vocabulary-page__notice" role="status">{notice}</p> : null}
        <h2 id="vocabulary-list-heading" className="sr-only">Termos do vocabulário</h2>
        <div className="vocabulary-page__table-wrap">
          {filtered.length === 0 ? <div className="vocabulary-page__empty"><FilterX aria-hidden="true" /><p>Nenhum termo encontrado com esses filtros.</p>{filtering ? <Button type="button" variant="outline" onClick={clearFilters}>Limpar filtros</Button> : null}</div> : <table className="vocabulary-page__table"><thead><tr><th>Termo</th><th>Classe</th><th>Situação</th><th className="vocabulary-page__actions-heading">Ações</th></tr></thead><tbody>{filtered.map((term) => <tr key={term.id}><td><strong>{term.label}</strong><span>{term.guidance || "Sem orientação de uso"}</span></td><td><Badge variant="outline">{VOCABULARY_CLASS_LABELS[term.class]}</Badge></td><td><span className={term.active ? "vocabulary-status vocabulary-status--active" : "vocabulary-status vocabulary-status--inactive"}>{term.active ? "Ativo" : "Inativo"}</span></td><td className="vocabulary-page__actions"><Button type="button" variant="ghost" size="icon-sm" title={`Editar ${term.label}`} onClick={() => setEditing(term)}><Pencil aria-hidden="true" /><span className="sr-only">Editar {term.label}</span></Button>{canEdit ? <Button type="button" variant="ghost" size="sm" onClick={() => toggleActive(term)}>{term.active ? "Desativar" : "Ativar"}</Button> : null}</td></tr>)}</tbody></table>}
        </div>
      </section>

      <Dialog open={creating || editing !== null} onOpenChange={(open) => { if (!open) { setCreating(false); setEditing(null); } }}>
        <DialogContent className="max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-xl"><DialogHeader><DialogTitle className="text-xl font-semibold">{editing ? "Editar termo" : "Novo termo"}</DialogTitle><DialogDescription className="text-base text-muted-foreground">Use classes consistentes para que o vocabulário ajude nos próximos registros.</DialogDescription></DialogHeader><VocabularyForm term={editing ?? undefined} onCancel={() => { setCreating(false); setEditing(null); }} onSave={(saved) => saveTerms(editing ? terms.map((term) => term.id === saved.id ? saved : term) : [...terms, saved], editing ? "Termo atualizado." : "Termo criado com sucesso.")} /></DialogContent>
      </Dialog>
    </main>
  );
}
