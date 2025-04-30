document.addEventListener('DOMContentLoaded', function() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const watchlistTable = document.getElementById("watchlistTable");

  if (!watchlistTable) {
    console.error("Watchlist table element not found");
    return;
  }

  if (watchlist.length === 0) {
    watchlistTable.innerHTML = "<tr><td colspan='5'>Your watchlist is empty 🤷‍♂️</td></tr>";
  } else {
    // Fetch coin data for watchlist items
    fetchWatchlistData(watchlist, watchlistTable);
  }

  // Set theme on load
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
      darkModeToggle.checked = true;
    }
  }

  // Handle theme toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", (e) => {
      if (e.target.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    });
  }

  // Handle notification button
  const notifyBtn = document.getElementById("notifyBtn");
  if (notifyBtn) {
    notifyBtn.addEventListener("click", () => {
      const popup = document.getElementById("notificationPopup");
      if (popup) {
        popup.classList.add("show");
        setTimeout(() => popup.classList.remove("show"), 3000); // Hide after 3 seconds
      }
    });
  }

  // Login modal toggle
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeLogin = document.getElementById("closeLogin");

  if (loginBtn && loginModal) {
    loginBtn.addEventListener("click", () => {
      loginModal.style.display = "flex";
    });
  }

  if (closeLogin && loginModal) {
    closeLogin.addEventListener("click", () => {
      loginModal.style.display = "none";
    });
  }

  if (loginModal) {
    window.addEventListener("click", (e) => {
      if (e.target === loginModal) loginModal.style.display = "none";
    });
  }
});

function fetchWatchlistData(watchlist, watchlistTable) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${watchlist.join(",")}`;
  
  // Add loading indicator
  watchlistTable.innerHTML = "<tr><td colspan='5'>Loading watchlist data...</td></tr>";
  
  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (data && data.length > 0) {
        watchlistTable.innerHTML = data.map(coin => `
          <tr>
            <td><a href="coin.php?id=${coin.id}"><img src="${coin.image}" width="20"> ${coin.name}</a></td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td style="color: ${coin.price_change_percentage_24h >= 0 ? 'green' : 'red'};">
              ${coin.price_change_percentage_24h.toFixed(2)}%
            </td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            <td><button onclick="removeFromWatchlist('${coin.id}')">Remove ❌</button></td>
          </tr>
        `).join('');
      } else {
        watchlistTable.innerHTML = "<tr><td colspan='5'>No coins in watchlist or failed to load data</td></tr>";
      }
    })
    .catch(error => {
      console.error("Error fetching watchlist data:", error);
      watchlistTable.innerHTML = "<tr><td colspan='5'>Failed to load watchlist data 😢</td></tr>";
    });
}

function removeFromWatchlist(coinId) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const updated = watchlist.filter(id => id !== coinId);
  localStorage.setItem("watchlist", JSON.stringify(updated));
  location.reload(); // Refresh page
}