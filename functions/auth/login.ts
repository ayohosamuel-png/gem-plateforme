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

    // Vérification des champs obligatoires
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email et mot de passe requis"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Recherche de l'utilisateur
    const user = await context.env.DB
      .prepare(`
        SELECT
          id,
          email,
          password_hash,
          full_name,
          role,
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
          message: "Email ou mot de passe incorrect"
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Vérification du mot de passe
    if (user.password_hash !== password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email ou mot de passe incorrect"
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Vérification du statut du compte
    if (user.status !== "active") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Votre compte est désactivé"
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Connexion réussie",
        user: {
          id: user.id,
          nom: user.full_name,
          email: user.email,
          role: user.role
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Erreur serveur"
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
