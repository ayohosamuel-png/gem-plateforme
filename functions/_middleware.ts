// Middleware global Cloudflare Pages Functions / Workers
export async function onRequest(context: { request: Request; next: () => Promise<Response> }) {
  const response = await context.next();
  // Sécurité headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}
