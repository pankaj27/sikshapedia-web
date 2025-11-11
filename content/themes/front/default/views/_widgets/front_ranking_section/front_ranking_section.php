<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($college_ranking_data)){
	?>
	<div class="card infoCard mb-4">
	  <!-- <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
	    <div class="media">
	      <a href="#" class="mr-3 "><img class="img-circle" src="<?php echo $college_curator_image;?>" width="60" alt="<?php echo $college_info_curator;?>"></a>
	      <div class="media-body">
	        <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> By <?php echo $college_info_curator;?>  </a> </h5>
	        <p class="m-0">Content Curator 
	          <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
	          <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
	          <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>
	        </p>
	      </div>
	    </div>
	    <div class="updateDate color2"><?php echo $college_info_updated;?></div>
	  </div> -->
	  <div class="card-body">
	  	<?php
	  	echo $college_ranking_info;
	  	?>

	  	<?php
		  if(!empty($college_ranking_faqs)){
		    ?>
		    <div id="accordionExample1" class="accordion">
		      <?php
		      $i=0;
		      foreach ($college_ranking_faqs as $key => $value) {
		        ?>
		        <div class="card br-0">
		          <a href="#" data-toggle="collapse" data-target="#collapse<?php echo $i;?>" aria-expanded="true" aria-controls="collapse<?php echo $i;?>" class="card-header d-block position-relative text-dark text-uppercase collapsible-link "><strong>Ques. </strong><?php echo $value->faq_question;?></a>
		          <div id="collapse<?php echo $i;?>" data-parent="#accordionExample1" class="collapse <?php echo ($i==0)?'show':'';?>">
		            <div class="card-body">
		              <p class="font-weight-light m-0"><strong>Ans. </strong><?php echo $value->faq_ans;?></p>
		            </div>
		          </div>
		        </div>
		        <?php
		        $i++;
		      }

		      ?>
		    </div>
		    <?php
		  }

		  ?>
	  </div>

	</div>
	<?php
}
?>

<?php

if(!empty($college_ranking_data)){

	foreach ($college_ranking_data as $key => $value){

		if(!empty($value['ranking'])){
			
			?>
			<div class="ranking-container">
			    <h2>
			        <?php echo $value['ranking_body'];?> Ranking
			        <img src="<?php echo $value['ranking_body_logo'];?>" alt="<?php echo $value['ranking_body'];?> Logo">
			    </h2>
			    <p><?php echo $value['ranking_text'];?></p>

			    <table>
			        <thead>
			            <tr>
			                <th>Stream / Category</th>
			                <?php
			                foreach ($value['ranking'] as $k => $v) {
			                	?>
			                	<th><?php echo $v->ranking_year;?></th>
			                	<?php
			                }
			                ?>
			            </tr>
			        </thead>
			        <tbody>
			            <tr>
			                <td><?php echo $value['ranking_category'];?></td>
			                <?php
			                foreach ($value['ranking'] as $k => $v) {
			                	?>
			                	<td>
				                    <span class="gold-medal">🥉</span> <?php echo $v->ranking_value;?> out of <?php echo $v->ranking_value_outof;?> in India <?php echo $v->ranking_year;?><br>
				                    <?php
				                    if(!empty($v->state_name)){
				                    	?>
				                    	<span>#<?php echo ordinal($v->ranking_state_value);?> in <?php echo $v->state_name;?></span>
				                    	<?php
				                    }
				                    ?>
				                    
				                </td>
			                	<?php
			                }
			                ?>
			            </tr>
			        </tbody>
			    </table>
			   
			</div>
			<?php
			
		}
	}
	?>
	<style>
	    .ranking-container {
	        border: 1px solid #ddd;
			background-color: #ffffff;
	        padding: 20px;
	        width: 100%;
			margin-bottom: 20px !important;
	        margin: 0 auto;
	        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
	    }
	    .ranking-container h2 {
	        display: flex;
	        justify-content: space-between;
	        align-items: center;
	    }
	    .ranking-container img {
	        height: 50px;
	    }
	    .ranking-container table {
	        width: 100%;
	        border-collapse: collapse;
	        margin-top: 20px;
	    }
	    .ranking-container table, th, td {
	        border: 1px solid #ddd;
	    }
	    .ranking-container th, td {
	        padding: 10px;
	        text-align: center;
	    }
	    .ranking-container th {
	        background-color: #f8f8f8;
	    }
	    .gold-medal {
	        color: gold;
	        font-weight: bold;
	    }
	    .footnote {
	        margin-top: 10px;
	        font-size: 12px;
	        color: #555;
	    }
	    .compare {
	        display: flex;
	        align-items: center;
	        justify-content: center;
	        font-size: 14px;
	        color: #007bff;
	    }
	    .compare img {
	        height: 16px;
	        margin-left: 5px;
	    }
	</style>
	<?php
}
?>

