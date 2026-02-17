// ===============================
// NAVIGATION LINKS
// ===============================

// Navbar Icons
const homeBtn = document.getElementById("homeBtn");
const cartNav = document.getElementById("cartNav");

// Page Buttons
const shopBtn = document.getElementById("shopBtn");
const allListingsBtn = document.getElementById("allListingsBtn");


// Home → Homepage
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}


// Cart → Marketplace
if (cartNav) {
  cartNav.addEventListener("click", () => {
    window.location.href = "marketplace.html";
  });
}


// Shop Your Lake → Marketplace
if (shopBtn) {
  shopBtn.addEventListener("click", () => {
    window.location.href = "marketplace.html";
  });
}


// All Listings → Marketplace
if (allListingsBtn) {
  allListingsBtn.addEventListener("click", () => {
    window.location.href = "marketplace.html";
  });
}
