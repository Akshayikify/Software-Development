<?php
// Start the session
session_start();

// Include database connection
require_once 'db_connect.php';

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize
    $username = $conn->real_escape_string($_POST['username']);
    $password = $_POST['password'];
    
    // Validate input
    $errors = [];
    
    // Check if username is empty
    if (empty($username)) {
        $errors[] = "Username is required";
    }
    
    // Check if password is empty
    if (empty($password)) {
        $errors[] = "Password is required";
    }
    
    // If no errors, proceed with login
    if (empty($errors)) {
        // Retrieve user from database
        $sql = "SELECT * FROM users WHERE username = '$username'";
        $result = $conn->query($sql);
        
        if ($result->num_rows == 1) {
            $user = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Password is correct, start a new session
                session_regenerate_id();
                
                // Store user data in session
                $_SESSION['loggedin'] = TRUE;
                $_SESSION['id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                
                // Redirect to index page - FIXED: changed to .php
                header("Location: index.php");
                exit();
            } else {
                // Password is incorrect
                $errors[] = "Invalid username or password";
            }
        } else {
            // User does not exist
            $errors[] = "Invalid username or password";
        }
    }
    
    // If there are errors, store them in session and redirect back to login form
    if (!empty($errors)) {
        $_SESSION['errors'] = $errors;
        $_SESSION['form_data'] = [
            'username' => $username
        ];
        header("Location: login.php");
        exit();
    }
} else {
    // Redirect to login page if accessed directly
    header("Location: login.php");
    exit();
}
?>