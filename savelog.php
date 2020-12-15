<?php
$myfile = fopen("mylog.txt", "a") or die("Unable to open file!");
$txt = $_POST['msg']; // incoming message
fwrite($myfile, $txt . "\n");
fclose($myfile);
header('Location: /'); // redirect back to the main site
?>
