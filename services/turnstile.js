/**
 * Cloudflare Turnstile verification for the public forms (contact + seminar sign-up).
 * The widget in the browser hands each visitor a single-use token; this confirms it
 * with Cloudflare before anything is emailed.
 *
 * The secret comes from the TURNSTILE_SECRET_KEY config var. Outside production,
 * Cloudflare's always-pass test secret stands in when none is set, so local
 * development needs no setup. In production a missing secret fails closed — every
 * submission is rejected and the error is logged — rather than letting spam through.
 */
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TEST_SECRET = '1x0000000000000000000000000000000AA';

function getSecret() {
    if (process.env.TURNSTILE_SECRET_KEY) return process.env.TURNSTILE_SECRET_KEY;
    return process.env.NODE_ENV === 'production' ? null : TEST_SECRET;
}

/**
 * Resolves true only when Cloudflare confirms the token. Never rejects: a network
 * failure or bad response counts as unverified.
 */
async function verifyTurnstile(token) {
    const secret = getSecret();
    if (!secret) {
        console.error('TURNSTILE_SECRET_KEY is not set; rejecting form submission.');
        return false;
    }
    if (!token || typeof token !== 'string') return false;
    try {
        const response = await fetch(VERIFY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret, response: token }),
            signal: AbortSignal.timeout(10000),
        });
        const result = await response.json();
        return result.success === true;
    } catch (e) {
        console.error('Turnstile verification failed to complete', e);
        return false;
    }
}

module.exports = { verifyTurnstile };
