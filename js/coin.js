const queryParams = new URLSearchParams(window.location.search);
const coinId = queryParams.get('id');
const coinDetails = document.getElementById('coinDetails');
const coinName = document.getElementById('coinName');

if (!coinId) {
  coinDetails.innerHTML = "<p>Invalid coin. Try again.</p>";
} else {
  getCoinDetails(coinId);
  getChartData(coinId);
}

async function getCoinDetails(id) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    coinName.textContent = data.name;

    coinDetails.innerHTML = `
      <div style="padding: 1rem;">
        <img src="${data.image.large}" width="64"/>
        <h2>${data.name} (${data.symbol.toUpperCase()})</h2>
        <p><strong>Current Price:</strong> $${data.market_data.current_price.usd.toLocaleString()}</p>
        <p><strong>Market Cap:</strong> $${data.market_data.market_cap.usd.toLocaleString()}</p>
        <p><strong>24h Change:</strong> ${data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
        <p><strong>Total Volume:</strong> $${data.market_data.total_volume.usd.toLocaleString()}</p>
        <p><strong>Supply:</strong> ${data.market_data.circulating_supply.toLocaleString()}</p>
      </div>
    `;
  } catch (err) {
    coinDetails.innerHTML = `<p>Could not load data 😞</p>`;
    console.error(err);
  }
}

async function getChartData(id) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const labels = data.prices.map(item => new Date(item[0]).toLocaleDateString());
    const prices = data.prices.map(item => item[1]);

    const ctx = document.getElementById("priceChart").getContext("2d");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Price (USD)',
          data: prices,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: { color: '#999' }
          },
          y: {
            ticks: { color: '#999' }
          }
        }
      }
    });
  } catch (err) {
    console.error("Chart error:", err);
  }
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
