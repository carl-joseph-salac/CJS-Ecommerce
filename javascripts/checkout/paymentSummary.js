import { cart, calculateCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import toCents from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  /* MODEL */
  let productPriceCents = 0; 
  let shippingPriceCents = 0;
  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const estimatedTaxCents = totalBeforeTaxCents * 0.1;
  const orderTotalCents = totalBeforeTaxCents + estimatedTaxCents;

  /* VIEW */
  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div class"js-items-quantity">Items (${calculateCartQuantity()}):</div>
      <div class="payment-summary-money">$${toCents(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${toCents(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${toCents(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${toCents(estimatedTaxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${toCents(orderTotalCents)}</div>
    </div>

    <button class="js-place-order place-order-button ${cart.length === 0 ? 'button-secondary' : 'button-primary'}" 
      ${cart.length === 0 ? 'disabled' : ''}>
      ${cart.length === 0 ? 'Your cart is empty' : 'Place your order'}
    </button>
  `
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  /* CONTROLLER */
  document.querySelector('.js-place-order').addEventListener('click', async () => {
    let isValidCart = true; // Flag to check if cart is valid
    let showAlert = true; // Flag to control the alert display

    cart.forEach(cartItem => {
      if (cartItem.deliveryOptionId === null && showAlert) {
        alert('Select shipping option');
        isValidCart = false; // Set flag to false if deliveryOptionId is null
        showAlert = false; // Prevent further alerts
      }
    })

    if (isValidCart) { // Only run the code if all cart items are valid
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart
          })
        });
        const order = await response.json();
        addOrder(order);
        localStorage.removeItem('cart');
        window.location.href = 'orders.html'; // Redirect only if order is successful
      } catch (error) {
        console.log(error);
      }
    }
  });

  
  // console.log(`Items: $${toCents(productPriceCents)}`);
  // console.log(`Shipping and handling: $${toCents(shippingPriceCents)}`);
  // console.log(`Total before tax: $${toCents(totalBeforeTaxCents)}`);
  // console.log(`Estimated tax (10%): $${toCents(estimatedTaxCents)}`);
  // console.log(`Order total: $${toCents(orderTotalCents)}`);
  console.log(cart);
}