<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');

    $item = json_decode($json_str, true)["item"];
    $source = base_convert(json_decode($json_str, true)["source"], 36, 10);

    create_table('collaborations_lists', TABLE_COLLABOR_LISTS);
    create_table('collaborations_items', TABLE_COLLABOR_ITEMS);
    
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

    $conn->close();
    echo $last_id;
?>