const memberForm = document.getElementById("memberForm");
const memberTable = document.getElementById("memberTable").querySelector("tbody");
const notificationBox = document.getElementById("notifications");
const searchInput = document.getElementById("searchInput");

let members = [];

// Load members from backend on page load
window.addEventListener("DOMContentLoaded", async () => {
  await fetchMembers();
});

// Fetch all members
async function fetchMembers() {
  const res = await fetch("http://localhost:5000/api/members");
  members = await res.json();
  displayMembers();
  checkNotifications();
}

// Add new member
memberForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  if (!name || !phone || !start || !end) return;

  const res = await fetch("http://localhost:5000/api/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, start, end }),
  });

  const data = await res.json();
  members.push(data.member);

  displayMembers();
  checkNotifications();
  memberForm.reset();
});

// Delete member
async function deleteMember(id) {
  await fetch(`http://localhost:5000/api/members/${id}`, {
    method: "DELETE",
  });
  members = members.filter((m) => m._id !== id);
  displayMembers();
  checkNotifications();
}

// Display members
function displayMembers(searchTerm = "") {
  memberTable.innerHTML = "";

  members
    .filter((m) =>
      m.name.toLowerCase().includes(searchTerm) ||
      m.phone.toLowerCase().includes(searchTerm)
    )
    .forEach((m) => {
      const daysLeft = getDaysLeft(m.end);
      let color = "#ffffff";

      if (daysLeft <= 0) color = "#ef4444"; // Red
      else if (daysLeft <= 3) color = "#f97316"; // Orange
      else color = "#22c55e"; // Green

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><a href="#" onclick="showPhone('${m.phone}')">${m.name}</a></td>
        <td>${m.start}</td>
        <td>${m.end}</td>
        <td style="color:${color}; font-weight:bold;">${daysLeft} days</td>
        <td><button onclick="deleteMember('${m._id}')">❌</button></td>
      `;
      memberTable.appendChild(tr);
    });
}

// Show phone
function showPhone(phone) {
  alert(`📞 Phone Number: ${phone}`);
}

// Days remaining
function getDaysLeft(endDate) {
  const today = new Date();
  const end = new Date(endDate);
  const diff = end - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Notifications
function checkNotifications() {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const expiring = members.filter(m => m.end === today || m.end === tomorrow);

  if (expiring.length > 0) {
    notificationBox.classList.remove("hidden");
    notificationBox.innerHTML = `⚠️ These members’ subscriptions are ending soon:<br>
      ${expiring.map(m => `<strong>${m.name}</strong> (ends ${m.end})`).join("<br>")}
    `;
  } else {
    notificationBox.classList.add("hidden");
    notificationBox.innerHTML = "";
  }
}

// Search filter
searchInput.addEventListener("input", () => {
  displayMembers(searchInput.value.trim().toLowerCase());
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "adminindex.html";
});
