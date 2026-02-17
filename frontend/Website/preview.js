// ===============================
// MARKETPLACE PREVIEW (HOME PAGE)
// ===============================

const previewGrid = document.getElementById("listingPreview");

if (previewGrid) {

  let marketItems = JSON.parse(localStorage.getItem("marketItems")) || [];

  renderPreview();

  function renderPreview() {

    previewGrid.innerHTML = "";

    // Get most recent 8
    const recentItems = marketItems.slice(0, 8);

    recentItems.forEach((item) => {

  const div = document.createElement("div");
  div.className = "listing-card";

  div.innerHTML = `
    <img src="${item.image}" class="preview-img" />
    <div class="preview-price">$${item.price}</div>
  `;

  // Open detail modal on click
  div.addEventListener("click", () => {
  localStorage.setItem("selectedItemId", item.id);
  window.location.href = "marketplace.html";
});

  previewGrid.appendChild(div);
});

  }

}
