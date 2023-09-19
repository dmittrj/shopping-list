<?php
    require 'database.php';
    $share = $_GET['id'];
    $id = base_convert($share, 36, 10);

    $conn = connect();

    $sql = "SELECT `variation` FROM `collaborations` WHERE `id` = $id";
    $result = $conn->query($sql);
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $variation = $row["variation"];
    } else {
        $variation = -1;
    }

    //$id_str = str_pad($id_str, 6, "0", STR_PAD_LEFT);

    //$id_dec = base_convert($id_str, 36, 10);
    $conn->close();

    echo $variation;
?>