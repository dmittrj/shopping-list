<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');
    
    create_table('links', ["`id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT",
                           "`shopping_list` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL"]);
    $conn = connect();


    $sql = "INSERT INTO links (shopping_list) VALUES ('$json_str')";
    if ($conn->query($sql) === TRUE) {
        $last_id = $conn->insert_id;
    } else {
        echo "Error: " . $sql . "
        " . $conn->error;
    }

    //CREATE TABLE `$dbname`.`links` ( `id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT , `shopping_list` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL , PRIMARY KEY (`id`)) ENGINE = MyISAM CHARSET=utf8 COLLATE utf8_general_ci;


    $id_str = base_convert($last_id, 10, 36);
    //$id_str = str_pad($id_str, 6, "0", STR_PAD_LEFT);

    //$id_dec = base_convert($id_str, 36, 10);
    $conn->close();

    echo $id_str;

    
?>