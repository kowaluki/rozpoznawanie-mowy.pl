<?php
$url = $_SERVER['REQUEST_URI'];
$url = explode("/",$url);
switch($url[3]) {
    case "":
        require_once "documents/index.html";
        exit();
    break;
    case "jQuery":
    header("Type: aplication/javascript");
        require_once "scripts/jQuery.js";
        exit();
    break;
    case "main.javaScript":
        header("Type: aplication/javascript");
        require_once "scripts/main.js";
    exit();
    case "main.style":
        header("Type: text/css");
        require_once "styles/main.css";
        exit();
    break;
    case "downloadUsers":
        $username = "mo1482_apkom";
        $password = "bazaAp1Komunikacja";
        $dbhost = "91.185.184.123";
        $dbport = '27017';
        $polaczenieDwa = new MongoDB\Driver\Manager("mongodb://${username}:${password}@$dbhost:$dbport/${username}");
        $zapytania = new MongoDB\Driver\Query([],[]);
        $doBazy = $polaczenieDwa->executeQuery($username.'.uzytkownicy', $zapytania);
        $wynik = [];
        $i= 0;
        foreach($doBazy as $kolejneDanie) {
            $wynik[$i] = $kolejneDanie;
            $i++;
        }
        echo json_encode($wynik);
        exit();
    break;
}



?>