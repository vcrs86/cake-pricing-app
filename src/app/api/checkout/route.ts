import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {

  try {
    const { language } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],
      allow_promotion_codes: true,


      line_items: [
  {
    price: process.env.STRIPE_PRICE_PRO!,
    quantity: 1,
  },
],

      metadata: {
        app: "cakeprice",
  language: language || "en",
},


      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?token={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,

      customer_creation: "always",
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return new Response("Checkout error", { status: 500 });
  }
}
