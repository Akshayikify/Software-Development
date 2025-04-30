<?php
// Start the session
session_start();

// Check if user is not logged in
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== TRUE) {
    // User is not logged in, redirect to login page
    header("Location: login.php");
    exit();
}

// Include the actual HTML content
include('coin.php');
?>