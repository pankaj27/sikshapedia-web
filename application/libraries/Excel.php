<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');
 
require_once APPPATH."/third_party/PHPExcel.php";
require_once APPPATH."/third_party/PHPExcel/IOFactory.php";

class chunkReadFilter implements PHPExcel_Reader_IReadFilter 
{ 
    private $_startRow = 0; 
    private $_endRow   = 0; 

    /**  Set the list of rows that we want to read  */ 
    public function setRows($startRow, $chunkSize) { 
        $this->_startRow = $startRow; 
        $this->_endRow   = $startRow + $chunkSize; 
    } 

    public function readCell($column, $row, $worksheetName = '') { 
        //  Only read the heading row, and the configured rows 
        if (($row == 1) ||
            ($row >= $this->_startRow && $row < $this->_endRow)) { 
            return true; 
        } 
        return false; 
    } 
} 




class Excel extends PHPExcel {
    public function __construct() {
        parent::__construct();
    }


    public function getColumnData($inputFileName,$column){
    	try{
    		$inputFileType = PHPExcel_IOFactory::identify($inputFileName);
		    $objReader = PHPExcel_IOFactory::createReader($inputFileType);
		    $objPHPExcel = $objReader->load($inputFileName);

		    $sheet = $objPHPExcel->getSheet(0); 
	    	$lastRow = $sheet->getHighestRow();
			for ($row = 2; $row <= $lastRow; $row++) {
			    $cell[] = $sheet->getCellByColumnAndRow($column,$row)->getValue();
			}
    	} catch(Exception $e) {
		    $cell['error']='Error loading file "'.pathinfo($inputFileName,PATHINFO_BASENAME);
		}

		return $cell;
    }


    public function getCellValue(){
    	
    }


    public function addCellValues($inputFileName,$data){

    }


    public function getRangedColumnData($inputFileName,$fromColumn,$toColumn,$show_first_row=FALSE){
    	try{
    		$inputFileType = PHPExcel_IOFactory::identify($inputFileName);
		    $objReader = PHPExcel_IOFactory::createReader($inputFileType);
		    $objPHPExcel = $objReader->load($inputFileName);

		     //  Get worksheet dimensions
			$sheet = $objPHPExcel->getSheet(0); 
			$highestRow = $sheet->getHighestRow(); 
			$highestColumn = $toColumn;

			if($show_first_row==FALSE){
				for ($row = 2; $row <= $highestRow; $row++){ 
				    //  Read a row of data into an array
				    $rowData[] = $sheet->rangeToArray($fromColumn . $row . ':' . $highestColumn . $row);  
				}
			}else{
				for ($row = 1; $row <= $highestRow; $row++){ 
				    //  Read a row of data into an array
				    $rowData[] = $sheet->rangeToArray($fromColumn . $row . ':' . $highestColumn . $row);  
				}
			}
				

    	} catch(Exception $e) {
		    $rowData['error']='Error loading file "'.pathinfo($inputFileName,PATHINFO_BASENAME);
		}

		return $rowData;
    }

    public function HTML2Excel($html,$filename){
    	try{

    		$filename = "DownloadReport";

			// Put the html into a temporary file
			$tmpfile = time().'.html';
			file_put_contents($tmpfile, $html);

			// Read the contents of the file into PHPExcel Reader class
			$reader = new PHPExcel_Reader_HTML; 
			$content = $reader->load($tmpfile); 

			$file_name=FCPATH.'uploads/temps/'.$filename.'.xls';
			$file_rel_path=base_url().'uploads/temps/'.$filename.'.xls';

			// Pass to writer and output as needed
			$objWriter = PHPExcel_IOFactory::createWriter($content, 'Excel2007');
			$objWriter->save($file_name);

			// Delete temporary file
			unlink($tmpfile);

			header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); // header for .xlxs file
			header('Content-Disposition: attachment;filename='.$filename); // specify the download file name
			header('Cache-Control: max-age=0');

			// Creates a writer to output the $objPHPExcel's content
			$writer = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
			$writer->save('php://output');

			//return $file_rel_path;
    		
    	}catch(Exception $e){
    		return 'Error loading file "'.pathinfo($inputFileName,PATHINFO_BASENAME);
    	}
    }


    public function extractData($inputFileName){

		//  Read your Excel workbook
		try {
		    $inputFileType = PHPExcel_IOFactory::identify($inputFileName);
		    $objReader = PHPExcel_IOFactory::createReader($inputFileType);
		    $objPHPExcel = $objReader->load($inputFileName);

		    //  Get worksheet dimensions
			$sheet = $objPHPExcel->getSheet(0); 
			$highestRow = $sheet->getHighestRow(); 
			$highestColumn = $sheet->getHighestColumn();


			//echo $highestRow;die;

			//  Loop through each row of the worksheet in turn
			for ($row = 2; $row <= $highestRow; $row++){ 
			    //  Read a row of data into an array
			    $rowData[] = $sheet->toArray(null,true,true,true);//$sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row);  
			}

			$rowData = array_map('array_filter', $rowData);
        	$rowData = array_filter($rowData);

		} catch(Exception $e) {
		    $rowData['error']='Error loading file "'.pathinfo($inputFileName,PATHINFO_BASENAME);
		}
		
		return $rowData;	
    }



    public function read_attendance_excel_format1($inputFileName){

		if (!file_exists($inputFileName)) {
		    exit("Can't find file.");
		}
		/** detect the type of file **/
		PHPExcel_Cell::setValueBinder( new PHPExcel_Cell_AdvancedValueBinder() );
		$inputFileType = PHPExcel_IOFactory::identify($inputFileName);
		/** load the data,**/
		$objReader = PHPExcel_IOFactory::createReader($inputFileType);
		/** if we read only the data, then dates are funky **/
		//$objReader->setReadDataOnly(true);
		$objReader->setLoadAllSheets();
		$objPHPExcel = $objReader->load($inputFileName);
		 
		 
		$spreadsheet_data = array();
		 
		foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
		    //echo 'Worksheet - ' , $worksheet->getTitle();

		    $rows='';
		 
		    foreach ($worksheet->getRowIterator() as $row) {
		        //echo ' Row number - '. $row->getRowIndex();
		        $rows.='<table class="table table-striped table-bordered table-condensed dataTable no-footer dtr-inline collapsed">';
		    	$rows.='<thead>';
		        if($row->getRowIndex()==1){
			        $cellIterator = $row->getCellIterator();
			       // $cellIterator->setIterateOnlyExistingCells(true); // Loop all cells, even if it is not set
			        $rows.='<tr>';
			        foreach ($cellIterator as $cell) {
			        	
			           // if (!is_null($cell)) {
			                if(PHPExcel_Shared_Date::isDateTime($cell)) {
			                    //echo ' Cell - ' , $cell->getColumn() , $cell->getRow() , ' - ' , date('r',PHPExcel_Shared_Date::ExcelToPHP($cell->getValue())) ,  '(' , $cell->getDataType(), ')';
			                    $spreadsheet_data[$cell->getColumn()][$cell->getRow()] = PHPExcel_Shared_Date::ExcelToPHP($cell->getValue());

			                    $val=date('d-M-Y',PHPExcel_Shared_Date::ExcelToPHP($cell->getValue()));
			                } else {
			                   // echo ' Cell - ' , $cell->getColumn() , $cell->getRow() , ' - ' , $cell->getFormattedValue() ,  '(' , $cell->getDataType(), ')';
			                    $spreadsheet_data[$cell->getColumn()][$cell->getRow()] =  $cell->getFormattedValue();
			                    $val= $cell->getFormattedValue();
			                }

			                $rows.='<th>' . $val . '</th>';
			           // }  
			        }

					$rows.='</tr>';
			        $rows.='</thead>';
			        $rows.='<tbody>';	
		        }else{
		        	$cellIterator = $row->getCellIterator();
			        $cellIterator->setIterateOnlyExistingCells(false); // Loop all cells, even if it is not set
			        $rows.='<tr>';
			        foreach ($cellIterator as $cell) {
			        	
			            if (!is_null($cell)) {
			                if(PHPExcel_Shared_Date::isDateTime($cell)) {
			                    //echo ' Cell - ' , $cell->getColumn() , $cell->getRow() , ' - ' , date('r',PHPExcel_Shared_Date::ExcelToPHP($cell->getValue())) ,  '(' , $cell->getDataType(), ')';
			                    $spreadsheet_data[$cell->getColumn()][$cell->getRow()] = PHPExcel_Shared_Date::ExcelToPHP($cell->getValue());

			                    $val=date('d-M-Y',PHPExcel_Shared_Date::ExcelToPHP($cell->getValue()));
			                } else {
			                   // echo ' Cell - ' , $cell->getColumn() , $cell->getRow() , ' - ' , $cell->getFormattedValue() ,  '(' , $cell->getDataType(), ')';
			                    $spreadsheet_data[$cell->getColumn()][$cell->getRow()] =  $cell->getFormattedValue();
			                    $val= $cell->getFormattedValue();
			                }

			                $rows.='<td>' . $val . '</td>';
			            }  
			        }

					$rows.='</tr>';   
		        }

		        $rows.='</tbody>';

		        $rows.='</table>';
		    }

		    return $rows;
		 
		    //var_dump($spreadsheet_data);
		}
    }



    public function read_attendance_excel_format($inputFileName,$data_mapped=FALSE){
    	$objPHPExcel = PHPExcel_IOFactory::load($inputFileName);
    	$rows='';
    	foreach ($objPHPExcel->getWorksheetIterator() as $worksheet){
    		$worksheetTitle     = $worksheet->getTitle();
		    $highestRow         = $worksheet->getHighestRow(); // e.g. 10
		    $highestColumn      = $worksheet->getHighestColumn(); // e.g 'F'
		    $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
		    $nrColumns = ord($highestColumn) - 64;
		    $rows.='<table class="table table-striped table-bordered table-condensed dataTable no-footer dtr-inline collapsed">';
		    $rows.='<thead>';
		    for ($row = 1; $row <= $highestRow; ++ $row) {
		     	if($row==1){

		     		$rows.='<tr>';
		     		$rows.='<th>'.$row.'</th>';
			        for ($col = 0; $col < $highestColumnIndex; ++ $col) {
			            $cell = $worksheet->getCellByColumnAndRow($col, $row);
			            $val = $cell->getValue();
			            $dataType = PHPExcel_Cell_DataType::dataTypeForValue($val);

			            //$cell = $excel->getActiveSheet()->getCell($col . $i);
						//$InvDate= $cell->getValue();

						if($dataType==PHPExcel_Cell_DataType::TYPE_NUMERIC && PHPExcel_Shared_Date::isDateTime($cell)){
					    	$val = '<input type="text" class="date_picker" name="att_data['.$row.'][att_dates]" value="'. date('d-M-Y', PHPExcel_Shared_Date::ExcelToPHP($val)) .'" readonly>'; 
						}else{
							$val=$val;
						}

						//$rows.='<th><input type="text" class="form-control" value="'. $val .'"><button type=""button class="btn btn-xs btn-danger btn_del"><i class="fa fa-trash"></i></button></th>'; 

						if($data_mapped==FALSE){
							$rows.='<th id="th'.$col.'">'. $val .'<br>';
					    	$rows.='<select class="selected_map_to" data-id="'.$col.'" name="att_data['.$row.'][att_map_to]">';
					    	$rows.='<option value="company_id">Map To Company</option>';
					    	$rows.='<option value="department_id">Map To Company Department</option>';
					    	$rows.='<option value="branch_id">Map To Company Branch</option>';
					    	$rows.='<option value="region_id">Map To Company Region</option>';
					    	$rows.='<option value="emp_code">Map To Emp Code</option>';
					    	$rows.='<option value="att_date">Map To Emp Attendance Date</option>';
					    	$rows.='<option value="check_in_date">Map To Emp Checkin Time</option>';
					    	$rows.='<option value="check_out_date">Map To Emp Checkout Time</option>';
					    	$rows.='</select><button type=""button class="btn btn-xs btn-danger btn_del" data-id="'.$col.'""><i class="fa fa-trash"></i></button>';
							$rows.='</th>';
						}else{
							$rows.='<th id="th'.$col.'">'. $val .'</th>';
						}	  
			        }

			        $rows.='</tr>';
		     	}
		    }
 
		    $rows.='</thead>';
		    $rows.='<tbody>';

		    for ($row = 2; $row <= $highestRow; ++ $row) {
		        $rows.='<tr>';
		        $rows.='<td>'.$row.'</td>';
		        for ($col = 0; $col < $highestColumnIndex; ++ $col) {
		            $cell = $worksheet->getCellByColumnAndRow($col, $row);
		            $val = $cell->getValue();
		            $dataType = PHPExcel_Cell_DataType::dataTypeForValue($val);

		            if($dataType==PHPExcel_Cell_DataType::TYPE_NUMERIC && PHPExcel_Shared_Date::isDateTime($cell)){
				    	$val = date('d-M-Y', PHPExcel_Shared_Date::ExcelToPHP($val)); 
					}else{
						$val=$val;
					}

		            $rows.='<td id="th'.$col.'"><input type="hidden" id="" name="att_data['.$row.'][att_value]" value="'. $val .'">'. $val .'</td>';

					// $rows.='<td><input type="text" class="form-control" value="'. $val .'"></td>';
		        }
		        $rows.='</tr>';
		    }
		    $rows.='</tbody>';
		    $rows.='</table>';
    	}

    	return $rows;
    }


    public function readtData($inputFileName){
		$objPHPExcel = PHPExcel_IOFactory::load($inputFileName);
		foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
		    $worksheetTitle     = $worksheet->getTitle();
		    $highestRow         = $worksheet->getHighestRow(); // e.g. 10
		    $highestColumn      = $worksheet->getHighestColumn(); // e.g 'F'
		    $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
		    $nrColumns = ord($highestColumn) - 64;
		    // echo "<br>The worksheet ".$worksheetTitle." has ";
		    // echo $nrColumns . ' columns (A-' . $highestColumn . ') ';
		    // echo ' and ' . $highestRow . ' row.';
		    // echo '<br>Data: <table border="1"><tr>';

		    for ($row = 1; $row <= $highestRow; ++ $row) {
		        for ($col = 0; $col < $highestColumnIndex; ++ $col) {
		            $cell = $worksheet->getCellByColumnAndRow($col, $row);
		            $val = $cell->getValue();
		            $dataType = PHPExcel_Cell_DataType::dataTypeForValue($val);

		            $rows[]=$val;
		        }
		    }


		    return $rows;



		    // for ($row = 1; $row <= $highestRow; ++ $row) {
		    //     echo '<tr>';
		    //     for ($col = 0; $col < $highestColumnIndex; ++ $col) {
		    //         $cell = $worksheet->getCellByColumnAndRow($col, $row);
		    //         $val = $cell->getValue();
		    //         $dataType = PHPExcel_Cell_DataType::dataTypeForValue($val);
		    //         echo '<td>' . $val . '</td>';

		    //         //<br>(Typ ' . $dataType . ')
		    //     }
		    //     echo '</tr>';
		    // }
		    // echo '</table>';
		}
    }


    // public function readData($inputFileName){
    // 	 require_once APPPATH.'libraries/phpexcel/PHPExcel.php';
	   //    require_once APPPATH.'libraries/phpexcel/PHPExcel/IOFactory.php';
	   //    in controller add the following code to read spread sheet by active sheet
	   //   //initialize php excel first  
	   //   ob_end_clean();
	   //   //define cachemethod
	   //   $cacheMethod   = PHPExcel_CachedObjectStorageFactory::cache_to_phpTemp;
	   //   $cacheSettings = array('memoryCacheSize' => '20MB');
	   //   //set php excel settings
	   //   PHPExcel_Settings::setCacheStorageMethod(
	   //          $cacheMethod,$cacheSettings
	   //        );

	   //  $arrayLabel = array("A","B","C","D","E");
	   //  //=== set object reader
	   //  $objectReader = PHPExcel_IOFactory::createReader('Excel2007');
	   //  $objectReader->setReadDataOnly(true);

	   //  $objPHPExcel = $objectReader->load($inputFileName);
	   //  $objWorksheet = $objPHPExcel->setActiveSheet('Sheet1');

	   //  $starting = 1;
	   //  $end      = 3;
	   //  for($i = $starting;$i<=$end; $i++)
	   //  {

	   //     for($j=0;$j<count($arrayLabel);$j++)
	   //     {
	   //         //== display each cell value
	   //         echo $objWorksheet->getCell($arrayLabel[$j].$i)->getValue();
	   //     }
	   //  }
	   //   //or dump data
	   //   $sheetData = $objPHPExcel->getActiveSheet()->toArray(null,true,true,true);
	   //   var_dump($sheetData);

	   //   //see also the following link
	   //   http://blog.mayflower.de/561-Import-and-export-data-using-PHPExcel.html
	   //   ----------- import in another style around 5000 records ------
	   //   $this->benchmark->mark('code_start');
	   //  //=== change php ini limits. =====
	   //  $cacheMethod = PHPExcel_CachedObjectStorageFactory:: cache_to_phpTemp;
	   //  $cacheSettings = array( ' memoryCacheSize ' => '50MB');
	   //  PHPExcel_Settings::setCacheStorageMethod($cacheMethod, $cacheSettings);
	   //  //==== create excel object of reader
	   //  $objReader = PHPExcel_IOFactory::createReader('Excel2007');
	   //  //$objReader->setReadDataOnly(true);
	   //  //==== load forms tashkil where the file exists
	   //  $objPHPExcel = $objReader->load("./forms/5000records.xlsx");
	   //  //==== set active sheet to read data
	   //  $worksheet  = $objPHPExcel->setActiveSheetIndexbyName('Sheet1');


	   //  $highestRow         = $worksheet->getHighestRow(); // e.g. 10
	   //  $highestColumn      = $worksheet->getHighestColumn(); // e.g 'F'
	   //  $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
	   //  $nrColumns          = ord($highestColumn) - 64;
	   //  $worksheetTitle     = $worksheet->getTitle();

	   //  echo "<br>The worksheet ".$worksheetTitle." has ";
	   //  echo $nrColumns . ' columns (A-' . $highestColumn . ') ';
	   //  echo ' and ' . $highestRow . ' row.';
	   //  echo '<br>Data: <table border="1"><tr>';
	   //  //----- loop from all rows -----
	   //  for ($row = 1; $row <= $highestRow; ++ $row) 
	   //  {
	   //      echo '<tr>';
	   //      echo "<td>".$row."</td>";
	   //      //--- read each excel column for each row ----
	   //      for ($col = 0; $col < $highestColumnIndex; ++ $col) 
	   //      {
	   //          if($row == 1)
	   //          {
	   //              // show column name with the title
	   //               //----- get value ----
	   //              $cell = $worksheet->getCellByColumnAndRow($col, $row);
	   //              $val = $cell->getValue();
	   //              //$dataType = PHPExcel_Cell_DataType::dataTypeForValue($val);
	   //              echo '<td>' . $val ."(".$row." X ".$col.")".'</td>';
	   //          }
	   //          else
	   //          {
	   //              if($col == 9)
	   //              {
	   //                  //----- get value ----
	   //                  $cell = $worksheet->getCellByColumnAndRow($col, $row);
	   //                  $val = $cell->getValue();
	   //                  //$dataType = PHPExcel_Cell_DataType::dataTypeForValue($val);
	   //                  echo '<td>zone ' . $val .'</td>';
	   //              }
	   //              else if($col == 13)
	   //              {
	   //                  $date = PHPExcel_Shared_Date::ExcelToPHPObject($worksheet->getCellByColumnAndRow($col, $row)->getValue())->format('Y-m-d');
	   //                  echo '<td>' .dateprovider($date,'dr') .'</td>';
	   //              }
	   //              else
	   //              {
	   //                   //----- get value ----
	   //                  $cell = $worksheet->getCellByColumnAndRow($col, $row);
	   //                  $val = $cell->getValue();
	   //                  //$dataType = PHPExcel_Cell_DataType::dataTypeForValue($val);
	   //                  echo '<td>' . $val .'</td>';
	   //              }
	   //          }
	   //      }
	   //      echo '</tr>';
	   //  }
	   //  echo '</table>';
	   //  $this->benchmark->mark('code_end');

	   //  echo "Total time:".$this->benchmark->elapsed_time('code_start', 'code_end');     
	   //  $this->load->view("error");
    // }


    function isEmptyRow($row) {
	    foreach($row as $cell){
	        if (null !== $cell) return false;
	    }
	    return true;
	}


    public function readFile($inputFileName){

    	try{

    		if(file_exists($inputFileName)){

    			/**  Identify the type of $inputFileName  **/
				$inputFileType = PHPExcel_IOFactory::identify($inputFileName);
				/**  Create a new Reader of the type that has been identified  **/
				$objReader = PHPExcel_IOFactory::createReader($inputFileType);
				/**  Define how many rows we want to read for each "chunk"  **/ 
				$chunkSize = 2048; 
				/**  Create a new Instance of our Read Filter  **/ 
				$chunkFilter = new chunkReadFilter(); 

				/**  Tell the Reader that we want to use the Read Filter  **/ 
				$objReader->setReadFilter($chunkFilter); 

				/**  Advise the Reader that we only want to load cell data  **/
				$objReader->setReadDataOnly(true);
				/**  Load $inputFileName to a PHPExcel Object  **/

				/**  Loop to read our worksheet in "chunk size" blocks  **/ 
				for ($startRow = 2; $startRow <= 65000; $startRow += $chunkSize) { 
				    /**  Tell the Read Filter which rows we want this iteration  **/ 
				    $chunkFilter->setRows($startRow,$chunkSize); 
				    /**  Load only the rows that match our filter  **/ 
				    $objPHPExcel = $objReader->load($inputFileName); 
				    //    Do some processing here 

				    $sheetData[] = $objPHPExcel->getActiveSheet()->toArray(null,true,true,true);

				}

				return $sheetData;

    		}

    	}catch(Exception $e){

    	}
    }



    public function read_file($inputFileName,$start_row){


    	$objReader= PHPExcel_IOFactory::createReader('Excel2007');
    	$objReader->setReadDataOnly(true);
		$objPHPExcel=$objReader->load($inputFileName);
		$totalrows=$objPHPExcel->setActiveSheetIndex(0)->getHighestRow();
        $objWorksheet=$objPHPExcel->setActiveSheetIndex(0);
        for($i=start_row;$i<=$totalrows;$i++){
        	
        }
    }

    public function write_attendance_file($filename,$emp_codes=null){

		$date_range=rangeMonth(date('Y-m-d'));
		for ($i=$date_range['start']; $i <=$date_range['end'] ; $i++){
			$arr[]=$i;
		}

    	if(!isset($emp_codes)){
    		$objPHPExcel = new PHPExcel();
			// create the writer
			$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, "Excel2007");

			// writer already created the first sheet for us, let's get it
			$objSheet = $objPHPExcel->getActiveSheet();
			// rename the sheet
			$objSheet->setTitle($filename);

			// let's bold and size the header font and write the header
			// as you can see, we can specify a range of cells, like here: cells from A1 to A4
			//$objSheet->getStyle('A1:D1')->getFont()->setBold(true)->setSize(12);

			// write header
			$objSheet->getCell('A1')->setValue('Dates');
			$objSheet->getCell('A2')->setValue('Emp Codes');
			$j=1;
			$c=0;
			$z=1;
			for ($i=1; $i <=count($arr)*2 ; $i++) {
				$d=$i+1;
				if($c>0){					
					if(!odd_even($c)){
						$objSheet->getCell(columnLetter($c+1).'1')->setValue($arr[$z-1]);
					}else{
						$z++;
					}
				}
				
				if(odd_even($d)){
					$objSheet->getCell(columnLetter($d).'2')->setValue('In Time');	
				}else{
					$objSheet->getCell(columnLetter($d).'2')->setValue('Out Time');	
				}

				$c++;
			}

			$file=FCPATH.'uploads/'.$filename.'.xlsx';
			$objWriter->save($file);
    	}

    	$file=FCPATH.'uploads/'.$filename.'.xlsx';

		$objReader = PHPExcel_IOFactory::createReader("Excel2007");
		$objPHPExcel2 = $objReader->load($file);
		$colstart=2;
		for ($i=1; $i <=count($arr)*2 ; $i++) {
			// echo $i.'-'.$j.'-'.nice_date($i,'d/m/Y').'-'.columnLetter($colstart).'<br>';
			$merged_col=columnLetter($colstart).'1:'.columnLetter($colstart+1).'1';
			$objPHPExcel2->getActiveSheet()->mergeCells($merged_col);
			// $style = array(
		 //        'alignment' => array(
		 //            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
		 //        )
		 //    );

		 //    $objPHPExcel2->getActiveSheet()->getStyle($merged_col)->applyFromArray($style);

			$colstart++;
		}

		if(isset($emp_codes) && !empty($emp_codes)){	
			$x=3;
			foreach ($emp_codes as $key => $value) {
				//echo 'A'.$x;
				$objPHPExcel2->getActiveSheet()->SetCellValue('A'.$x, $x);
				$x++;
			}
			// Write the file
			$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel2, "Excel2007");
			$objWriter->save($filename.'.xlsx');
		}

		return base_url().'uploads/'.$filename.'.xlsx';
    }
}



// $sheet = $objPHPExcel->getSheet(0); 
// $highestRow = $sheet->getHighestDataRow(); 
// $highestColumn = $sheet->getHighestDataColumn();
// for ($row = 2; $row <= $highestRow; $row++){ 
//     $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,NULL,TRUE,FALSE);
//     if(isEmptyRow(reset($rowData))) { continue; } // skip empty row
//     // do something usefull
// }

// function isEmptyRow($row) {
//     foreach($row as $cell){
//         if (null !== $cell) return false;
//     }
//     return true;
// }

?>