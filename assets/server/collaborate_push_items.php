<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');

    $obj = json_decode($json_str, true);
    $items = $obj["items"];
    $source = base_convert($obj["source"], 36, 10);
    
    $conn = connect();

    for ($i=0; $i < count($items); $i++) { 
        $item = $items[$i];

        $sql = "INSERT INTO collaborations_items (list_id, list_item) VALUES ($source, '$item')";
        $conn->query($sql);
    }

    //CREATE TABLE `$dbname`.`links` ( `id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT , `shopping_list` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL , PRIMARY KEY (`id`)) ENGINE = MyISAM CHARSET=utf8 COLLATE utf8_general_ci;
    
    $conn->close();

    echo 0;
?>