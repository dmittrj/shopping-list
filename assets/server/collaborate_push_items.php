<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');

    $obj = json_decode($json_str, true);
    $items = $obj["items"];
    $source = base_convert($obj["source"], 36, 10);

    create_table('collaborations_lists', [TABLE_COLLABOR_LISTS]);
    create_table('collaborations_items', [TABLE_COLLABOR_ITEMS]);
    
    $conn = connect();
    $items_count = count($items);

    for ($i = 0; $i < count($items); $i++) { 
        $item = $items[$i];

        $sql = "INSERT INTO collaborations_items (list_id, list_item_id, list_item) VALUES ($source, $i, '$item')";
        $conn->query($sql);
    }
    $sql = "UPDATE collaborations_lists SET `list_last_id` = $items_count WHERE `list_id` = $source";
    $conn->query($sql);

    $conn->close();
    echo 0;
?>