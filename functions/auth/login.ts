// functions/auth/login.ts
// Cloudflare Pages Function: POST /api/auth/login

export async function onRequestPost(context: {
  request: Request;
  env: any;
}) {
  try {
    const body = await context.request.json() as {
      email?: string;
      password?: string;
    };

    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email et mot de passe requis."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }


    const user = await context.env.DB
      .prepare(`
        SELECT
          id,
          email,
          password_hash,
          full_name,
          role,
          university,
          filiere,
          niveau,
          matricule,
          phone,
          status
        FROM users
        WHERE email = ?
      `)
      .bind(email)
      .first();


    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email ou mot de passe incorrect."
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }


    // TEMPORAIRE :
    // comparaison simple pour test D1
    // À remplacer plus tard par bcrypt
    if (user.password_hash !== password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email ou mot de passe incorrect."
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }


    if (user.status !== "active") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Compte désactivé."
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }


    const token = crypto.randomUUID();


    return new Response(
      JSON.stringify({
        success: true,
        message: "Connexion réussie.",
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          university: user.university,
          filiere: user.filiere,
          niveau: user.niveau,
          matricule: user.matricule,
          phone: user.phone
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );


  } catch (error: any) {

    console.error(error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Erreur serveur."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
  }
