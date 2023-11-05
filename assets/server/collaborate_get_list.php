<?php
    require 'database.php';
    
    $id = base_convert($_GET['id'], 36, 10);

    create_table('collaborations_lists', [TABLE_COLLABOR_LISTS]);
    create_table('collaborations_items', [TABLE_COLLABOR_ITEMS]);

    $conn = connect();

    $sql = "SELECT `item_id`, `list_item`, `list_item_id` FROM `collaborations_items` WHERE `list_id` = $id ORDER BY `item_id`";
    $result = $conn->query($sql);
    $list_items = array();

    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $list_item["list_item"] = $row["list_item"];
            $list_item["item_id"] = $row["list_item_id"];
            $list_items[] = $list_item;
        }
    }

    $sql = "SELECT `list_title`, `list_version` FROM `collaborations_lists` WHERE `list_id` = $id";
    $result = $conn->query($sql);

    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $version = $row["list_version"];
        $title = $row["list_title"];
    } else {
        $version = -1;
    }

    $conn->close();

    $json_data = json_encode(array("list_items" => json_encode($list_items), "version" => $version, "title" => $title));
    echo $json_data;
?>