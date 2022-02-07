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
        //polaczDwa = new zapytajMongo("","",["_id" => $gotowiec],[],"mo1482_kuchnia.dania_Zrobione_doSprawdzenia","eleventh");
        //string $skladnikDoBazy, string $wybranaWartosc,array $filters, array $options, string $location, string $function
        $username = "";
        $password = "";
        $dbhost = "localhost";
        $dbport = '27017';
        $polaczenieDwa = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $zapytanie = new MongoDB\Driver\Query([],[]);
        $doBazy = $polaczenieDwa->executeQuery('apkomunikacja.uzytkownicy', $zapytanie);
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