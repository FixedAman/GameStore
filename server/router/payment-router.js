const express = require("express");
const User = require("../models/user-model");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const jwt = require("jsonwebtoken");
router.post("/create-checkout-session", async (req, res) => {
  const { planName, price, email } = req.body;
  try {
    const product = await stripe.products.create({
      name: planName,
    });
    // create price for the product
    const priceObj = await stripe.prices.create({
      product: product.id,
      unit_amount: price * 100,
      currency: "inr",
      recurring: { interval: "month" },
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceObj.id,
          quantity: 1,
        },
      ],
      success_url:
        "http://localhost:5173/verify-subscription?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.log("Stripe error", error);
    console.log("Timestamp:", new Date().toISOString());
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    res.status(500).json({
      error: "failed to create stripe session",
    });
  }
});
router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("Webhook received!");
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await User.findOneAndUpdate(
        {
          email: session.customer_email,
        },
        {
          hasPaid: true,
        }
      );
      console.log(` Updated hasPaid for ${session.customer_email}`);
    }
    res.status(200).end();
  }
);
router.get("/get-invoice", async (req, res) => {
  const { session_id } = req.query;
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const invoice = await stripe.invoices.retrieve(session.invoice);
  res.json({ pdfUrl: invoice.invoice_pdf });
});

router.get("/verify-subscription", async (req, res) => {
  try {
    const { session_id } = req.query;
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "unauthorize" });
    const token = authHeader.split(" ")[1];
    
    console.log("token", token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );
    if (subscription.status === "active") {
      await User.findByIdAndUpdate(decoded.userId, {
        hasPaid: true,
      });
      return res.status(200).json({ message: "Payment verified" });
    }
    return res.status(400).json({ message: "Subscription is inactive" });
  } catch (error) {
    console.error("Verification failed:", error.message);
    return res.status(400).json({ message: error.message });
  }
});


module.exports = router;
