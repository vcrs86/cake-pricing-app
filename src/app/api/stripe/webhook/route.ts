import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ✅ Cuando el pago se completa
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("✅ WEBHOOK TRIGGERED");
    console.log("EMAIL RAW:", session.customer_email);
    console.log("EMAIL DETAILS:", session.customer_details?.email);
    console.log("LANG:", session.metadata?.language);

    const token = session.id;

    const email =
      session.customer_email ||
      session.customer_details?.email ||
      "";

    const language = session.metadata?.language || "en";

    // Guardar en Supabase
    await supabase.from("pro_users").insert({
      token,
      email,
    });

    // Enviar email con Brevo
    if (email) {
      try {
        const subject =
          language === "es"
            ? "🎂 ¡Bienvenida a CakePrice PRO!"
            : "🎂 Welcome to CakePrice PRO!";

        const appUrl = "https://cakeprice.amarettobakery.com";

const html =
  language === "es"
    ? `
<div style="font-family: Arial, sans-serif; background:#fafafa; padding:20px; line-height:1.6;">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:24px;">

    <div style="text-align:center;margin-bottom:20px;">
      <img src="${appUrl}/brand/logo-primary.png" height="60" alt="CakePrice" />
    </div>

    <h2>🎂 ¡Bienvenida a CakePrice PRO!</h2>

    <p>Tu acceso PRO ya está activo.</p>

    <p>
      Ya puedes comenzar a usar todas las funciones premium.
    </p>

    <hr style="margin:24px 0;" />

    <h3>🔐 Recuperar tu acceso</h3>

    <p>
      Si necesitas restaurar tu acceso en otro dispositivo,
      solo utiliza este mismo email en la opción
      <strong>Login PRO</strong>.
    </p>

    <hr style="margin:24px 0;" />

    <h3>📲 Instalar la app</h3>

    <p><strong>iPhone (Safari):</strong></p>
    <ul>
      <li>Abre CakePrice en Safari</li>
      <li>Pulsa el botón Compartir ⬆️</li>
      <li>Selecciona “Agregar a inicio”</li>
    </ul>

    <p><strong>Android (Chrome):</strong></p>
    <ul>
      <li>Abre CakePrice en Chrome</li>
      <li>Pulsa el menú ⋮</li>
      <li>Agregar a pantalla principal</li>
    </ul>

    <hr style="margin:24px 0;" />

    <p style="font-size:14px;color:#777;margin-top:20px;">
      Gracias por apoyar CakePrice 💗<br/>
      — Vanessa
    </p>

  </div>
</div>
`
    : `
<div style="font-family: Arial, sans-serif; background:#fafafa; padding:20px; line-height:1.6;">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:24px;">

    <div style="text-align:center;margin-bottom:20px;">
      <img src="${appUrl}/brand/logo-primary.png" height="60" alt="CakePrice" />
    </div>

    <h2>🎂 Welcome to CakePrice PRO!</h2>

    <p>Your PRO access is now active.</p>

    <p>
      You can now start using all premium features.
    </p>

    <hr style="margin:24px 0;" />

    <h3>🔐 Restore access</h3>

    <p>
      If you need to restore your access on another device,
      just use this same email in
      <strong>Login PRO</strong>.
    </p>

    <hr style="margin:24px 0;" />

    <h3>📲 Install the app</h3>

    <p><strong>iPhone (Safari):</strong></p>
    <ul>
      <li>Open CakePrice in Safari</li>
      <li>Tap Share ⬆️</li>
      <li>Select “Add to Home Screen”</li>
    </ul>

    <p><strong>Android (Chrome):</strong></p>
    <ul>
      <li>Open CakePrice in Chrome</li>
      <li>Open menu ⋮</li>
      <li>Add to Home Screen</li>
    </ul>

    <hr style="margin:24px 0;" />

    <p style="font-size:14px;color:#777;margin-top:20px;">
      Thank you for supporting CakePrice 💗<br/>
      — Vanessa
    </p>

  </div>
</div>
`;

        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY!,
          },
          body: JSON.stringify({
            sender: {
              name: "CakePrice",
              email: "hello@amarettobakery.com",
            },
            to: [{ email }],
            subject,
            htmlContent: html,
          }),
        });
      } catch (err) {
        console.error("EMAIL ERROR:", err);
      }
    }
  }

  return new Response("OK", { status: 200 });
}
