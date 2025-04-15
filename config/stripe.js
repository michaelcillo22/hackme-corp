//configuring stripe for payment

import Stripe from "stripe";
const stripe = new Stripe("secret_key_needed");  

export default stripe;
