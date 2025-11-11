
<?php

if(!empty($college_ranking_data)){
	?>

	<div style="display:contents">
	   <div class="jsx-779922922 ranking bg-white mt-4">
	      <h2 class="jsx-779922922 card-heading text-title font-weight-bold p-4 text-capitalize mb-0"><?php echo $college_data->college_short_name;?> Ranking</h2>
	      <div class="jsx-779922922 card-body px-4 py-3 show-min">

	      	<?php

	      	foreach ($college_ranking_data as $key => $value) {
	      		?>
	      		<div class="jsx-779922922 info-body d-flex align-items-start justify-content-between">
		            <img data-src="<?php echo $value['agency_logo'];?>?mode=stretch" src="<?php echo $value['agency_logo'];?>?mode=stretch" alt="<?php echo $value['agency_name'];?>" height="auto" class="jsx-1334679407 agency-logo lazyloaded">
		            <div class="jsx-779922922 col-10 p-0">
		               <div class="jsx-779922922 info mb-4">
		               		<?php

		               		foreach ($value['ranking_data'] as $k => $v) {
		               			?>
		               			<h4 class="jsx-779922922 mb-0"><?php echo $v['ranking_category'];?><span class="jsx-779922922 text-lg"> <span class="jsx-779922922 text-primary ml-2 mr-2">#<?php echo $v['rank_value'];?></span> out of <?php echo $v['rank_out_of_value'];?> in<a href="<?php echo $v['rank_search_page'];?>" target="_blank" class="jsx-779922922 ml-2 mr-2">India <?php echo $v['rank_year'];?></a></span></h4>
		               			<br>
		               			<?php
		               		}

		               		?>
		                  
		                  <!-- <div class="jsx-779922922 d-flex">
		                     <p class="jsx-779922922 font-weight-semi col-6 p-0 text-secondary text-lg mb-0"><span class="jsx-779922922 d-block mt-2">#18th in Hyderabad</span></p>
		                  </div> -->
		               </div>
		            </div>
		         </div>
		         <hr class="jsx-779922922 mt-3 mb-3">
	      		<?php
	      	}

	      	?>


	         <!-- <div class="jsx-779922922 info-body d-flex align-items-start justify-content-between">
	            <img data-src="https://images.collegedunia.com/public/college_data/images/agencyLogo/india_today_1569843914.png?mode=stretch" src="https://images.collegedunia.com/public/college_data/images/agencyLogo/india_today_1569843914.png?mode=stretch" alt="India Today" height="auto" class="jsx-1334679407 agency-logo lazyloaded">
	            <div class="jsx-779922922 col-10 p-0">
	               <div class="jsx-779922922 info mb-4">
	                  <h4 class="jsx-779922922 mb-0">B.Tech<span class="jsx-779922922 text-lg"> <span class="jsx-779922922 text-primary ml-2 mr-2">#237</span> out of 254 in<a href="https://collegedunia.com/engineering-colleges?ranking_agency=17" target="_blank" class="jsx-779922922 ml-2 mr-2">India 2020</a></span></h4>
	                  <div class="jsx-779922922 d-flex">
	                     <p class="jsx-779922922 font-weight-semi col-6 p-0 text-secondary text-lg mb-0"><span class="jsx-779922922 d-block mt-2">#18th in Hyderabad</span></p>
	                  </div>
	               </div>
	            </div>
	         </div>
	         <hr class="jsx-779922922 mt-3 mb-3">
	         <div class="jsx-779922922 info-body d-flex align-items-start justify-content-between">
	            <img data-src="https://images.collegedunia.com/public/college_data/images/agencyLogo/what_does_the_times_of_india_logo_stand_for_quora_india_emblam_602_2471600316640.jpg?mode=stretch" src="https://images.collegedunia.com/public/college_data/images/agencyLogo/what_does_the_times_of_india_logo_stand_for_quora_india_emblam_602_2471600316640.jpg?mode=stretch" alt="The Times Of India" height="auto" class="jsx-1334679407 agency-logo lazyloaded">
	            <div class="jsx-779922922 col-10 p-0">
	               <div class="jsx-779922922 info mb-4">
	                  <h4 class="jsx-779922922 mb-0">B.Tech<span class="jsx-779922922 text-lg"> <span class="jsx-779922922 text-primary ml-2 mr-2">#137</span> out of 196 in<a href="https://collegedunia.com/engineering-colleges?ranking_agency=14" target="_blank" class="jsx-779922922 ml-2 mr-2">India 2021</a></span><span class="jsx-779922922 text-lg"> ( <span class="jsx-779922922 text-primary"> #122 </span>out of 162 in India 2020 ) </span></h4>
	                  <div class="jsx-779922922 d-flex">
	                     <p class="jsx-779922922 font-weight-semi col-6 p-0 text-secondary text-lg mb-0"><span class="jsx-779922922 d-block mt-2">#14th in Hyderabad</span></p>
	                  </div>
	               </div>
	            </div>
	         </div>
	         <hr class="jsx-779922922 mt-3 mb-3"> -->
	      </div>
	      <hr class="jsx-779922922 mt-3 mb-0">
	   </div>
	</div>



<style type="text/css">
	.ranking.jsx-779922922 {
	    border-radius: 4px;
	    box-shadow: 0 0 4px 0 rgb(207 207 207 / 50%);
	}
	.mt-4, .my-4 {
	    margin-top: 1rem;
	}
	.bg-white {
	    background-color: #fff;
	}
	.card-heading.jsx-779922922 {
	    font-size: 18px;
	    -webkit-letter-spacing: .7px;
	    -moz-letter-spacing: .7px;
	    -ms-letter-spacing: .7px;
	    letter-spacing: .7px;
	    border-bottom: solid 1px rgba(164,164,164,0.2);
	}
	.font-weight-bold, h1.font-weight-bold, h2.font-weight-bold, h3.font-weight-bold, h4.font-weight-bold, h5.font-weight-bold, h6.font-weight-bold, .h1.font-weight-bold, .h2.font-weight-bold, .h3.font-weight-bold, .h4.font-weight-bold, .h5.font-weight-bold, .h6.font-weight-bold {
	    font-weight: 700;
	}
	.mb-0 {
	    margin-bottom: 0 !important;
	}
	.text-title {
	    color: #1c1c1c;
	}
	.text-capitalize {
	    text-transform: capitalize;
	}
	.p-4 {
	    padding: 1rem;
	}
	.mb-0, .my-0 {
	    margin-bottom: 0;
	}

	.ranking.jsx-779922922 .show-min.jsx-779922922 {
	    overflow: hidden;
	}
	.pl-4, .px-4 {
	    padding-left: 1rem;
	}
	.pr-4, .px-4 {
	    padding-right: 1rem;
	}
	.pb-3, .py-3 {
	    padding-bottom: 0.75rem;
	}
	.pt-3, .py-3 {
	    padding-top: 0.75rem;
	}
	@media (min-width: 1200px)
	.card-body {
	    padding: 1.25rem;
	}
	.card-body {
	    -webkit-flex: 1 1 auto;
	    -ms-flex: 1 1 auto;
	    flex: 1 1 auto;
	    min-height: 1px;
	    padding: 0.5rem;
	}
	*, *::before, *::after {
	    box-sizing: border-box;
	}
	user agent stylesheet
	div {
	    display: block;
	}
	.mb-0 {
	    margin-bottom: 0 !important;
	}
	.mt-3, .my-3 {
	    margin-top: 0.75rem;
	}
	.mb-0, .my-0 {
	    margin-bottom: 0;
	}
	hr {
	    margin-top: 1rem;
	    margin-bottom: 1rem;
	    border: 0;
	    border-top: 1px solid rgba(0,0,0,0.1);
	}
	.align-items-start {
	    -webkit-align-items: flex-start;
	    -webkit-box-align: flex-start;
	    -ms-flex-align: flex-start;
	    align-items: flex-start;
	}
	.justify-content-between {
	    -webkit-box-pack: justify;
	    -webkit-justify-content: space-between;
	    -ms-flex-pack: justify;
	    justify-content: space-between;
	}
	.d-flex {
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: -ms-flexbox;
	    display: flex;
	}
	.ranking.jsx-779922922 .info-body.jsx-779922922 .agency-logo {
	    object-fit: contain;
	    max-height: 65px;
	    min-width: 120px;
	    max-width: 120px;
	}
	img.jsx-1334679407 {
	    height: auto;
	    width: auto;
	    max-height: auto;
	    max-width: auto;
	    overflow: hidden;
	}
	.text-lg {
	    font-size: 1rem;
	}
	.text-primary {
	    color: #ff7900;
	}
	.ml-2, .mx-2 {
	    margin-left: 0.5rem;
	}
	.mr-2, .mx-2 {
	    margin-right: 0.5rem;
	}
</style>

	<?php
}


?>

