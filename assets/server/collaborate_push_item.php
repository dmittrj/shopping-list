<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');

    $item = json_decode($json_str, true)["item"];
    $source = base_convert(json_decode($json_str, true)["source"], 36, 10);
    
    $conn = connect();

    $sql = "SELECT (list_last_id) FROM collaborations_lists WHERE `list_id` = $source";
    $result = $conn->query($sql);
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $last_id = $row["list_last_id"];

        $sql = "UPDATE collaborations_lists SET `list_last_id` = `list_last_id` + 1 WHERE `list_id` = $source";
        $conn->query($sql);
    } else {
        $last_id = 0;
    }

    $sql = "INSERT INTO collaborations_items (list_id, list_item_id, list_item) VALUES ($source, $last_id, '$item')";
    $conn->query($sql);

    $sql = "UPDATE collaborations_lists SET `list_version` = `list_version` + 1 WHERE `list_id` = $source";
    $conn->query($sql);

    //CREATE TABLE `$dbname`.`collaborations_items` ( `item_id` INT UNSIGNED NOT NULL , `list_id` INT NOT NULL , `list_item` VARCHAR(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL , PRIMARY KEY (`item_id`)) ENGINE = MyISAM CHARSET=utf8 COLLATE utf8_general_ci;

    $conn->close();

    echo $last_id;
?>