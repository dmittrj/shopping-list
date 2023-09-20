<?php
    require 'database.php';
    $share = $_GET['id'];
    $id = base_convert($share, 36, 10);

    $conn = connect();

    $sql = "SELECT `list_version` FROM `collaborations_lists` WHERE `list_id` = $id";
    $result = $conn->query($sql);
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $variation = $row["list_version"];
    } else {
        $variation = -1;
    }

    //$id_str = str_pad($id_str, 6, "0", STR_PAD_LEFT);

    //$id_dec = base_convert($id_str, 36, 10);
    $conn->close();

    echo $variation;
?>