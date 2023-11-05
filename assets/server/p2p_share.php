<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');
    
    create_table('links', TABLE_LINKS);
    $conn = connect();


    $sql = "INSERT INTO links (shopping_list) VALUES ('$json_str')";
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