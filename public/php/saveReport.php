<?php
//created by Alexander Maushammer
/**
* Add allowed codes in this array
**/
$codes = array(
	"secreteCode" => true,
	"psst" => true
);

$error_msg = "no error";
try {
	$entityBody = json_decode(file_get_contents('php://input'), true);
	$codeFileName = "../php-data/codes.json";

	$codeFile = fopen($codeFileName, "r") or die("Unable to open file!");
	$codeText = fread($codeFile,filesize($codeFileName));
	fclose($codeFile);
	$codes = json_decode($codeText, true);

	if(array_key_exists($entityBody["code"], $codes))
	{
		$fileName = "../php-data/report.json";
		$jsonText = "{}";

		if(file_exists($fileName))
		{
			$reportFile = fopen($fileName, "r") or die("Unable to open file!");
			$jsonText = fread($reportFile,filesize($fileName));
			fclose($reportFile);
		}
		$oldData = json_decode($jsonText, true);
		$oldData[$entityBody["code"]] = $entityBody["data"];

		$reportFile = fopen($fileName, "w") or die("Unable to open file!");
		fwrite($reportFile, json_encode($oldData));
		fclose($reportFile);
	}
}
catch (Exception $e) {
	$error_msg = "error: ".$e;
}

if($error_msg)
{
	printf($error_msg);
}

?>
