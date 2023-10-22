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

    function get_dbname() {
        global $dbname;
        return $dbname;
    }

    function create_table($table_name, $table) {
        $conn = connect();
        $db_name = get_dbname();
        $columns = "";
        for ($i = 0; $i < count($table); $i++) { 
            $column = $table[$i];
            if ($i == 0) {
                preg_match('/`([^`]+)`/', $column, $matches);
                $primary_key = $matches[1];
            }
            $columns .= " " . $column . " ,";
        }
        $sql = "CREATE TABLE IF NOT EXISTS `$db_name`.`$table_name` ( $columns PRIMARY KEY(`$primary_key`)) ENGINE = MyISAM CHARSET=utf8 COLLATE utf8_general_ci";
        $conn->query($sql);

        $conn->close();
    }
?>