<?php
    $json_str = file_get_contents('php://input');
    
    $servername = "localhost";
    $username = "username";
    $password = "password";
    $dbname = "database";
    $conn = new mysqli($servername, $username, $password, $dbname);

    $sql = "INSERT INTO collaborations_lists (list_title) VALUES ('$json_str')";
    if ($conn->query($sql) === TRUE) {
        $last_id = $conn->insert_id;
    } else {
        echo "Error: " . $sql . "
        " . $conn->error;
    }

    //CREATE TABLE `$dbname`.`collaborations_lists` ( `list_id` INT UNSIGNED NOT NULL , `list_title` VARCHAR(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL , `list_version` INT UNSIGNED NOT NULL DEFAULT '0' , PRIMARY KEY (`list_id`)) ENGINE = MyISAM CHARSET=utf8 COLLATE utf8_general_ci;

    $id_str = base_convert($last_id, 10, 36);
    //$id_str = str_pad($id_str, 6, "0", STR_PAD_LEFT);

    //$id_dec = base_convert($id_str, 36, 10);
    $conn->close();

    echo $id_str;
?>