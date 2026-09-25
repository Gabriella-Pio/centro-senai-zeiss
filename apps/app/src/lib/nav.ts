import type { UserRole } from './api';

export type NavIcon =
  | 'home'
  | 'assistant'
  | 'records'
  | 'vocab'
  | 'validation'
  | 'indicators'
  | 'demo'
  | 'users'
  | 'profile'
  | 'requests'
  | 'tariffs';

export type NavGroup = 'work' | 'manage' | 'profile';

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
  group: NavGroup;
  roles: UserRole[];
  /** Sem rota ainda: aparece na lista, não navega. */
  ready?: boolean;
};

const ALL_ROLES: UserRole[] = ['CONSULTA', 'TECNICO', 'VALIDADOR', 'ADMIN'];

export const NAV_GROUPS: { id: NavGroup; label: string }[] = [
  { id: 'work', label: 'Trabalho' },
  { id: 'manage', label: 'Gestão' },
  { id: 'profile', label: 'Perfil' },
];

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Início', icon: 'home', group: 'work', roles: ALL_ROLES, ready: true },
  {
    href: '/solicitacoes',
    label: 'Solicitações',
    icon: 'requests',
    group: 'work',
    roles: ['ADMIN', 'VALIDADOR'],
    ready: true,
  },
  { href: '/registros', label: 'Registros', icon: 'records', group: 'work', roles: ALL_ROLES, ready: true },
  {
    href: '/validacao',
    label: 'Validação',
    icon: 'validation',
    group: 'work',
    roles: ['VALIDADOR', 'ADMIN'],
    ready: true,
  },
  {
    href: '/indicadores',
    label: 'Indicadores',
    icon: 'indicators',
    group: 'manage',
    roles: ALL_ROLES,
    ready: true,
  },
  // { href: '/demonstracao', label: 'Demonstração', icon: 'demo', group: 'manage', roles: ['ADMIN'] },
  { href: '/vocabulario', label: 'Vocabulário', icon: 'vocab', group: 'manage', roles: ALL_ROLES, ready: true },
  {
    href: '/tarifas',
    label: 'Tarifas',
    icon: 'tariffs',
    group: 'manage',
    roles: ALL_ROLES,
    ready: true,
  },
  {
    href: '/usuarios',
    label: 'Equipe',
    icon: 'users',
    group: 'profile',
    roles: ['ADMIN'],
    ready: true,
  },
  {
    href: '/perfil',
    label: 'Meu perfil',
    icon: 'profile',
    group: 'profile',
    roles: ALL_ROLES,
    ready: true,
  },
];

export function navForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
