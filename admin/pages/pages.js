const Page = {
  dashboard: async () => {
    const data = await api("/analytics");
    return `
      <section class="grid md:grid-cols-4 gap-3">
        ${[
          ["Total Users", data.cards.totalUsers],
          ["Total Properties", data.cards.totalProperties],
          ["Total Reviews", data.cards.totalReviews],
          ["Approved Rate", data.cards.approvedRate]
        ].map(([k, v]) => `<div class="panel p-4"><p class="text-sm text-gray-500">${k}</p><p class="text-2xl font-bold">${v}</p></div>`).join("")}
      </section>
      <section class="panel p-4 mt-4"><canvas id="usersChart"></canvas></section>
      <section class="panel p-4 mt-4"><canvas id="revenueChart"></canvas></section>
      <section class="panel p-4 mt-4"><canvas id="trafficChart"></canvas></section>
    `;
  },
  profile: async () => `
    <section class="panel p-4 grid md:grid-cols-2 gap-4">
      <form id="profileForm" class="space-y-2">
        <h2 class="font-bold">Profile Management</h2>
        <input name="name" required placeholder="Name" class="w-full border p-2 rounded"/>
        <input name="email" required type="email" placeholder="Email" class="w-full border p-2 rounded"/>
        <textarea name="bio" placeholder="Bio" class="w-full border p-2 rounded"></textarea>
        <button class="btn-accent px-3 py-2 rounded">Save profile</button>
      </form>
      <div class="space-y-3">
        <form id="avatarForm" class="space-y-2">
          <h3 class="font-semibold">Upload Profile Image</h3>
          <input type="file" name="avatar" accept="image/*" required class="w-full"/>
          <button class="btn-accent px-3 py-2 rounded">Upload</button>
        </form>
        <form id="passwordForm" class="space-y-2">
          <h3 class="font-semibold">Change Password</h3>
          <input name="currentPassword" type="password" required minlength="6" placeholder="Current password" class="w-full border p-2 rounded"/>
          <input name="newPassword" type="password" required minlength="6" placeholder="New password" class="w-full border p-2 rounded"/>
          <button class="btn-accent px-3 py-2 rounded">Change password</button>
        </form>
      </div>
    </section>
  `,
  properties: async () => `
    <section class="panel p-4">
      <h2 class="font-bold mb-2">Property Management</h2>
      <form id="propertyForm" class="grid md:grid-cols-3 gap-2">
        <input name="title" required placeholder="Property title" class="border p-2 rounded"/>
        <input name="price" required type="number" min="1" placeholder="Price" class="border p-2 rounded"/>
        <input name="location" required placeholder="Location" class="border p-2 rounded"/>
        <select name="type" class="border p-2 rounded"><option value="sale">Sale</option><option value="rent">Rent</option></select>
        <input name="amenities" placeholder="Amenities comma separated" class="border p-2 rounded"/>
        <input name="images" type="file" multiple accept="image/*" class="border p-2 rounded"/>
        <textarea name="description" required placeholder="Description" class="border p-2 rounded md:col-span-3"></textarea>
        <button class="btn-accent rounded md:col-span-3">Add Property</button>
      </form>
      <div id="propertyList" class="mt-4"></div>
    </section>
  `,
  blogs: async () => `
    <section class="panel p-4">
      <h2 class="font-bold">Blog System</h2>
      <form id="blogForm" class="grid md:grid-cols-2 gap-2 mt-2">
        <input name="title" required placeholder="Blog title" class="border p-2 rounded"/>
        <input name="category" placeholder="Category" class="border p-2 rounded"/>
        <input name="tags" placeholder="Tags (comma separated)" class="border p-2 rounded"/>
        <select name="status" class="border p-2 rounded"><option value="draft">Draft</option><option value="published">Published</option></select>
        <textarea id="blogContent" contenteditable="true" name="content" placeholder="Rich text content (HTML allowed)" class="md:col-span-2 border p-2 rounded min-h-[140px]"></textarea>
        <button class="btn-accent px-3 py-2 rounded md:col-span-2">Save blog</button>
      </form>
      <div id="blogList" class="mt-4 text-sm"></div>
    </section>
  `,
  reviews: async () => `
    <section class="panel p-4">
      <h2 class="font-bold">Customer Reviews</h2>
      <form id="reviewForm" class="grid md:grid-cols-2 gap-2 mt-2">
        <input name="customerName" required placeholder="Customer name" class="border p-2 rounded"/>
        <select name="rating" class="border p-2 rounded">${[1,2,3,4,5].map((n)=>`<option>${n}</option>`).join("")}</select>
        <textarea name="comment" required placeholder="Comment" class="border p-2 rounded md:col-span-2"></textarea>
        <button class="btn-accent px-3 py-2 rounded md:col-span-2">Add review</button>
      </form>
      <div id="reviewList" class="mt-4"></div>
    </section>
  `,
  analytics: async () => `<section class="panel p-4"><h2 class="font-bold mb-2">Analytics</h2><p>Live charts are available in Dashboard view.</p></section>`,
  users: async () => `
    <section class="panel p-4">
      <h2 class="font-bold">User Management</h2>
      <form id="userFilter" class="grid md:grid-cols-4 gap-2 mt-2">
        <input name="q" placeholder="Search name/email" class="border p-2 rounded"/>
        <select name="role" class="border p-2 rounded"><option value="">All roles</option><option value="admin">Admin</option><option value="sub-admin">Sub-admin</option></select>
        <input name="page" type="number" min="1" value="1" class="border p-2 rounded"/>
        <button class="btn-accent rounded">Apply</button>
      </form>
      <form id="userForm" class="grid md:grid-cols-5 gap-2 mt-3">
        <input name="name" required placeholder="Name" class="border p-2 rounded"/>
        <input name="email" required type="email" placeholder="Email" class="border p-2 rounded"/>
        <input name="password" required placeholder="Password" class="border p-2 rounded"/>
        <select name="role" class="border p-2 rounded"><option value="admin">Admin</option><option value="sub-admin">Sub-admin</option></select>
        <button class="btn-accent rounded">Add user</button>
      </form>
      <div id="usersTable" class="mt-4"></div>
    </section>
  `,
  notifications: async () => `
    <section class="panel p-4">
      <h2 class="font-bold">Notifications</h2>
      <form id="notificationForm" class="flex gap-2 mt-2">
        <input name="message" required placeholder="Notification message" class="border p-2 rounded flex-1"/>
        <button class="btn-accent px-3 rounded">Send</button>
      </form>
      <ul id="notificationList" class="mt-4 space-y-2"></ul>
    </section>
  `,
  settings: async () => `
    <section class="panel p-4">
      <h2 class="font-bold">Settings</h2>
      <form id="settingsForm" class="grid md:grid-cols-2 gap-2 mt-2">
        <input name="siteName" placeholder="Site name" class="border p-2 rounded"/>
        <input name="siteEmail" type="email" placeholder="Site email" class="border p-2 rounded"/>
        <label class="flex items-center gap-2"><input type="checkbox" name="maintenanceMode"> Maintenance mode</label>
        <label class="flex items-center gap-2"><input type="checkbox" name="allowPublicReviews"> Allow public reviews</label>
        <button class="btn-accent px-3 py-2 rounded md:col-span-2">Save settings</button>
      </form>
    </section>
  `
};

window.Page = Page;
