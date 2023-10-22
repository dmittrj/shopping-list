<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');

    create_table('collaborations_lists', [TABLE_COLLABOR_LISTS]);
    
    $conn = connect();

    $sql = "INSERT INTO collaborations_lists (list_title) VALUES ('$json_str')";
    if ($conn->query($sql) === TRUE) {
        $last_id = $conn->insert_id;
    } else {
        echo "Error: " . $sql . "
        " . $conn->error;
    }

    $id_str = base_convert($last_id, 10, 36);
    $conn->close();

    echo $id_str;
?>