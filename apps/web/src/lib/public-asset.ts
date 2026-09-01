/** Incremente ao substituir arquivos em public/ com o mesmo nome — evita cache do Next/Image. */
export const ASSET_VERSION = "2025090113";

/** Anexa versão à URL estática para invalidar cache do otimizador de imagens. */
export function publicAsset(path: string): string {
  if (!path.startsWith("/")) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${ASSET_VERSION}`;
}
