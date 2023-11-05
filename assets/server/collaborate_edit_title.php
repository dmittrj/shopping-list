<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');

    $source = json_decode($json_str, true)["source"];
    $new_title = json_decode($json_str, true)["new_title"];
    $source = base_convert(json_decode($json_str, true)["source"], 36, 10);

    create_table('collaborations_lists', TABLE_COLLABOR_LISTS);
    
    $conn = connect();

    $sql = "UPDATE collaborations_lists SET `list_title` = '$new_title' WHERE `list_id` = $source";
    $conn->query($sql);

    $sql = "UPDATE collaborations_lists SET `list_version` = `list_version` + 1 WHERE `list_id` = $source";
    $conn->query($sql);

    $conn->close();
    echo 'edited';
?>