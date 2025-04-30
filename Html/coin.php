<?php
// Include session verification
require_once 'check_session.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Coin Details | CryptoTracker</title>
  <link rel="stylesheet" href="css/style.css" />
  <!-- Add Font Awesome for better icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
  <!-- Make sure Chart.js is loaded before our script -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
</head>
<body>

  <!-- Navbar -->
  <nav class="navbar">
    <h1><a href="index.php">Back to Dashboard</a></h1>
    <h2 id="coinName">Loading...</h2>
    <div style="display: flex; align-items: center;">
      <button id="notifyBtn" title="Notifications" class="bell-btn">
        <i class="fas fa-bell"></i>
      </button>
      <div class="toggle-wrapper">
        <label class="switch" title="Toggle Dark Mode">
          <input type="checkbox" id="darkModeToggle">
          <span class="slider round"></span>
        </label>
      </div>
      <a href="logout.php" class="logout-btn">Logout</a>
    </div>
  </nav>
  
  <div id="notificationPopup"><i class="fas fa-bell"></i> Real-time price alerts are coming soon!</div>

  <!-- Coin Info -->
  <section class="coin-details" id="coinDetails">
    <!-- Populated by JS -->
    <div class="loading">Loading coin data</div>
  </section>
  
  <!-- Chart and Market Stats layout wrapper -->
  <div class="data-container">
    <!-- Chart Container -->
    <div class="chart-container">
      <h3>7-Day Price History</h3>
      <canvas id="priceChart"></canvas>
    </div>
    
    <!-- Market Statistics (Side by side with chart on desktop) -->
    <section class="coin-details market-stats-section">
      <div class="coin-card">
        <div class="coin-header" style="justify-content: space-between;">
          <h2>Market Statistics</h2>
          <button id="refreshStatsBtn" title="Refresh Data" style="background: none; border: none; cursor: pointer;">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
        <div id="marketStats" class="coin-stats">
          <!-- Will be populated with additional stats -->
          <div class="stat-item">
            <strong>24h Trading Volume</strong>
            <span id="tradingVolume">Loading...</span>
          </div>
          <div class="stat-item">
            <strong>Market Cap Rank</strong>
            <span id="marketCapRank">Loading...</span>
          </div>
          <div class="stat-item">
            <strong>All Time High</strong>
            <span id="ath">Loading...</span>
          </div>
          <div class="stat-item">
            <strong>All Time Low</strong>
            <span id="atl">Loading...</span>
          </div>
        </div>
      </div>
    </section>
  </div>
  
  <!-- Clear fix for floats -->
  <div style="clear: both;"></div>
  
  <div class="modal" id="loginModal">
    <div class="modal-content">
      <span class="close-btn" id="closeLogin">&times;</span>
      <h2>Login to Your Account</h2>
      <form id="loginForm">
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login <i class="fas fa-sign-in-alt"></i></button>
      </form>
      <p class="coming-soon-text">Don't have an account? Registration coming soon.</p>
    </div>
  </div>
  
  <!-- Load our script after Chart.js -->
  <script src="js/coin.js"></script>
</body>
</html>