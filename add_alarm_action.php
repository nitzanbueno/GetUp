<?php

// Connect to our database and add the alarm using AJAX.

$servername = "mysql.hostinger.co.il";
$username = "u656842263_user";
$password = "pppppppppp";
$dbname = "u656842263_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Insert the values using SQL prepared statements.
// We didn't have the time to implement usernames.
$sql = "INSERT INTO Alarms (Name, Minutes, Hours)
VALUES (?, ?, ?)";

$statement = $conn->prepare($sql);
$statement->bind_param("sii", $_POST["name"], $_POST["minutes"], $_POST["hours"]);

$statement->execute();

if ($statement->get_result()) {
    echo "Success.";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
