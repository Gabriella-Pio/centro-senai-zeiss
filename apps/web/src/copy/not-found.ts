import type { CtaCopy } from "@/copy/types";

export const notFoundCopy = {
  eyebrow: "Página não encontrada",
  code: "404",
  title: "Não encontramos esta página",
  description:
    "Esse endereço não existe no site. Volte ao início ou escolha um serviço.",
  homeCta: { label: "Ir para o início", href: "/" } satisfies CtaCopy,
};
