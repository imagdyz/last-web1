<?php
require 'backend/config.php';
$stmt = $conn->query('SELECT * FROM diagnoses LIMIT 1');
print_r(array_keys((array)$stmt->fetch(PDO::FETCH_ASSOC)));
?>
