<?php
require_once 'backend/config.php';
try {
    $stmt = $conn->query("DESCRIBE diagnoses");
    $columns = $stmt->fetchAll();
    echo json_encode($columns);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
