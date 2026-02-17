const detailDesc = document.getElementById("detailDesc");

// ===============================
// MARKETPLACE SYSTEM (MODAL FORM)
// ===============================

const marketPlusBtn = document.getElementById("marketPlusBtn");
const marketGrid = document.getElementById("marketGrid");

// Modal Elements
const modal = document.getElementById("addItemModal");
const cancelBtn = document.getElementById("cancelModal");
const form = document.getElementById("addItemForm");
const deleteItemBtn = document.getElementById("deleteItemBtn");

let selectedItemId = null;

// Inputs
const nameInput = document.getElementById("itemName");
const priceInput = document.getElementById("itemPrice");
const descInput = document.getElementById("itemDesc");
const imgInput = document.getElementById("itemImage");


// ===============================
// LOAD ITEMS (GLOBAL)
// ===============================

window.marketItems =
  JSON.parse(localStorage.getItem("marketItems")) || [];

renderMarket();


// ===============================
// OPEN ADD MODAL
// ===============================

if (marketPlusBtn) {
  marketPlusBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });
}


// ===============================
// CLOSE ADD MODAL
// ===============================

cancelBtn.addEventListener("click", closeModal);

function closeModal() {
  modal.style.display = "none";
  form.reset();
}


// ===============================
// SUBMIT FORM
// ===============================

form.addEventListener("submit", (e) => {

  e.preventDefault();

  const file = imgInput.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {

    const item = {
      id: Date.now(),
      name: nameInput.value.trim(),
      price: priceInput.value.trim(),
      desc: descInput.value.trim(),
      image: reader.result
    };

    window.marketItems.unshift(item);

    saveMarket();
    renderMarket();

    closeModal();
  };

  reader.readAsDataURL(file);
});


// ===============================
// SAVE
// ===============================

function saveMarket() {
  localStorage.setItem(
    "marketItems",
    JSON.stringify(window.marketItems)
  );
}


// ===============================
// RENDER MARKET
// ===============================

function renderMarket() {

  marketGrid.innerHTML = "";

  window.marketItems.forEach((item) => {

    const div = document.createElement("div");
    div.className = "market-card";

    div.innerHTML = `
  <img src="${item.image}" class="market-img"/>

  <div class="market-info">

    <div class="market-text">
      <div class="market-name">${item.name}</div>
      <div class="market-price">$${item.price}</div>
    </div>

    <div class="market-fav">♡</div>

  </div>
`;


    // Open detail view
    div.addEventListener("click", (e) => {

  // Ignore clicks on heart
  if (e.target.classList.contains("market-fav")) return;

  openDetail(item);
});


    marketGrid.appendChild(div);
  });
}

// Expose for script.js
window.renderMarket = renderMarket;


// ===============================
// DETAIL VIEW
// ===============================

const detailModal = document.getElementById("itemDetailModal");
const detailImages = document.getElementById("detailImages");
const detailName = document.getElementById("detailName");
const detailPrice = document.getElementById("detailPrice");
const detailSeller = document.getElementById("detailSeller");
const closeDetail = document.getElementById("closeDetail");


window.openDetail = function (item) {

  selectedItemId = item.id;

  detailImages.innerHTML = "";

  const img = document.createElement("img");
  img.src = item.image;

  detailImages.appendChild(img);

  detailName.textContent = item.name;
  detailPrice.textContent = `$${item.price}`;
  detailDesc.textContent = item.desc;

  detailSeller.textContent = "Posted by: Local Seller";

  detailModal.style.display = "flex";
};


// ===============================
// CLOSE DETAIL
// ===============================

closeDetail.addEventListener("click", () => {
  detailModal.style.display = "none";
});


// ===============================
// DELETE MARKET ITEM
// ===============================

if (deleteItemBtn) {

  deleteItemBtn.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    if (!selectedItemId) return;

    // Wait for script.js modal handler
    if (typeof window.openListingDeleteModal === "function") {

      window.openListingDeleteModal(selectedItemId);

    } else {

      console.error(
        "openListingDeleteModal not found — check script load order"
      );

      alert("Delete system not ready. Refresh page.");
    }

  });

}




// ===============================
// AUTO OPEN FROM HOME CLICK
// ===============================

const selectedIdFromHome =
  localStorage.getItem("selectedItemId");

if (selectedIdFromHome) {

  const itemToOpen =
    window.marketItems.find(
      item => item.id == selectedIdFromHome
    );

  if (itemToOpen) {
    openDetail(itemToOpen);
  }

  localStorage.removeItem("selectedItemId");
}
