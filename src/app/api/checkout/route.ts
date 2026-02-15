import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {

  try {
    const { language } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "CakePrice PRO Lifetime",
            },
            unit_amount: 100, // $39.00
          },
          quantity: 1,
        },
      ],
      metadata: {
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
