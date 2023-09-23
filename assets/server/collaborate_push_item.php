<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');

    $item = json_decode($json_str, true)["item"];
    $source = base_convert(json_decode($json_str, true)["source"], 36, 10);
    
    $conn = connect();

    $sql = "INSERT INTO collaborations_items (list_id, list_item) VALUES ($source, '$item')";
    $conn->query($sql);

    $sql = "UPDATE collaborations_lists SET `list_version` = `list_version` + 1 WHERE `list_id` = $source";
    $conn->query($sql);

    //CREATE TABLE `$dbname`.`collaborations_items` ( `item_id` INT UNSIGNED NOT NULL , `list_id` INT NOT NULL , `list_item` VARCHAR(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL , PRIMARY KEY (`item_id`)) ENGINE = MyISAM CHARSET=utf8 COLLATE utf8_general_ci;

    $conn->close();

    echo $id_str;
?>