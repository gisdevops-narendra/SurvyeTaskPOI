<?php
$conn = pg_connect("host=localhost dbname=kltask user=postgres password=postgres");
// if($conn){
//     echo 'database connected ';
// }else{
//     echo 'failed to connect with database';
// }

$ufname = $_REQUEST['fname'];
$uftype = $_REQUEST['ftype'];
$uflong = $_REQUEST['longitude'];
$uflat = $_REQUEST['latitude'];
//echo($ufname,$uftype,$uflong,$uflat);

$add_query = "INSERT INTO public.database(fname, ftype, geom) VALUES ('$ufname','$uftype', ST_MakePoint($uflong,$uflat))";
$chkquery = pg_query($conn,$add_query) or die('insert query failed');



$sql = "SELECT fname, ftype FROM public.database";
$resultquery = pg_query($conn,$sql) or die('select query failed');


$output = '';
if(pg_num_rows($resultquery)>0){
$output = '<table>
                <tr>
                    <th>fname</th>
                    <th>ftype</th>
                </tr>
';

while($row = pg_fetch_assoc($resultquery)){
    $output .= "<tr>
                    <td>{$row["fname"]}</td>
                    <td>{$row["ftype"]}</td>
                </tr>";
}
$output .= "</table>";

echo $output;

}else{
    echo "<h2>no record found</h2>";
}
?>