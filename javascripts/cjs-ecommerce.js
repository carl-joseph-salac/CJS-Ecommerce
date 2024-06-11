import {cart} from '../data/cart.js';

// how to create products data
const cjsProducts = [{
  image: 'images/products/athletic-cotton-socks-6-pairs.jpg',
  name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
  rating: {
    stars: 4.5,
    count: 87
  },
  priceCents: 1090, // save in cents
}, {
  image: 'images/products/intermediate-composite-basketball.jpg',
  name: 'Intermediate Size Basketball',
  rating: {
    stars: 4,
    count: 127
  },
  priceCents: 2095
}, {
  image: 'images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg',
  name: 'Adult Plain Cotton T-Shirt - 2 Pack',
  rating: {
    stars: 4.5,
    count: 56
  },
  priceCents: 799
}, {
  image: 'images/products/black-2-slot-toaster.jpg',
  name: '2 Slot Toaster - Black',
  rating: {
    stars: 5,
    count: 2197
  },
  priceCents: 1899
}];

// create html with the value based on the product array data
let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img src="${product.image}" class="product-image">
      </div>

      <div class="product-name">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10 /*convert to whole number*/}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2) /*convert to decimal(fixed to 2 places)*/}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}" data-testid="quantity-selector">
          <option selected="" value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>          
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="js-added-to-cart-message-${product.id} added-to-cart" data-testid="added-to-cart-message">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}" data-product-name="${product.name}">
          Add to Cart
      </button>
    </div>
  `;   
});

// put the generated html inside products div
const productsGrid = document.querySelector('.js-products-grid');
productsGrid.innerHTML = productsHTML;

const addToCartBtns = document.querySelectorAll('.js-add-to-cart');
addToCartBtns.forEach((btn) => {  
  let removeOpacity; // declared outside to retains its value
  btn.addEventListener('click', () => {
    /* 
      const productId = btn.dataset.productId; // no destructuring
      const productName = btn.dataset.productName; // no destructuring
    */
    const { productId, productName } = btn.dataset; // destructuring
    const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);             

    let matchingItem;    

    // cart.forEach(item => item.productId === productId && (matchingItem = item)); // shorthand
    cart.forEach(item => { // longhand (verbose)
      if (item.productId === productId) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += Number(quantitySelector.value);
    } else {
      cart.push({
        productId, // property shorthand (same property name & var name)
        productName, // property shorthand (same property name & var name)
        quantity: Number(quantitySelector.value)
      });
    }    

    let totalQuantity = 0;
    cart.forEach((item) => {
      totalQuantity += item.quantity;
    });  

    const cartQuantity = document.querySelector('.js-cart-quantity');
    cartQuantity.innerHTML = totalQuantity;
    
    // show added to cart message    
    const addedMessage = document.querySelector(`.js-added-to-cart-message-${productId}`);         
    if (!addedMessage.classList.contains('opacity-100')) { // if not visible
      addedMessage.classList.add('opacity-100'); // make it visible
      removeOpacity = setTimeout(() => addedMessage.classList.remove('opacity-100'), 2000); // then remove after 2s.
    } else { // if already visible (already clicked add to cart button)
      clearTimeout(removeOpacity); // reset the remove timer
      removeOpacity = setTimeout(() => addedMessage.classList.remove('opacity-100'), 2000); // add new timer
    }    
   
    // console.log(totalQuantity);
    // console.log(cart);
  }); 
});

