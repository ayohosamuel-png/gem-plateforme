// Cloudflare Pages Function: POST /api/auth/login
export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const body = await context.request.json() as any;
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, message: 'Email et mot de passe requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Interaction D1 Database Cloudflare
    // const user = await context.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

    return new Response(JSON.stringify({
      success: true,
      message: 'Connexion réussie via Cloudflare Worker'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
