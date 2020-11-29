<?php
//created by Alexander Maushammer
if($_SERVER["SERVER_NAME"]=='localhost'){
	  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	      header('Access-Control-Allow-Origin: *');
	      header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
	      header('Access-Control-Allow-Headers: token, Content-Type');
	      header('Access-Control-Max-Age: 1728000');
	      header('Content-Length: 0');
	      header('Content-Type: text/plain');
	      die();
	  }
	  header('Access-Control-Allow-Origin: *');
	  header('Content-Type: application/json');
}

$error_msg;
try {
		$fileName = "../php-data/report.json";
		$reportFile = fopen($fileName, "r") or die("Unable to open file!");
		$jsonText = fread($reportFile,filesize($fileName));
		fclose($reportFile);
		$data = json_decode($jsonText, true);
		printf(json_encode(array_values($data)));
}
catch (Exception $e) {
	$error_msg = "error: ".$e;
}

if(isset($error_msg))
{
	printf($error_msg);
}

?>
