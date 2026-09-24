"use client";

import Link from "next/link";
import { FlaskConical, Info } from "lucide-react";

export function RecordDemoBanner() {
  return (
    <div className="workspace-notice workspace-notice--warning workspace-notice--banner-grid record-demo-banner" role="status" aria-label="Aviso de dados mock">
      <div className="workspace-notice__icon record-demo-banner__icon" aria-hidden="true">
        <FlaskConical />
      </div>
      <div className="workspace-notice__copy record-demo-banner__copy">
        <strong>Dados mock de demonstração</strong>
        <p>
          Empresa, valores, histórico e lições deste registro vêm do catálogo demo versionado — não
          representam clientes ou contratos reais.
        </p>
      </div>
      <Link href="/demonstracao" className="workspace-notice__link record-demo-banner__link">
        <Info aria-hidden="true" />
        Sobre a demo
      </Link>
    </div>
  );
}
