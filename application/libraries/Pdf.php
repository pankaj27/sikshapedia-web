<?php

if(!defined('BASEPATH')) exit('No direct script access allowed');

require_once dirname(__FILE__) . '/tcpdf/tcpdf.php';

class Pdf extends TCPDF { 
	function __construct() { 
		parent::__construct(); 
	}
	
	//Page header
    public function Header() {
       $image_file = K_PATH_IMAGES.'Orion_Logo_New.jpg';
       $img = file_get_contents($image_file);

        $this->Image($image_file, 10, 10, 15, '', 'JPG', '', 'T', false, 300, '', false, false, 0, false, false, false);

       $this->Image('@' . $img, 55, 19, '', '', 'JPG', '', 'T', false, 300, '', false, false, 0, false, false, false);
        // Set font
        $this->SetFont('helvetica', 'B', 20);
        // Title
        $this->Cell(0, 15, 'Sales Information for Products', 0, false, 'C', 0, '', 0, false, 'M', 'M');
    }

    // Page footer
    public function Footer() {
        // Position at 15 mm from bottom
        $this->SetY(-15);
        // Set font
        $this->SetFont('helvetica', 'I', 8);
        // Page number
        $this->Cell(0, 10, 'Page '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
    }   
}


    if(!function_exists('write_pdf')){

        function write_pdf($content=array(),$font_size=6,$output='F'){

           // echo PDF_HEADER_LOGO;die;

            if(is_array($content) && !empty($content) && isset($content['data_content']) && isset($content['data_file'])){

                $obj_pdf = new Pdf(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
                $obj_pdf->SetCreator(PDF_CREATOR);  
                $obj_pdf->SetTitle($content['data_title']);  
                $obj_pdf->SetHeaderData('', PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE, PDF_HEADER_STRING);
                $obj_pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));  
                $obj_pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));  
                $obj_pdf->SetDefaultMonospacedFont('helvetica');  
                $obj_pdf->SetFooterMargin(PDF_MARGIN_FOOTER);  
                $obj_pdf->SetMargins(PDF_MARGIN_LEFT, '5', PDF_MARGIN_RIGHT);
                $obj_pdf->setPrintHeader(false);  
                $obj_pdf->setPrintFooter(false);
                $obj_pdf->SetAutoPageBreak(TRUE, 10);  
                $obj_pdf->SetFont('helvetica', '',$font_size);  
                $obj_pdf->AddPage();
                $obj_pdf->writeHTML($content['data_content']);  
                $obj_pdf->Output($content['data_file'], $output);

            }       
        } 

    }

    function write_pdf2($content=array(),$font='helvetica',$font_size=6,$output='F'){

       // echo PDF_HEADER_LOGO;die;

        if(is_array($content) && !empty($content) && isset($content['data_content']) && isset($content['data_file'])){

            $obj_pdf = new Pdf(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
            $obj_pdf->SetCreator(PDF_CREATOR);  
            $obj_pdf->SetTitle($content['data_title']);  
            $obj_pdf->SetHeaderData('', PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE, PDF_HEADER_STRING);
            $obj_pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));  
            $obj_pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));  
            $obj_pdf->SetDefaultMonospacedFont($font);  
            $obj_pdf->SetFooterMargin(PDF_MARGIN_FOOTER);  
            $obj_pdf->SetMargins(PDF_MARGIN_LEFT, '0', PDF_MARGIN_RIGHT);
           // $obj_pdf->setPrintHeader(false);  
           // $obj_pdf->setPrintFooter(false);
            $obj_pdf->SetAutoPageBreak(TRUE, 10);  
            $obj_pdf->SetFont($font, '',$font_size);  
            $obj_pdf->AddPage();
            $obj_pdf->writeHTML($content['data_content'], true, false, false, false, '');  
            $obj_pdf->Output($content['data_file'], $output);

        }       
    }


    // function write_pdf3($content=array(),$font='helvetica',$font_size=6,$output='S'){

    //     if(is_array($content) && !empty($content) && isset($content['data_content']) && isset($content['data_file'])){
    //         // create new PDF document
    //         $pdf = new Pdf(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

    //         // set document information
    //         $pdf->SetCreator(PDF_CREATOR);
    //         $pdf->SetAuthor('Nicola Asuni');
    //         $pdf->SetTitle('TCPDF Example 006');
    //         $pdf->SetSubject('TCPDF Tutorial');
    //         $pdf->SetKeywords('TCPDF, PDF, example, test, guide');

    //         // set default header data
    //         $pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 006', PDF_HEADER_STRING);

    //         // set header and footer fonts
    //         $pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
    //         $pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

    //         // set default monospaced font
    //         $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

    //         // set margins
    //         $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
    //         $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
    //         $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

    //         // set auto page breaks
    //         $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

    //         // set image scale factor
    //         $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

    //         // set font
    //         $pdf->SetFont('dejavusans', '', 10);

    //         // add a page
    //         $pdf->AddPage();

    //         $html ='<h1>Test custom bullet image for list items</h1>
    //             <ul style="font-size:14pt;">
    //                 <li>test custom bullet image</li>
    //                 <li>test custom bullet image</li>
    //                 <li>test custom bullet image</li>
    //                 <li>test custom bullet image</li>
    //             <ul>';

    //             // output the HTML content
    //             $pdf->writeHTML($content['data_content'], true, false, true, false, '');

    //             // - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    //             // reset pointer to the last page
    //             $pdf->lastPage();

    //             // ---------------------------------------------------------

    //             //Close and output PDF document
    //             $pdf->Output($content['data_file'], 'F');

    //     }
            
    // }

    

/* End of file Pdf.php */
/* Location: ./application/libraries/Pdf.php */