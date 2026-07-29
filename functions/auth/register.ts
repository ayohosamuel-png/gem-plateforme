// Cloudflare Pages Function: POST /api/auth/register

export async function onRequestPost(context: {
  request: Request;
  env: any;
}) {
  try {
    const body = await context.request.json() as {
      fullName?: string;
      email?: string;
      password?: string;
      role?: string;
      university?: string;
      filiere?: string;
      niveau?: string;
      matricule?: string;
      phone?: string;
    };

    const {
      fullName,
      email,
      password,
      role,
      university,
      filiere,
      niveau,
      matricule,
      phone
    } = body;

    if (!fullName || !email || !password || !role) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Tous les champs obligatoires doivent être renseignés."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const existingUser = await context.env.DB
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(email)
      .first();

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Cet email est déjà utilisé."
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const id = crypto.randomUUID();

    // À remplacer par bcrypt/argon2 plus tard
    const password_hash = password;

    await context.env.DB
      .prepare(`
        INSERT INTO users (
          id,
          email,
          password_hash,
          full_name,
          role,
          university,
          filiere,
          niveau,
          matricule,
          phone
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        email,
        password_hash,
        fullName,
        role,
        university ?? "Université d'Abomey-Calavi (UAC)",
        filiere ?? null,
        niveau ?? null,
        matricule ?? null,
        phone ?? null
      )
      .run();

    const token = crypto.randomUUID();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Inscription réussie.",
        token,
        user: {
          id,
          fullName,
          email,
          role,
          university,
          filiere,
          niveau,
          matricule,
          phone
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
    console.error("REGISTER ERROR:", err);

    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Erreur interne du serveur."
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
