# Decisões

O que a banca precisa ouvir em voz alta. Cada item é uma escolha que já está no código da vitrine.

## Dois fronts, não um site com `/admin`

O complemento proíbe preço, margem e desempenho financeiro nas páginas públicas. Um único Next com rota escondida vaza por engano (link, sitemap, JS). `apps/web` e `apps/app` em hosts diferentes tornam essa fronteira visível: o visitante nem chega no código da equipe.

## Lead só se cria pelo POST

`GET` de leads na API pública listaria empresa, telefone e demanda. A superfície aberta é só criar. Consultar volta quando existir login.

## Copy no repositório, tipado, em três idiomas

Ainda não há gestão de conteúdo. Textos moram em `apps/web/src/copy/` com o mesmo formato em PT, EN e DE. Trocar idioma troca o catálogo inteiro, não um dicionário frouxo. PT é o default (`as-needed`): a URL institucional continua `/`, não `/pt`.

`localeDetection: false` — o site não empurra o navegador para EN/DE. Quem pede, escolhe.

## Foto e layout mobile-first, com intervalo de tablet

Celular esconde foto pesada onde o texto basta (intro do laboratório, lista de serviços). Tablet (`md`, 768px) ganha o split. Desktop (`lg`, 1024px) ganha o parque em 3 cards. O i18n não é o diferencial — é requisito de produto para um intercâmbio com a ZEISS.

## 404 é página do site

URL inexistente não pode cair no ecrã preto do Next. Há `not-found` no locale, catch-all `[...rest]` e fallback na raiz, com o mesmo chrome (nav, faixa, rodapé).

## Banco local em Docker; o site ainda não

O PDF não exige Docker da aplicação. O `docker-compose` em `apps/api` sobe só o Postgres, para não instalar banco na máquina. Empacotar web+api em imagem entra quando houver homologação — não para o chefe “clonar o repo”.

## O que não decidimos ainda (de propósito)

- Host de homologação (Vercel + API, Railway, VM da FIEG).
- Como a equipe *vê* o lead no dia a dia (e-mail, planilha, tela interna).
- O diferencial obrigatório da vitrine — idioma sozinho não conta; precisa de uma função que resolva um problema (checklist da peça, ensaio indicado, protocolo do pedido).
- Stack GETIN no GC: princípios de segurança sim; versões EOL não.
