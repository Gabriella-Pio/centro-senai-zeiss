export interface NavLink {
  label: string;
  href: string;
}

// Links institucionais fixos da Navbar/Footer. A lista de serviços NÃO fica
// aqui — vive em data/home-content.ts (services), que já é a fonte usada
// pelo catálogo e pelas páginas de detalhe, evitando duas listas divergentes.
export const institutionalLinks: NavLink[] = [
  { label: "Institucional", href: "/institutional" },
  { label: "Orçamento", href: "/quote" },
  { label: "Contato", href: "/contact" },
];
