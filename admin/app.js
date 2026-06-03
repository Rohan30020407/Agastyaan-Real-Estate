let currentPage = "dashboard";

function requireAuth() {
  if (!localStorage.getItem("admin_token")) {
    window.location.href = "/auth/login.html";
  }
}

function formJson(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function spinner(containerId) {
  document.getElementById(containerId).innerHTML = `<div class="panel p-4">Loading...</div>`;
}

async function loadPage(page) {
  currentPage = page;
  document.getElementById("pageTitle").textContent = page[0].toUpperCase() + page.slice(1);
  document.querySelectorAll(".sidebar-link").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
  spinner("content");
  try {
    document.getElementById("content").innerHTML = await Page[page]();
    await bindPageLogic(page);
  } catch (e) {
    Layout.toast(e.message, false);
    document.getElementById("content").innerHTML = `<div class="panel p-4 text-red-600">${e.message}</div>`;
  }
}

async function bindPageLogic(page) {
  if (page === "dashboard") {
    const data = await api("/analytics");
    const cards = data.cards || {};
    const labels = ["Users", "Properties", "Reviews"];
    const values = [cards.totalUsers || 0, cards.totalProperties || 0, cards.totalReviews || 0];
    new Chart(document.getElementById("usersChart"), { type: "bar", data: { labels, datasets: [{ label: "Counts", data: values }] } });
    const approved = Number(String(cards.approvedRate || "0%").replace("%", ""));
    new Chart(document.getElementById("revenueChart"), { type: "doughnut", data: { labels: ["Approved", "Others"], datasets: [{ label: "Review Rate", data: [approved, 100 - approved] }] } });
    new Chart(document.getElementById("trafficChart"), { type: "line", data: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], datasets: [{ label: "Growth", data: [10, 18, 24, 30] }] } });
  }

  if (page === "properties") {
    const list = document.getElementById("propertyList");
    const refresh = async () => {
      const items = await api("/properties");
      list.innerHTML = items.map((p) => `
        <div class="panel p-3 mb-2">
          <div class="flex justify-between items-center gap-2">
            <div><b>${p.title}</b> • ${p.location} • ₹${p.price} • ${p.type}</div>
            <div>
              <button class="text-blue-600 mr-2 edit-prop" data-id="${p._id}" data-title="${p.title}" data-price="${p.price}" data-location="${p.location}" data-type="${p.type}" data-description="${p.description}">Edit</button>
              <button class="text-red-600 del-prop" data-id="${p._id}">Delete</button>
            </div>
          </div>
        </div>`).join("") || "No properties yet";
      list.querySelectorAll(".del-prop").forEach((b) => b.onclick = async () => {
        await api(`/properties/${b.dataset.id}`, { method: "DELETE" });
        Layout.toast("Property deleted");
        refresh();
      });
      list.querySelectorAll(".edit-prop").forEach((b) => b.onclick = async () => {
        const title = prompt("Title", b.dataset.title);
        if (!title) return;
        const price = prompt("Price", b.dataset.price);
        const location = prompt("Location", b.dataset.location);
        const type = prompt("Type (sale/rent)", b.dataset.type);
        const description = prompt("Description", b.dataset.description);
        await api(`/properties/${b.dataset.id}`, { method: "PUT", body: JSON.stringify({ title, price, location, type, description }) });
        Layout.toast("Property updated");
        refresh();
      });
    };
    document.getElementById("propertyForm").onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const fd = new FormData();
      fd.append("title", form.title.value.trim());
      fd.append("price", form.price.value);
      fd.append("location", form.location.value.trim());
      fd.append("type", form.type.value);
      fd.append("description", form.description.value.trim());
      fd.append("amenities", form.amenities.value.trim());
      for (const file of form.images.files) fd.append("images", file);
      await api("/properties", { method: "POST", body: fd });
      Layout.toast("Property added");
      form.reset();
      refresh();
    };
    await refresh();
  }

  if (page === "profile") {
    const me = await api("/auth/me");
    document.getElementById("sidebarName").textContent = me.name;
    document.getElementById("sidebarRole").textContent = me.role;
    document.getElementById("sidebarAvatar").src = `http://localhost:4000${me.avatar}`;
    const pf = document.getElementById("profileForm");
    pf.name.value = me.name; pf.email.value = me.email; pf.bio.value = me.bio || "";
    pf.onsubmit = async (e) => { e.preventDefault(); await api("/users/profile", { method: "PUT", body: JSON.stringify(formJson(pf)) }); Layout.toast("Profile updated"); };
    document.getElementById("avatarForm").onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      await api("/users/avatar", { method: "POST", body: fd });
      Layout.toast("Avatar updated");
      loadPage("profile");
    };
    document.getElementById("passwordForm").onsubmit = async (e) => {
      e.preventDefault();
      await api("/users/change-password", { method: "POST", body: JSON.stringify(formJson(e.target)) });
      Layout.toast("Password changed");
      e.target.reset();
    };
  }

  if (page === "blogs") {
    const form = document.getElementById("blogForm");
    const list = document.getElementById("blogList");
    const refresh = async () => {
      const blogs = await api("/blogs");
      list.innerHTML = blogs.map((b) => `<div class="border-b py-2"><b>${b.title}</b> • ${b.category || "General"} • ${b.status} <div class="text-xs text-gray-500">${(b.tags || "").toString()}</div></div>`).join("") || "No blogs yet";
    };
    form.onsubmit = async (e) => {
      e.preventDefault();
      const payload = formJson(form);
      payload.tags = String(payload.tags || "").split(",").map((x) => x.trim()).filter(Boolean);
      await api("/blogs", { method: "POST", body: JSON.stringify(payload) });
      Layout.toast("Blog saved");
      form.reset();
      refresh();
    };
    await refresh();
  }

  if (page === "reviews") {
    const list = document.getElementById("reviewList");
    const refresh = async () => {
      const reviews = await api("/reviews");
      list.innerHTML = reviews.map((r) => `
        <div class="panel p-3 mb-2">
          <div class="flex justify-between"><b>${r.customerName}</b><span>${"⭐".repeat(r.rating)}</span></div>
          <p>${r.comment}</p>
          <p class="text-xs text-gray-500">Status: ${r.status}</p>
          <div class="mt-2 space-x-2">
            <button data-id="${r._id}" data-status="approved" class="border px-2 py-1 rounded">Approve</button>
            <button data-id="${r._id}" data-status="rejected" class="border px-2 py-1 rounded">Reject</button>
            <button data-id="${r._id}" data-status="spam" class="border px-2 py-1 rounded">Spam</button>
            <button data-id="${r._id}" class="border px-2 py-1 rounded text-red-600 del-review">Delete</button>
          </div>
        </div>`).join("") || "No reviews yet";
      list.querySelectorAll("button[data-status]").forEach((btn) => btn.onclick = async () => {
        await api(`/reviews/${btn.dataset.id}/status`, { method: "PUT", body: JSON.stringify({ status: btn.dataset.status }) });
        Layout.toast(`Review ${btn.dataset.status}`);
        refresh();
      });
      list.querySelectorAll(".del-review").forEach((btn) => btn.onclick = async () => {
        await api(`/reviews/${btn.dataset.id}`, { method: "DELETE" });
        Layout.toast("Review deleted");
        refresh();
      });
    };
    document.getElementById("reviewForm").onsubmit = async (e) => {
      e.preventDefault();
      await api("/reviews", { method: "POST", body: JSON.stringify(formJson(e.target)) });
      Layout.toast("Review added");
      e.target.reset();
      refresh();
    };
    await refresh();
  }

  if (page === "users") {
    const table = document.getElementById("usersTable");
    const filterForm = document.getElementById("userFilter");
    const refresh = async () => {
      const params = new URLSearchParams(formJson(filterForm)).toString();
      const data = await api(`/users?${params}`);
      table.innerHTML = `
        <table class="w-full text-sm"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>${data.items.map((u) => `
            <tr class="border-b"><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${u.active ? "Active" : "Blocked"}</td>
            <td>
              <button class="text-blue-600 mr-2 edit-btn" data-id="${u._id}" data-name="${u.name}" data-email="${u.email}" data-role="${u.role}" data-active="${u.active}">Edit</button>
              <button class="text-red-600 del-btn" data-id="${u._id}">Delete</button>
            </td></tr>`).join("")}</tbody>
        </table>
        <p class="text-xs mt-2">Total: ${data.total}</p>`;
      table.querySelectorAll(".del-btn").forEach((b) => b.onclick = async () => {
        await api(`/users/${b.dataset.id}`, { method: "DELETE" });
        Layout.toast("User deleted");
        refresh();
      });
      table.querySelectorAll(".edit-btn").forEach((b) => b.onclick = async () => {
        const name = prompt("Name", b.dataset.name);
        if (!name) return;
        const email = prompt("Email", b.dataset.email);
        if (!email) return;
        const role = prompt("Role (admin/sub-admin)", b.dataset.role);
        const active = confirm("Keep this user active?");
        await api(`/users/${b.dataset.id}`, {
          method: "PUT",
          body: JSON.stringify({ name, email, role, active })
        });
        Layout.toast("User updated");
        refresh();
      });
    };
    filterForm.onsubmit = (e) => { e.preventDefault(); refresh(); };
    document.getElementById("userForm").onsubmit = async (e) => {
      e.preventDefault();
      await api("/users", { method: "POST", body: JSON.stringify(formJson(e.target)) });
      Layout.toast("User created");
      e.target.reset();
      refresh();
    };
    await refresh();
  }

  if (page === "notifications") {
    const list = document.getElementById("notificationList");
    const refresh = async () => {
      const items = await api("/notifications");
      list.innerHTML = items.map((n) => `<li class="panel p-2 flex justify-between"><span>${n.message}</span><button data-id="${n.id}" class="border px-2 rounded">${n.read ? "Read" : "Mark read"}</button></li>`).join("") || "No notifications";
      list.querySelectorAll("button").forEach((b) => b.onclick = async () => {
        if (b.textContent === "Read") return;
        await api(`/notifications/${b.dataset.id}/read`, { method: "PUT" });
        refresh();
      });
    };
    document.getElementById("notificationForm").onsubmit = async (e) => {
      e.preventDefault();
      await api("/notifications", { method: "POST", body: JSON.stringify(formJson(e.target)) });
      e.target.reset();
      Layout.toast("Notification sent");
      refresh();
    };
    await refresh();
  }

  if (page === "settings") {
    const settings = await api("/settings");
    const form = document.getElementById("settingsForm");
    form.siteName.value = settings.siteName || "";
    form.siteEmail.value = settings.siteEmail || "";
    form.maintenanceMode.checked = !!settings.maintenanceMode;
    form.allowPublicReviews.checked = !!settings.allowPublicReviews;
    form.onsubmit = async (e) => {
      e.preventDefault();
      const payload = formJson(form);
      payload.maintenanceMode = form.maintenanceMode.checked;
      payload.allowPublicReviews = form.allowPublicReviews.checked;
      await api("/settings", { method: "PUT", body: JSON.stringify(payload) });
      Layout.toast("Settings saved");
    };
  }
}

async function init() {
  requireAuth();
  document.getElementById("app").innerHTML = Layout.shell();
  document.querySelectorAll(".sidebar-link").forEach((btn) => btn.onclick = () => loadPage(btn.dataset.page));
  document.getElementById("themeToggle").onclick = () => document.body.classList.toggle("dark");
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/auth/login.html";
  };
  document.getElementById("collapseBtn").onclick = () => {
    const sb = document.getElementById("sidebar");
    sb.classList.toggle("w-72");
    sb.classList.toggle("w-20");
  };
  await loadPage(currentPage);
}

init();
