const coinList = document.getElementById("coinList");
const searchInput = document.getElementById("searchInput");

// Fetch real-time data from CoinGecko
async function fetchCoins() {
  const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false";

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayCoins(data);
    searchInput.addEventListener("input", () => filterCoins(data));
  } catch (error) {
    coinList.innerHTML = `<tr><td colspan="5">Failed to load data 😢</td></tr>`;
    console.error("Error fetching data:", error);
  }
}

function displayCoins(coins) {
  coinList.innerHTML = coins.map(coin => `
    <tr>
      <td><a href="coin.html?id=${coin.id}"><img src="${coin.image}" width="20"> ${coin.name}</a></td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td style="color: ${coin.price_change_percentage_24h >= 0 ? 'green' : 'red'};">
        ${coin.price_change_percentage_24h.toFixed(2)}%
      </td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td><button class="star-btn">★</button></td>
    </tr>
  `).join('');
}

// Filter logic
function filterCoins(allCoins) {
  const query = searchInput.value.toLowerCase();
  const filtered = allCoins.filter(coin => coin.name.toLowerCase().includes(query));
  displayCoins(filtered);
}

// Dark mode toggle
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Call it on load
fetchCoins();
function displayCoins(coins) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  coinList.innerHTML = coins.map(coin => {
    const isFav = watchlist.includes(coin.id);
    return `
      <tr>
        <td>
          <a href="coin.html?id=${coin.id}">
            <img src="${coin.image}" alt="${coin.name}" width="20"> ${coin.name}
          </a>
        </td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td style="color: ${coin.price_change_percentage_24h >= 0 ? 'green' : 'red'};">
          ${coin.price_change_percentage_24h.toFixed(2)}%
        </td>
        <td>$${coin.market_cap.toLocaleString()}</td>
        <td>
          <button class="star-btn" data-id="${coin.id}" title="${isFav ? 'Remove from' : 'Add to'} Watchlist">
            ${isFav ? '★' : '☆'}
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Add event listeners to star buttons
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const coinId = btn.getAttribute("data-id");
      toggleWatchlist(coinId);
      fetchCoins(); // Re-render to reflect star icon
    });
  });
}

function toggleWatchlist(coinId) {
  let list = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (list.includes(coinId)) {
    list = list.filter(id => id !== coinId);
  } else {
    list.push(coinId);
  }
  localStorage.setItem("watchlist", JSON.stringify(list));
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

