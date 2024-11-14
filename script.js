let products = [];
let cart = [];
let cartCount = 0;

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});

// Fetch products from API
function fetchProducts() {
  fetch("https://fakestoreapi.in/api/products?limit=20")
    .then((response) => response.json())
    .then((data) => {
      products = data?.products;
      displayProducts(products);
    })
    .catch((err) => console.log("Error fetching products:", err));
}

// Toggle description between truncated and full description
function toggleDescription(productId) {
  const description = document.getElementById(`description-${productId}`);
  const fullDescription = document.getElementById(
    `full-description-${productId}`
  );
  const toggleText = document.getElementById(`toggle-${productId}`);

  // Toggle visibility of description and update button text
  if (fullDescription.style.display === "none") {
    fullDescription.style.display = "block";
    description.style.display = "none";
    toggleText.textContent = "Less";
  } else {
    fullDescription.style.display = "none";
    description.style.display = "block";
    toggleText.textContent = "More";
  }
}

// Add product to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);

  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  cartCount++;
  updateCartCount();
  updateProductButtonState(productId);
  displayCartItems();
}

// Remove product from cart
function removeFromCart(productId) {
  const productIndex = cart.findIndex((item) => item.id === productId);
  if (productIndex !== -1) {
    const cartItem = cart[productIndex];

    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    } else {
      cart.splice(productIndex, 1);
    }
    cartCount--;
    updateCartCount();
    updateProductButtonState(productId);
    displayCartItems();
  }
}

// Display products
function displayProducts(productsToDisplay) {
  const productsContainer = document.getElementById("productsContainer");
  productsContainer.innerHTML = "";

  productsToDisplay.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // Check if the product is already in the cart
    const cartItem = cart.find((item) => item.id === product.id);
    const isInCart = cartItem !== undefined;

    // Description with toggle for expanding/collapsing
    const truncatedDescription = product.description.slice(0, 150);
    const fullDescription = product.description;

    productCard.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p class="description" id="description-${
            product.id
          }">${truncatedDescription}...</p>
          <p class="expandable-description" id="full-description-${
            product.id
          }" style="display:none;">
              ${fullDescription}
          </p>
          <span class="description-toggle" id="toggle-${
            product.id
          }" onclick="toggleDescription(${product.id})">More</span>
          <h3>$${product.price}</h3>
          <div id="addRemoveBtn-${product.id}">
              ${
                isInCart
                  ? `<div class="quantity-controls">
                      <button onclick="removeFromCart(${product.id})">-</button>
                      <span>${cartItem.quantity}</span>
                      <button onclick="addToCart(${product.id})">+</button>
                    </div>`
                  : `<button onclick="addToCart(${product.id})">Add to Cart</button>`
              }
          </div>
      `;
    productsContainer.appendChild(productCard);
  });
}

// Update cart count display
function updateCartCount() {
  document.getElementById("cartBadge").textContent = cartCount;
}

function updateProductButtonState(productId) {
  const buttonContainer = document.getElementById(`addRemoveBtn-${productId}`);

  const cartItem = cart.find((item) => item.id === productId);

  // If the item is in the cart, show the quantity controls
  if (cartItem) {
    buttonContainer.innerHTML = `
        <div class="quantity-controls">
          <button onclick="removeFromCart(${productId})">-</button>
          <span>${cartItem.quantity}</span>
          <button onclick="addToCart(${productId})">+</button>
        </div>
      `;
  } else {
    // If the item is not in the cart, show the "Add to Cart" button
    buttonContainer.innerHTML = `<button onclick="addToCart(${productId})">Add to Cart</button>`;
  }
}

// Toggle cart modal visibility
function toggleCart() {
  const cartModal = document.getElementById("cartModal");
  cartModal.style.display =
    cartModal.style.display === "flex" ? "none" : "flex";
  displayCartItems();
}

// Display cart items
function displayCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
                  <div>${item.title}</div>
                  <h2 style="margin: 0;">$${item.price * item.quantity}</h2>
                  <div class="quantity-controls">
                    <button onclick="removeFromCart(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="addToCart(${item.id})">+</button>
                  </div>
                  <hr />
              `;
      cartItemsContainer.appendChild(cartItem);
    });
  }
}

// Clear the cart
function clearCart() {
  cart.length = 0;
  cartCount = 0;
  updateCartCount();
  displayCartItems();
  displayProducts(products);
}

// Search products by name
function searchProducts() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts);
}
