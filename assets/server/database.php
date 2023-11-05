<?php
    define('TABLE_LINKS', "`id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT, `shopping_list` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL");
    define('TABLE_COLLABOR_LISTS', "`list_id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `list_title` VARCHAR(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL , `list_version` INT UNSIGNED NOT NULL DEFAULT '0'");
    define('TABLE_COLLABOR_ITEMS', "`item_id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `list_id` INT NOT NULL , `list_item_id` INT NOT NULL , `list_item` VARCHAR(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL");
    
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
        
        preg_match('/`([^`]+)`/', $table, $matches);
        $primary_key = $matches[1];

        $sql = "CREATE TABLE IF NOT EXISTS `$db_name`.`$table_name` ( $table , PRIMARY KEY(`$primary_key`)) ENGINE = MyISAM CHARSET=utf8 COLLATE utf8_general_ci";
        $conn->query($sql);

        $conn->close();
    }
?>