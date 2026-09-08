import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const requestUrl = new URL(req.url);
  const query = (requestUrl.searchParams.get('q') ?? '').trim();
  if (query.length < 2 || query.length > 60) {
    return new Response(JSON.stringify({ items: [] }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const apiKey = Deno.env.get('MFDS_API_KEY');
  if (!apiKey) {
    console.error('MFDS_API_KEY is not configured');
    return new Response(JSON.stringify({ error: 'Service not configured' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const upstream = `https://openapi.foodsafetykorea.go.kr/api/${encodeURIComponent(apiKey)}/I2790/json/1/10/DESC_KOR=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(upstream, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`MFDS upstream returned ${response.status}`);
    }

    const raw = await response.json();
    const items = Array.isArray(raw?.I2790?.row) ? raw.I2790.row : [];

    return new Response(JSON.stringify({ items }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    console.error('MFDS proxy error', error);
    return new Response(JSON.stringify({ error: 'Upstream request failed', items: [] }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
