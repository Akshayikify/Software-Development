// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const queryParams = new URLSearchParams(window.location.search);
  const coinId = queryParams.get('id');
  const coinDetails = document.getElementById('coinDetails');
  const coinName = document.getElementById('coinName');

  if (!coinId) {
    coinDetails.innerHTML = "<p>Invalid coin. Please select a valid cryptocurrency.</p>";
  } else {
    // Load all data
    getCoinDetails(coinId);
    getChartData(coinId);
    getAdditionalStats(coinId);
  }

// Set up refresh button event listener
const refreshBtn = document.getElementById('refreshStatsBtn');
if (refreshBtn) {
  refreshBtn.addEventListener('click', function() {
    // Add rotation animation
    this.classList.add('rotating');
    
    // Destroy any existing chart instance
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.innerHTML = '<h3>7-Day Price History</h3><canvas id="priceChart"></canvas>';
    
    // Refresh data with slight delay for chart
    getCoinDetails(coinId);
    getAdditionalStats(coinId);
    
    // Delay chart reload slightly to ensure DOM is ready
    setTimeout(() => {
      getChartData(coinId);
    }, 200);
    
    // Remove rotation class after animation completes
    setTimeout(() => {
      this.classList.remove('rotating');
    }, 1000);
  });
}

async function getCoinDetails(id) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    // Update coin name in the header
    const coinName = document.getElementById('coinName');
    if (coinName) {
      coinName.textContent = data.name;
      document.title = `${data.name} | CryptoTracker`;
    }

    // Update coin details section
    const coinDetails = document.getElementById('coinDetails');
    if (coinDetails) {
      // Determine price change color
      const priceChangeColor = data.market_data.price_change_percentage_24h >= 0 ? 'positive-change' : 'negative-change';
      
      coinDetails.innerHTML = `
        <div class="coin-card">
          <div class="coin-header">
            <img src="${data.image.large}" width="64" alt="${data.name} logo"/>
            <div>
              <h2>${data.name} <span class="symbol">${data.symbol.toUpperCase()}</span></h2>
              <div style="display: flex; align-items: center; margin-top: 5px;">
                <span class="rank-badge">Rank #${data.market_cap_rank}</span>
                ${data.links?.homepage[0] ? `<a href="${data.links.homepage[0]}" target="_blank" class="website-link"><i class="fas fa-external-link-alt"></i> Website</a>` : ''}
              </div>
            </div>
          </div>
          <div class="coin-stats">
            <div class="stat-item price-item">
              <strong>Current Price</strong>
              <span>$${data.market_data.current_price.usd.toLocaleString()}</span>
            </div>
            <div class="stat-item">
              <strong>24h Change</strong>
              <span class="${priceChangeColor}">
                <i class="fas fa-${data.market_data.price_change_percentage_24h >= 0 ? 'caret-up' : 'caret-down'}"></i>
                ${Math.abs(data.market_data.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
            <div class="stat-item">
              <strong>Market Cap</strong>
              <span>$${data.market_data.market_cap.usd.toLocaleString()}</span>
            </div>
            <div class="stat-item">
              <strong>Total Volume</strong>
              <span>$${data.market_data.total_volume.usd.toLocaleString()}</span>
            </div>
            <div class="stat-item">
              <strong>Circulating Supply</strong>
              <span>${data.market_data.circulating_supply.toLocaleString()} ${data.symbol.toUpperCase()}</span>
            </div>
            ${data.market_data.max_supply ? `
            <div class="stat-item">
              <strong>Max Supply</strong>
              <span>${data.market_data.max_supply.toLocaleString()} ${data.symbol.toUpperCase()}</span>
            </div>` : ''}
          </div>
        </div>
      `;
    }
  } catch (err) {
    console.error("Error fetching coin details:", err);
    if (coinDetails) {
      coinDetails.innerHTML = `
        <div class="error-container">
          <i class="fas fa-exclamation-circle"></i>
          <p>Could not load data. Please try again later.</p>
        </div>`;
    }
  }
}

async function getAdditionalStats(id) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    // Update additional stats
    document.getElementById('tradingVolume').textContent = `$${data.market_data.total_volume.usd.toLocaleString()}`;
    document.getElementById('marketCapRank').textContent = `#${data.market_cap_rank}`;
    
    // Format ATH with date
    const athDate = new Date(data.market_data.ath_date.usd);
    document.getElementById('ath').textContent = `$${data.market_data.ath.usd.toLocaleString()} (${athDate.toLocaleDateString()})`;
    
    // Format ATL with date
    const atlDate = new Date(data.market_data.atl_date.usd);
    document.getElementById('atl').textContent = `$${data.market_data.atl.usd.toLocaleString()} (${atlDate.toLocaleDateString()})`;
    
    // If you want to add more market stats
    const marketStats = document.getElementById('marketStats');
    if (marketStats) {
      // Append additional stat items if needed
      const additionalItems = `
        <div class="stat-item">
          <strong>Price Change (7d)</strong>
          <span class="${data.market_data.price_change_percentage_7d >= 0 ? 'positive-change' : 'negative-change'}">
            ${data.market_data.price_change_percentage_7d.toFixed(2)}%
          </span>
        </div>
        <div class="stat-item">
          <strong>Price Change (30d)</strong>
          <span class="${data.market_data.price_change_percentage_30d >= 0 ? 'positive-change' : 'negative-change'}">
            ${data.market_data.price_change_percentage_30d.toFixed(2)}%
          </span>
        </div>
      `;
      
      // Append to the existing stats
      marketStats.insertAdjacentHTML('beforeend', additionalItems);
    }
  } catch (err) {
    console.error("Error fetching additional stats:", err);
    document.getElementById('tradingVolume').textContent = "Data unavailable";
    document.getElementById('marketCapRank').textContent = "Data unavailable";
    document.getElementById('ath').textContent = "Data unavailable";
    document.getElementById('atl').textContent = "Data unavailable";
  }
}

async function getChartData(id) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (!data.prices || !data.prices.length) {
      console.error("No price data available");
      return;
    }
    
    // Format the date labels better
    const labels = data.prices.map(item => {
      const date = new Date(item[0]);
      return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    });
    
    const prices = data.prices.map(item => item[1]);
    
    // Calculate price change over the period
    const startPrice = prices[0];
    const endPrice = prices[prices.length - 1];
    const priceChange = endPrice - startPrice;
    const percentageChange = (priceChange / startPrice) * 100;
    
    // Determine chart color based on price trend
    const isPositive = percentageChange >= 0;
    const chartColor = isPositive ? '#4caf50' : '#f44336';
    const chartBgColor = isPositive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)';

    const ctx = document.getElementById("priceChart");
    if (!ctx) {
      console.error("Chart canvas element not found");
      return;
    }

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.error("Chart.js is not loaded");
      return;
    }

    // Create chart
    new Chart(ctx.getContext("2d"), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Price (USD)',
          data: prices,
          borderColor: chartColor,
          backgroundColor: chartBgColor,
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: chartColor,
          pointBorderColor: '#fff',
          pointHoverRadius: 5,
          pointHoverBackgroundColor: chartColor,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: { 
              color: document.body.classList.contains('dark') ? '#ccc' : '#666',
              maxRotation: 0,
              font: {
                size: 10
              }
            }
          },
          y: {
            grid: {
              color: document.body.classList.contains('dark') ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: { 
              color: document.body.classList.contains('dark') ? '#ccc' : '#666',
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: document.body.classList.contains('dark') ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)',
            titleColor: document.body.classList.contains('dark') ? '#fff' : '#666',
            bodyColor: document.body.classList.contains('dark') ? '#fff' : '#666',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 14
            },
            padding: 12,
            borderColor: document.body.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return '$' + context.raw.toLocaleString();
              }
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    });
    
    // Update chart subtitle with price change info
    const chartContainer = document.querySelector('.chart-container h3');
    if (chartContainer) {
      chartContainer.innerHTML = `7-Day Price History <span class="${isPositive ? 'positive-change' : 'negative-change'}">
        <i class="fas fa-${isPositive ? 'arrow-up' : 'arrow-down'}"></i> 
        ${Math.abs(percentageChange).toFixed(2)}%
      </span>`;
    }
    
    // Add animation to the chart container after a small delay
    setTimeout(() => {
      const chartContainer = document.querySelector('.chart-container');
      if (chartContainer) {
        chartContainer.classList.add('show');
      }
    }, 300);
    
  } catch (err) {
    console.error("Chart error:", err);
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
      chartContainer.innerHTML = `
        <div class="error-container">
          <i class="fas fa-chart-line"></i>
          <p>Could not load chart data. Please try again later.</p>
        </div>`;
    }
  }
}

// Set theme on load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.checked = true;
  }
}

// Handle toggle change
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

// Notification popup
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
})
