export async function fetchWooCommerce(endpoint: string, options: RequestInit = {}) {
  const url = process.env.WORDPRESS_URL;
  const consumerKey = process.env.WOOCOMMERCE_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_SECRET;

  if (!url || !consumerKey || !consumerSecret) {
    throw new Error('Las credenciales de WooCommerce no están configuradas en el entorno.');
  }

  // Base64 encode the credentials for Basic Auth
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  // Construir la URL completa
  const fullUrl = new URL(`/wp-json/wc/v3/${endpoint}`, url);

  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // En mode de dashboard usualmente queremos datos frescos o revalidación, por defecto no cache
    cache: 'no-store',
    ...options,
  };

  const response = await fetch(fullUrl.toString(), defaultOptions);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error fetching WooCommerce:', response.status, errorText);
    throw new Error(`WooCommerce API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
