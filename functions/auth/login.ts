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

    /*
      Connexion future avec Cloudflare D1

      Exemple :
      const user = await context.env.DB
        .prepare("SELECT * FROM utilisateur WHERE email = ?")
        .bind(email)
        .first();

      Vérification du mot de passe ici
    */


    // Réponse temporaire de test
    return new Response(
      JSON.stringify({
        success: true,
        message: "Connexion réussie",
        user: {
          email: email
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
