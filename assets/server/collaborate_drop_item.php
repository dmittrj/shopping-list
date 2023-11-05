<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');
    $item = json_decode($json_str, true)["item_id"];
    $source = base_convert(json_decode($json_str, true)["source"], 36, 10);

    create_table('collaborations_lists', TABLE_COLLABOR_LISTS);
    create_table('collaborations_items', TABLE_COLLABOR_ITEMS);
    
    $conn = connect();

    $sql = "DELETE FROM collaborations_items WHERE `list_id` = $source AND `list_item_id` = $item";
    $conn->query($sql);

    $sql = "UPDATE collaborations_lists SET `list_version` = `list_version` + 1 WHERE `list_id` = $source";
    $conn->query($sql);

    $conn->close();
    echo $id_str;
?>