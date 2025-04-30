<?php
// Include session verification
require_once 'check_session.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Crypto live</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

  <!-- Navbar -->
  <nav class="navbar">
    
    <h1>💰 CryptoLive</h1>
    <div class="toggle-wrapper">
      <label class="switch">
        <input type="checkbox" id="darkModeToggle">
        <span class="slider round"></span>
      </label>
    </div>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="watchlist.php">Watchlist</a></li> 
    </ul>
    <button id="loginBtn" class="login-btn">👤 Login</button>
    <button id="notifyBtn" title="Notifications" class="bell-btn">🔔 Alerts</button>
    <a href="logout.php" class="logout-btn">Logout</a>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <h2>Live Crypto Prices in Real Time 🪙</h2>
    <p>Get live updates and stay ahead in the market!</p>
  </section>
  <div id="notificationPopup">🔔 Real-time price alerts are coming soon!</div>
  <!-- Search & Filter Bar -->
  <div class="search-filter">
    <input type="text" id="searchInput" placeholder="Search for a coin..." />
  </div>

  <!-- Cryptocurrency Table -->
  <section class="crypto-table">
    <table>
      <thead>
        <tr>
          <th>Coin</th>
          <th>Price</th>
          <th>24h Change</th>
          <th>Market Cap</th>
          <th>★</th>
        </tr>
      </thead>
      <tbody id="coinList">
        <!-- Coin rows will be inserted by JS -->
      </tbody>
    </table>
  </section>
  <div class="modal" id="loginModal">
    <div class="modal-content">
      <span class="close-btn" id="closeLogin">&times;</span>
      <h2>Login to Your Account</h2>
      <form id="loginForm">
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
  <!-- Footer -->
  <footer>
    <p>&copy; 2025 CryptoLive</p>
  </footer>
  <script src="js/main.js"></script>
</body>
</html>