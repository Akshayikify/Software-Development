<?php
// Include session verification
require_once 'check_session.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Watchlist</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <nav class="navbar">
    <h1><a href="index.php">← Back to Live</a></h1>
    <h2>My Watchlist</h2>
    <div class="toggle-wrapper">
      <label class="switch">
        <input type="checkbox" id="darkModeToggle">
        <span class="slider round"></span>
      </label>
    </div>
    <a href="logout.php" class="logout-btn">Logout</a>
  </nav>
  <div id="notificationPopup">🔔 Real-time price alerts are coming soon!</div>
  <section class="coin-table">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>24h Change</th>
          <th>Market Cap</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody id="watchlistTable">
        <!-- Filled by JS -->
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
  <footer>
    <p>&copy; 2025 CryptoTracker</p>
  </footer>

  <script src="js/watchlist.js"></script>
</body>
</html>