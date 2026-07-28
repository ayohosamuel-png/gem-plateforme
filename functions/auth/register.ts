// Cloudflare Pages Function: POST /api/auth/register

export async function onRequestPost(context: {
  request: Request;
  env: any;
}) {
  try {
    const body = await context.request.json() as {
      nom?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    const { nom, email, password, role } = body;

    if (!nom || !email || !password || !role) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Tous les champs sont obligatoires"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await context.env.DB
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(email)
      .first();

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Cet email est déjà utilisé"
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Générer un identifiant
    const id = crypto.randomUUID();

    // À remplacer plus tard par un vrai hash (bcrypt/argon2)
    const password_hash = password;

    await context.env.DB
      .prepare(`
        INSERT INTO users
        (id, email, password_hash, full_name, role)
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        email,
        password_hash,
        nom,
        role
      )
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Inscription réussie",
        user: {
          id,
          nom,
          email,
          role
        }
      }),
      {
        status: 201,
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
