<?php
    require 'database.php';

    $id = base_convert($_GET['id'], 36, 10);

    $conn = connect();

    $sql = "SELECT `list_version` FROM `collaborations_lists` WHERE `list_id` = $id";
    $result = $conn->query($sql);
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $version = $row["list_version"];
    } else {
        $version = -1;
    }

    $conn->close();

    echo $version;
?>