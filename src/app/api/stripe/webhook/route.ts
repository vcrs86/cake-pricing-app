import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";
import { Resend } from "resend";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

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
console.log("HAS RESEND KEY:", !!process.env.RESEND_API_KEY);

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

  // Enviar email automático
  if (email) {
    try {
      const subject =
        language === "es"
          ? "🎂 ¡Bienvenida a CakePrice PRO!"
          : "🎂 Welcome to CakePrice PRO!";

      const html =
        language === "es"
          ? `
<div style="font-family: Arial, sans-serif; line-height: 1.6;">
  <h2>🎂 ¡Bienvenida a CakePrice PRO!</h2>

  <p>Tu acceso PRO ya está activo.</p>

  <p>
    Ya puedes comenzar a usar todas las funciones premium.
  </p>

  <p>
    Si necesitas restaurar tu acceso en otro dispositivo,
    solo utiliza este mismo email en la opción <strong>Login PRO</strong>.
  </p>

  <p style="margin-top: 20px;">
    Gracias por apoyar CakePrice 💗<br/>
    — Vanessa
  </p>
</div>
`
          : `
<div style="font-family: Arial, sans-serif; line-height: 1.6;">
  <h2>🎂 Welcome to CakePrice PRO!</h2>

  <p>Your PRO access is now active.</p>

  <p>
    You can now start using all premium features.
  </p>

  <p>
    If you ever need to restore your access on another device,
    just use this same email in <strong>Login PRO</strong>.
  </p>

  <p style="margin-top: 20px;">
    Thank you for supporting CakePrice 💗<br/>
    — Vanessa
  </p>
</div>
`;

      await resend.emails.send({
        from: "CakePrice <onboarding@resend.dev>",
        to: email,
        subject,
        html,
      });
    } catch (err) {
      console.error("EMAIL ERROR:", err);
    }
  }
}

  return new Response("OK", { status: 200 });
}
