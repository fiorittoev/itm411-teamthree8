// ===============================
// POSTS SYSTEM
// ===============================

const plusBtn = document.getElementById("plusBtn");
const postsContainer = document.getElementById("posts");

const createPostModal =
  document.getElementById("createPostModal");

const postInput =
  document.getElementById("postInput");

const cancelPost =
  document.getElementById("cancelPost");

const submitPost =
  document.getElementById("submitPost");


// Load saved posts
let posts = JSON.parse(localStorage.getItem("posts")) || [];


// Only render if posts exist (prevents crash on marketplace)
if (postsContainer) {
  renderPosts();
}


// ===============================
// OPEN CREATE POST MODAL
// ===============================

if (plusBtn && createPostModal && postInput) {
  plusBtn.addEventListener("click", () => {
    createPostModal.style.display = "flex";
    postInput.focus();
  });
}


// ===============================
// CANCEL CREATE POST
// ===============================

if (cancelPost && createPostModal && postInput) {
  cancelPost.addEventListener("click", () => {
    createPostModal.style.display = "none";
    postInput.value = "";
  });
}


// ===============================
// SUBMIT POST
// ===============================

if (submitPost && postInput) {
  submitPost.addEventListener("click", () => {

    const text = postInput.value.trim();

    if (!text) return;

    const post = {
      id: Date.now(),
      name: "First Last",
      text,
      time: Date.now()
    };

    posts.unshift(post);

    savePosts();
    renderPosts();

    postInput.value = "";
    createPostModal.style.display = "none";
  });
}


// ===============================
// SAVE POSTS
// ===============================

function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}


// ===============================
// POST TIMESTAMP
// ===============================

function formatTime(timestamp) {

  const date = new Date(timestamp);

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric"
  });
}


// ===============================
// RENDER POSTS
// ===============================

function renderPosts() {

  if (!postsContainer) return;

  postsContainer.innerHTML = "";

  posts.forEach((post) => {

    const div = document.createElement("div");
    div.className = "post-box";

    div.innerHTML = `
      <div class="post-header">
        <span class="post-author">${post.name}</span>
        <span class="post-time">
          ${formatTime(post.time)}
        </span>
      </div>

      <p>${post.text}</p>

      <button class="delete-btn">
        <ion-icon name="trash-outline"></ion-icon>
      </button>
    `;

    div
      .querySelector(".delete-btn")
      .addEventListener("click", () => {
        openDeleteModal(post.id);
      });

    postsContainer.appendChild(div);
  });
}


// ===============================
// DELETE POST
// ===============================

function deletePost(id) {

  posts = posts.filter(p => p.id !== id);

  savePosts();
  renderPosts();
}


// Make global
window.deletePost = deletePost;


// ===============================
// DELETE CONFIRM (POSTS + LISTINGS)
// ===============================

const deleteModal =
  document.getElementById("deletePostModal");

const cancelDelete =
  document.getElementById("cancelDelete");

const confirmDelete =
  document.getElementById("confirmDelete");


let deleteTarget = null;
let deleteType = null;


// Open for posts
window.openDeleteModal = function (id) {

  if (!deleteModal) return;

  deleteTarget = id;
  deleteType = "post";

  deleteModal.style.display = "flex";
};


// Open for listings
window.openListingDeleteModal = function (id) {

  if (!deleteModal) return;

  deleteTarget = id;
  deleteType = "listing";

  deleteModal.style.display = "flex";
};


// Cancel delete
if (cancelDelete) {
  cancelDelete.addEventListener("click", () => {

    deleteTarget = null;
    deleteType = null;

    deleteModal.style.display = "none";
  });
}


// Confirm delete
if (confirmDelete) {
  confirmDelete.addEventListener("click", () => {

    if (!deleteTarget || !deleteType) return;


    // Delete post
    if (deleteType === "post") {
      deletePost(deleteTarget);
    }


    // Delete listing
    if (deleteType === "listing") {

      let marketItems =
        JSON.parse(localStorage.getItem("marketItems")) || [];

      marketItems = marketItems.filter(
        item => item.id !== deleteTarget
      );

      localStorage.setItem(
        "marketItems",
        JSON.stringify(marketItems)
      );


      // Sync global
      if (window.marketItems) {
        window.marketItems = marketItems;
      }


      // Re-render marketplace
      if (typeof renderMarket === "function") {
        renderMarket();
      }


      // Close detail modal
      const detailModal =
        document.getElementById("itemDetailModal");

      if (detailModal) {
        detailModal.style.display = "none";
      }
    }


    // Reset
    deleteTarget = null;
    deleteType = null;

    deleteModal.style.display = "none";
  });
}
