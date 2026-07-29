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

    // Vérification des champs obligatoires
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

    // Vérifier si l'utilisateur existe déjà
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

    // Génération de l'identifiant
    const id = crypto.randomUUID();

    // À remplacer par un vrai hachage (bcrypt/argon2) en production
    const password_hash = password;

    // Enregistrement dans D1
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

    // Jeton temporaire (à remplacer plus tard par un vrai JWT)
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
    console.error(err);

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
