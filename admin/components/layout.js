window.Layout = {
  shell() {
    return `
      <div class="flex min-h-screen">
        <aside id="sidebar" class="w-72 bg-black text-yellow-500 p-4 transition-all">
          <div class="flex items-center gap-3 mb-4">
            <img id="sidebarAvatar" src="../assets/images/customer-service.png" class="w-12 h-12 rounded-full bg-white p-1"/>
            <div>
              <p id="sidebarName" class="font-bold">Admin</p>
              <p id="sidebarRole" class="text-xs text-yellow-200">Master User</p>
            </div>
          </div>
          <button id="collapseBtn" class="btn-accent px-3 py-1 rounded text-sm mb-3">Collapse</button>
          <nav class="space-y-2 text-sm">
            ${["dashboard","profile","properties","reviews","users","analytics"].map((k) =>
              `<button class="sidebar-link w-full text-left px-3 py-2 rounded hover:bg-gray-800" data-page="${k}">${k[0].toUpperCase() + k.slice(1)}</button>`
            ).join("")}
          </nav>
        </aside>
        <main class="flex-1 p-4 md:p-6">
          <header class="panel p-3 mb-4 flex justify-between items-center">
            <h1 id="pageTitle" class="text-xl font-bold">Dashboard</h1>
            <div class="flex gap-2">
              <button id="themeToggle" class="px-3 py-1 border rounded">🌗 Theme</button>
              <button id="logoutBtn" class="px-3 py-1 border rounded">Logout</button>
            </div>
          </header>
          <div id="content"></div>
        </main>
      </div>
      <div id="toastWrap"></div>
    `;
  },
  toast(message, ok = true) {
    const t = document.createElement("div");
    t.className = "toast";
    t.style.background = ok ? "#111827" : "#b91c1c";
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }
};
