// Cloudflare Pages Function — POST /api/contact
// Requires env var: RESEND_API_KEY

export async function onRequestPost({ request, env }) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Pati Yoga <formularz@patiyoga.com>',
        to: ['kontakt@patiyoga.com'],
        reply_to: email,
        subject: `Wiadomość od ${name} — patiyoga.com`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;color:#1a1a1a">
            <h2 style="font-size:20px;margin-bottom:4px">Nowa wiadomość z formularza</h2>
            <p style="color:#666;font-size:13px;margin-bottom:24px">patiyoga.com — coming soon</p>
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;width:80px;text-transform:uppercase;letter-spacing:.08em">Imię</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:15px">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:.08em">E-mail</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:15px"><a href="mailto:${email}" style="color:#B5714A">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">Wiadomość</td>
                <td style="padding:10px 0;font-size:15px;line-height:1.6;white-space:pre-wrap">${message}</td>
              </tr>
            </table>
            <p style="margin-top:32px;font-size:12px;color:#bbb">Wiadomość wysłana przez formularz na patiyoga.com</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(JSON.stringify({ error: 'Email failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
