<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');
    
    $conn = connect();

    $sql = "INSERT INTO collaborations_lists (list_title) VALUES ('$json_str')";
    if ($conn->query($sql) === TRUE) {
        $last_id = $conn->insert_id;
    } else {
        echo "Error: " . $sql . "
        " . $conn->error;
    }

    //CREATE TABLE `$dbname`.`collaborations_lists` ( `list_id` INT UNSIGNED NOT NULL , `list_title` VARCHAR(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL , `list_version` INT UNSIGNED NOT NULL DEFAULT '0' , PRIMARY KEY (`list_id`)) ENGINE = MyISAM CHARSET=utf8 COLLATE utf8_general_ci;

    $id_str = base_convert($last_id, 10, 36);
    $conn->close();

    echo $id_str;
?>