<?php
// Start the session (if not already started)
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if user is not logged in
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== TRUE) {
    // User is not logged in, redirect to login page
    header("Location: login.php");
    exit();
}
?>