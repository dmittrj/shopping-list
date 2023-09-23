<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');

    $obj = json_decode($json_str, true);
    $items = $obj["items"];
    $source = base_convert($obj["source"], 36, 10);

    //echo $json_str;
    //return;
    
    $conn = connect();

    for ($i=0; $i < count($items); $i++) { 
        $item = $items[$i];

        $sql = "INSERT INTO collaborations_items (list_id, list_item) VALUES ($source, '$item')";
        if ($conn->query($sql) === TRUE) {
            $last_id = $conn->insert_id;
        } else {
            echo "Error: " . $sql . "
            " . $conn->error;
        }
    }

    

    //CREATE TABLE `$dbname`.`links` ( `id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT , `shopping_list` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL , PRIMARY KEY (`id`)) ENGINE = MyISAM CHARSET=utf8 COLLATE utf8_general_ci;


    //$id_str = base_convert($last_id, 10, 36);
    //$id_str = str_pad($id_str, 6, "0", STR_PAD_LEFT);

    //$id_dec = base_convert($id_str, 36, 10);
    $conn->close();

    echo $id_str;
?>