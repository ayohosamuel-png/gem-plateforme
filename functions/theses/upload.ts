 // Cloudflare Pages Function: POST /api/theses/upload
 // Upload PDF vers R2 + enregistrement dans D1

export async function onRequestPost(context: {
  request: Request;
  env: any;
}) {
  try {
    const formData = await context.request.formData();

    const file = formData.get("file") as File | null;

    const title = formData.get("title") as string;
    const abstract = formData.get("abstract") as string;
    const filiere = formData.get("filiere") as string;
    const academicYear = formData.get("academicYear") as string;
    const studentId = formData.get("studentId") as string;
    const studentName = formData.get("studentName") as string;
    const supervisorId = formData.get("supervisorId") as string;
    const supervisorName = formData.get("supervisorName") as string;

    if (!file) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Aucun fichier PDF fourni."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    if (file.type !== "application/pdf") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Seuls les fichiers PDF sont autorisés."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const maxSize = 25 * 1024 * 1024;

    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Le fichier dépasse 25 Mo."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }


    const thesisId = crypto.randomUUID();

    const fileName = `${thesisId}-${file.name}`;


    // Envoi vers Cloudflare R2
    await context.env.BUCKET_MEMOIRES.put(
      fileName,
      await file.arrayBuffer(),
      {
        httpMetadata: {
          contentType: "application/pdf"
        }
      }
    );


    const pdfUrl = `/memoires/${fileName}`;


    // Enregistrement D1
    await context.env.DB
      .prepare(`
        INSERT INTO theses (
          id,
          title,
          abstract,
          keywords,
          filiere,
          academic_year,
          student_id,
          student_name,
          university,
          supervisor_id,
          supervisor_name,
          pdf_url,
          pdf_file_name,
          pdf_size_mb
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        thesisId,
        title || "Sans titre",
        abstract || "",
        "[]",
        filiere || "",
        academicYear || "",
        studentId,
        studentName,
        "Université d'Abomey-Calavi (UAC)",
        supervisorId,
        supervisorName,
        pdfUrl,
        fileName,
        file.size / 1024 / 1024
      )
      .run();


    return new Response(
      JSON.stringify({
        success: true,
        message: "Mémoire envoyé avec succès.",
        thesisId,
        fileName
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );


  } catch (err: any) {

    console.error("UPLOAD ERROR:", err);

    return new Response(
      JSON.stringify({
        success: false,
        message: err.message || "Erreur serveur."
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
