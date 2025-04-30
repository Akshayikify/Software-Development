<?php
// Start the session
session_start();

// Include database connection
require_once 'db_connect.php';

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize
    $username = $conn->real_escape_string($_POST['username']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validate input
    $errors = [];
    
    // Check if username is empty
    if (empty($username)) {
        $errors[] = "Username is required";
    }
    
    // Check if email is empty or invalid
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    // Check if password is empty or too short
    if (empty($password)) {
        $errors[] = "Password is required";
    } elseif (strlen($password) < 6) {
        $errors[] = "Password must be at least 6 characters long";
    }
    
    // Check if passwords match
    if ($password != $confirm_password) {
        $errors[] = "Passwords do not match";
    }
    
    // If no errors, proceed with registration
    if (empty($errors)) {
        // Check if username already exists
        $check_username = "SELECT * FROM users WHERE username = '$username'";
        $result = $conn->query($check_username);
        
        if ($result->num_rows > 0) {
            $errors[] = "Username already taken";
        } else {
            // Check if email already exists
            $check_email = "SELECT * FROM users WHERE email = '$email'";
            $result = $conn->query($check_email);
            
            if ($result->num_rows > 0) {
                $errors[] = "Email already registered";
            } else {
                // Hash password
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                
                // Insert user into database
                $sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashed_password')";
                
                if ($conn->query($sql) === TRUE) {
                    // Registration successful
                    $_SESSION['success_message'] = "Registration successful! You can now log in.";
                    header("Location: login.php");
                    exit();
                } else {
                    $errors[] = "Error: " . $sql . "<br>" . $conn->error;
                }
            }
        }
    }
    
    // If there are errors, store them in session and redirect back to registration form
    if (!empty($errors)) {
        $_SESSION['errors'] = $errors;
        $_SESSION['form_data'] = [
            'username' => $username,
            'email' => $email
        ];
        // FIXED: Changed to .php
        header("Location: register.php");
        exit();
    }
}
else {
    // FIXED: Changed to .php
    header("Location: register.php");
    exit();
}
?>