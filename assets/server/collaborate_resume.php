<?php
    require 'database.php';
    $json_str = file_get_contents('php://input');

    $source = base_convert($_GET['id'], 36, 10);

    create_table('collaborations_lists', TABLE_COLLABOR_LISTS);
    
    $conn = connect();

    $sql = "UPDATE `collaborations_lists` SET `list_status` = 1 WHERE `list_id` = $source";
    $conn->query($sql);

    $conn->close();

    echo $source;
?>