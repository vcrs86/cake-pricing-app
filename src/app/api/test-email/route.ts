import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const result = await resend.emails.send({
      from: "CakePrice <no-reply@resend.dev>",
      to: "amarettosevent@gmail.com",
      subject: "✅ Test Email from CakePrice",
      html: "<p>This is a test email from your app.</p>",
    });

    return Response.json({ ok: true, result });
  } catch (err) {
    console.error("TEST EMAIL ERROR:", err);
    return Response.json({ ok: false, err }, { status: 500 });
  }
}
