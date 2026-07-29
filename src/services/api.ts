export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("imhotep_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Le serveur n'a pas renvoyé une réponse JSON valide (HTTP ${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `Erreur HTTP ${response.status}`
    );
  }

  if (data.success === false) {
    throw new Error(
      data.message || "Une erreur est survenue."
    );
  }

  return data as T;
}
