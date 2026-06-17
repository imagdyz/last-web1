<?php
$data = array(
    'condition' => array('name' => 'test_from_php', 'match' => 55),
    'symptoms' => array('s1', 's2'),
    'user_id' => 1,
    'date' => date('Y-m-d H:i:s')
);
$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents('https://magdy.host/backend/api/diagnoses.php', false, $context);
echo $result;
?>
