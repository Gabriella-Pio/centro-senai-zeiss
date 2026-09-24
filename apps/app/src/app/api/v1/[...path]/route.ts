import { cookies } from 'next/headers';

const API_ORIGIN = (process.env.API_PROXY_URL ?? 'http://localhost:3333').replace(/\/$/, '');

async function proxyRequest(request: Request, pathSegments: string[]) {
  const url = new URL(request.url);
  const target = `${API_ORIGIN}/api/v1/${pathSegments.join('/')}${url.search}`;

  const headers = new Headers();
  const accept = request.headers.get('accept');
  const contentType = request.headers.get('content-type');
  if (accept) headers.set('Accept', accept);
  if (contentType) headers.set('Content-Type', contentType);

  const cookieStore = await cookies();
  const session = cookieStore.get('cem_session');
  if (session?.value) {
    headers.set('Cookie', `cem_session=${session.value}`);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  const upstream = await fetch(target, init);
  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get('content-type');
  if (upstreamContentType) {
    responseHeaders.set('Content-Type', upstreamContentType);
  }

  for (const cookie of upstream.headers.getSetCookie?.() ?? []) {
    responseHeaders.append('Set-Cookie', cookie);
  }

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: responseHeaders,
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}
