export const config = {
  runtime: 'edge',
};

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:118.0) Gecko/20100101 Firefox/118.0';

export default async function handler(request) {
  const urlObj = new URL(request.url);
  const targetUrl = urlObj.searchParams.get('url');

  if (!targetUrl) {
    return new Response(
      'Missing url parameter. Example: ?url=https://s.namemc.com/i/251fb104d0f507df.png',
      {
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      }
    );
  }

  try {
    // Fetch langsung ke target url (bisa HTML, gambar, webp, gif, png, dll.)
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': '*/*',
        'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
      },
    });

    if (!response.ok) {
      return new Response(
        `Gagal mengambil data dari target. Status: ${response.status}`,
        { status: response.status }
      );
    }

    // Ambil Content-Type asli dari web target
    const contentType =
      response.headers.get('Content-Type') || 'application/octet-stream';

    // Stream langsung datanya
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (e) {
    return new Response('Proxy Error: ' + e.message, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
