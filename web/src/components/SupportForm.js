'use client';

import { useEffect, useRef, useState } from 'react';
import { format } from '@/lib/i18n';

const KINDS = ['question', 'bug', 'feature', 'request'];
const CATEGORIES = ['cms', 'pim', 'ecommerce', 'email', 'design', 'docs', 'support', 'pm', 'code', 'automation', 'language', 'analytics', 'ai'];
const OTHER = '__other';
const ERRORS = { invalid: 'errInvalid', rateLimit: 'errRateLimit', captcha: 'errCaptcha', tooShort: 'errTooShort', email: 'errEmail', system: 'errSystem', files: 'errFiles', tooLarge: 'errFiles' };
// Same limits as the CMS: up to 5 files of 5 MB, images, PDF and text files.
const FILE_ACCEPT = '.png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.log,.csv,.json,.xml,.xlf,.xliff,.html';
const MAX_FILES = 5;
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * The support form. Posts to /api/support (which forwards to the CMS) and shows the reference.
 * "Request a plugin" asks only for the system (from the list of systems without a plugin, or typed
 * in), an optional description and the email address.
 */
export default function SupportForm({ locale, t, platforms, requestable = [], initialKind = 'question', initialPlatform, turnstileSiteKey }) {
  const started = useRef(Date.now());
  const captcha = useRef(null);
  const [state, setState] = useState({ status: 'idle' });
  const [kind, setKind] = useState(initialKind);
  const request = kind === 'request';
  const pluginPlatform = platforms.some((p) => p.slug === initialPlatform) ? initialPlatform : '';
  const requestPlatform = requestable.some((p) => p.slug === initialPlatform) ? initialPlatform : '';
  const [requested, setRequested] = useState(requestPlatform || (requestable.length ? '' : OTHER));

  // Cloudflare Turnstile, only when a site key is configured.
  useEffect(() => {
    if (!turnstileSiteKey || document.getElementById('cf-turnstile')) return;
    const script = document.createElement('script');
    script.id = 'cf-turnstile';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    document.head.appendChild(script);
  }, [turnstileSiteKey]);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get('platform') === OTHER) form.set('platform', '');
    const files = form.getAll('attachments').filter((f) => f && f.size > 0);
    form.delete('attachments');
    if (files.length > MAX_FILES || files.some((f) => f.size > MAX_BYTES)) {
      setState({ status: 'error', message: t.errFiles });
      return;
    }
    for (const f of files) form.append('attachments', f, f.name);
    form.set('locale', locale);
    form.set('elapsedMs', String(Date.now() - started.current));
    if (form.get('cf-turnstile-response')) form.set('turnstileToken', form.get('cf-turnstile-response'));
    form.delete('cf-turnstile-response');
    setState({ status: 'sending' });
    try {
      // Multipart, so screenshots and files go along.
      const res = await fetch('/api/support', { method: 'POST', body: form });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error('failed'), { code: body.code });
      setState({ status: 'sent', reference: body.reference, issueUrl: body.issueUrl, request });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setState({ status: 'error', message: t[ERRORS[error.code]] || t.errUnavailable });
      if (window.turnstile && captcha.current) window.turnstile.reset(captcha.current);
    }
  }

  if (state.status === 'sent') {
    return (
      <div className="card support-done" role="status">
        <h2>{t.sentTitle}</h2>
        <p>{format(t, state.request ? 'requestSentText' : 'sentText', { ref: state.reference })}</p>
        {state.issueUrl && (
          <p><a className="btn btn-secondary" href={state.issueUrl} target="_blank" rel="noopener">{t.sentIssue}</a></p>
        )}
      </div>
    );
  }

  return (
    <form className="card support-form" onSubmit={submit}>
      <fieldset>
        <legend>{t.fKind}</legend>
        <div className="kind-options">
          {KINDS.map((k) => (
            <label key={k} className="kind">
              <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} />
              <span>{t[`kind${k[0].toUpperCase()}${k.slice(1)}`]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {request ? (
        <>
          <label>
            <span>{t.fRequestSystem}</span>
            <select name="platform" value={requested} onChange={(e) => setRequested(e.target.value)} required>
              <option value="" disabled>…</option>
              {CATEGORIES.map((c) => {
                const list = requestable.filter((p) => p.category === c);
                return list.length ? (
                  <optgroup key={c} label={t[`category_${c}`]}>
                    {list.map((p) => <option key={p.slug} value={p.slug}>{p.system}</option>)}
                  </optgroup>
                ) : null;
              })}
              <option value={OTHER}>{t.fRequestOtherOption}</option>
            </select>
          </label>
          {requested === OTHER && (
            <label>
              <span>{t.fRequestName}</span>
              <input name="requestedSystem" required minLength={2} maxLength={80} />
            </label>
          )}
        </>
      ) : (
        <label>
          <span>{t.fPlatform}</span>
          <select name="platform" defaultValue={pluginPlatform}>
            {platforms.map((p) => <option key={p.slug} value={p.slug}>{p.system}</option>)}
            <option value="">{t.fPlatformOther}</option>
          </select>
        </label>
      )}

      {request ? (
        <label>
          <span>{t.fRequestMessage}</span>
          <textarea name="message" maxLength={10000} rows={4} aria-describedby="message-help" />
          <small id="message-help">{t.fRequestMessageHelp}</small>
        </label>
      ) : (
        <>
          <label>
            <span>{t.fSubject}</span>
            <input name="subject" required minLength={5} maxLength={140} />
          </label>

          <label>
            <span>{t.fMessage}</span>
            <textarea name="message" required minLength={20} maxLength={10000} rows={8} aria-describedby="message-help" />
            <small id="message-help">{t.fMessageHelp}</small>
          </label>

          <div className="form-row">
            <label><span>{t.fSystemVersion}</span><input name="systemVersion" maxLength={100} /></label>
            <label><span>{t.fPluginVersion}</span><input name="pluginVersion" maxLength={100} /></label>
          </div>
        </>
      )}

      <div className="form-row">
        <label><span>{t.fName}</span><input name="name" maxLength={120} autoComplete="name" /></label>
        <label><span>{t.fCompany}</span><input name="company" maxLength={120} autoComplete="organization" /></label>
      </div>

      <label>
        <span>{t.fEmail}</span>
        <input name="email" type="email" required maxLength={254} autoComplete="email" aria-describedby="email-help" />
        <small id="email-help">{t.fEmailHelp}</small>
      </label>

      {!request && (
        <fieldset className="attachments">
          <label>
            <span>{t.fAttachments}</span>
            <input type="file" name="attachments" multiple accept={FILE_ACCEPT} aria-describedby="files-help" />
            <small id="files-help">{t.fAttachmentsHelp}</small>
          </label>
          <label className="check">
            <input type="checkbox" name="attachmentsPublic" value="true" />
            <span>{t.fAttachmentsPublic}</span>
          </label>
        </fieldset>
      )}

      {/* Left empty by people; bots fill it in. */}
      <label className="hp" aria-hidden="true">
        Website <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <p className="support-note">{request ? t.requestNote : t.supportPublicNote}</p>

      {turnstileSiteKey && <div ref={captcha} className="cf-turnstile" data-sitekey={turnstileSiteKey} data-language={locale} />}

      {state.status === 'error' && <p className="error" role="alert">{state.message}</p>}

      <button className="btn btn-primary" type="submit" disabled={state.status === 'sending'}>
        {state.status === 'sending' ? t.sending : request ? t.sendRequest : t.send}
      </button>
    </form>
  );
}
