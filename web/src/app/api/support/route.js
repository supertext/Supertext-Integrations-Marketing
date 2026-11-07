const FIELDS = ['platform', 'requestedSystem', 'attachmentsPublic', 'kind', 'subject', 'message', 'systemVersion', 'pluginVersion', 'name', 'company', 'email', 'locale', 'website', 'elapsedMs', 'turnstileToken'];

/**
 * Forwards a support request to the CMS, server-side with the shared token, together with the
 * visitor's address (for the CMS's rate limit). Returns { reference, issueUrl } or { error, code }.
 */
export async function POST(request) {
  const base = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
  // JSON, or multipart form data with up to 5 attachments (passed on as they are; the CMS checks them).
  const multipart = (request.headers.get('content-type') || '').startsWith('multipart/form-data');
  if (Number(request.headers.get('content-length') || 0) > 30 * 1024 * 1024) return Response.json({ code: 'files' }, { status: 413 });
  let body;
  try {
    if (multipart) {
      const form = await request.formData();
      body = new FormData();
      for (const k of FIELDS) if (form.get(k) != null && typeof form.get(k) === 'string') body.set(k, form.get(k));
      for (const f of form.getAll('attachments').slice(0, 5)) if (f && typeof f === 'object' && f.size > 0) body.append('attachments', f, f.name);
    } else {
      const input = await request.json();
      body = JSON.stringify(Object.fromEntries(FIELDS.filter((k) => input[k] !== undefined).map((k) => [k, input[k]])));
    }
  } catch {
    return Response.json({ code: 'invalid' }, { status: 400 });
  }
  const ip = (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '').split(',')[0].trim();
  try {
    const res = await fetch(`${base}/api/support/requests`, {
      method: 'POST',
      headers: {
        ...(!multipart && { 'Content-Type': 'application/json' }),
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        ...(ip && { 'X-Visitor-IP': ip }),
      },
      body,
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(res.ok ? { reference: data.reference, issueUrl: data.issueUrl } : { code: data.code || 'unavailable' }, { status: res.status });
  } catch {
    return Response.json({ code: 'unavailable' }, { status: 502 });
  }
}
