<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');

    $item = json_decode($json_str, true)["item"];
    $source = base_convert(json_decode($json_str, true)["source"], 36, 10);

    create_table('collaborations_lists', TABLE_COLLABOR_LISTS);
    create_table('collaborations_items', TABLE_COLLABOR_ITEMS);
    
    $conn = connect();

    $sql = "SELECT `list_item_id` FROM `collaborations_lists` JOIN `collaborations_items` ON `collaborations_lists`.`list_id` = `collaborations_items`.`list_id` WHERE `collaborations_items`.`list_id` = $source ORDER BY `list_item_id` DESC LIMIT 1";
    $result = $conn->query($sql);
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $last_id = $row["list_item_id"] + 1;
    } else {
        $last_id = 0;
    }

    $sql = "INSERT INTO collaborations_items (list_id, list_item_id, list_item) VALUES ($source, $last_id, '$item')";
    $conn->query($sql);

    $conn->close();
    echo $last_id;
?>