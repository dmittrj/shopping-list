<?php
    $json_str = file_get_contents('php://input');
    
    $servername = "localhost";
    $username = "username";
    $password = "password";
    $dbname = "database";
    $conn = new mysqli($servername, $username, $password, $dbname);

    $sql = "INSERT INTO links (shopping_list) VALUES ('$json_str')";
    if ($conn->query($sql) === TRUE) {
        $last_id = $conn->insert_id;
    } else {
        echo "Error: " . $sql . "
        " . $conn->error;
    }

    $id_str = base_convert($last_id, 10, 36);
    //$id_str = str_pad($id_str, 6, "0", STR_PAD_LEFT);

    //$id_dec = base_convert($id_str, 36, 10);
    $conn->close();

    echo $id_str;

    
?>