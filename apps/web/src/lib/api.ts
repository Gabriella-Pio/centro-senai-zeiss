export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return response.text();
  }

  return response.json();
}

export async function apiRequest<T>(
  path: string,
  { body, headers, ...options }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`/api/v1/${path.replace(/^\//, '')}`, {
    ...options,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
  });
  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody
        ? String(responseBody.message)
        : 'Não foi possível concluir a solicitação.';

    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody as T;
}
