import { notFound } from "next/navigation";

/** Rotas desconhecidas dentro do locale — dispara a 404 branded. */
export default function CatchAllPage() {
  notFound();
}
