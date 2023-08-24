<?php
    $share = $_GET['id'];
    $id = base_convert($share, 36, 10);

    $servername = "localhost";
    $username = "username";
    $password = "password";
    $dbname = "database";
    $conn = new mysqli($servername, $username, $password, $dbname);

    $sql = "SELECT `shopping_list` FROM `links` WHERE `id` = $id";
    $result = $conn->query($sql);
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $shopping_list = $row["shopping_list"];
    } else {
        $shopping_list = "";
    }

    //$id_str = str_pad($id_str, 6, "0", STR_PAD_LEFT);

    //$id_dec = base_convert($id_str, 36, 10);
    $conn->close();

    echo $shopping_list;
?>