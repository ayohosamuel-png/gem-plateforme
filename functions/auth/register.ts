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

    // Vérification des champs obligatoires
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

    /*
      Connexion future avec Cloudflare D1

      Exemple :

      await context.env.DB.prepare(
        `INSERT INTO utilisateur
        (nom, email, password, role)
        VALUES (?, ?, ?, ?)`
      )
      .bind(
        nom,
        email,
        password,
        role
      )
      .run();

    */


    // Réponse temporaire de test
    return new Response(
      JSON.stringify({
        success: true,
        message: "Inscription réussie",
        user: {
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
