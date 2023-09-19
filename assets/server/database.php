<?php
    $servername = "localhost";
    $username = "username";
    $password = "password";
    $dbname = "database";

    function connect() {
        global $servername;
        global $username;
        global $password;
        global $dbname;
        return new mysqli($servername, $username, $password, $dbname);
    }
?>