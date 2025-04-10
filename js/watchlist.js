const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
const watchlistTable = document.getElementById("watchlistTable");

if (watchlist.length === 0) {
  watchlistTable.innerHTML = "<tr><td colspan='5'>Your watchlist is empty 🤷‍♂️</td></tr>";
} else {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${watchlist.join(",")}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      watchlistTable.innerHTML = data.map(coin => `
        <tr>
          <td><a href="coin.html?id=${coin.id}"><img src="${coin.image}" width="20"> ${coin.name}</a></td>
          <td>$${coin.current_price.toLocaleString()}</td>
          <td style="color: ${coin.price_change_percentage_24h >= 0 ? 'green' : 'red'};">
            ${coin.price_change_percentage_24h.toFixed(2)}%
          </td>
          <td>$${coin.market_cap.toLocaleString()}</td>
          <td><button onclick="removeFromWatchlist('${coin.id}')">Remove ❌</button></td>
        </tr>
      `).join('');
    });
}

function removeFromWatchlist(coinId) {
  const updated = watchlist.filter(id => id !== coinId);
  localStorage.setItem("watchlist", JSON.stringify(updated));
  location.reload(); // Refresh page
}
// Set theme on load
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("darkModeToggle").checked = true;
  }
  
  // Handle toggle change
  document.getElementById("darkModeToggle").addEventListener("change", (e) => {
    if (e.target.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });
  document.getElementById("notifyBtn")?.addEventListener("click", () => {
    const popup = document.getElementById("notificationPopup");
    popup.classList.add("show");
    setTimeout(() => popup.classList.remove("show"), 3000); // Hide after 3 seconds
  });
// Login modal toggle
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");

loginBtn?.addEventListener("click", () => {
  loginModal.style.display = "flex";
});

closeLogin?.addEventListener("click", () => {
  loginModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === loginModal) loginModal.style.display = "none";
});
  