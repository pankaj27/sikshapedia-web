<div class="adBlock ">
   <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;    background: #f5f8f905!important;"><iframe title="3rd party ad content" width="720" height="90" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" src="<?php echo API_URL;?>ads_college_top" style="border: 0px; vertical-align: bottom;"></iframe>
   </div>
</div>
<?php 

if(!empty($widgets)){
	foreach ($widgets as $key => $value) {
		$this->widget->run($value,TRUE,['country_id'=>$country_id,'college_id'=>$college_id]);
	}
}

?>




<!-- <div class="card infoCard mb-4">
	<div class="card-header bg-white">
	  <h5 class="m-0 color2"> LATEST APPLICATION FORMS 2021</h5>
	</div>
	<div class="card-body">
	  <blockquote class="blockquote shadow-sm">
	    <div class="media">
	      <a href="#"> <img src="assets/img/img-1.jpg" width="40" class="mr-2" alt="..."></a> 
	      <div class="media-body">
	        <h6 class="m-0">NIIT University - The University of the Future</h6>
	        <small class="f10">Applications Open for 2020-21</small> 
	        <button type="button" data-toggle="modal" data-target="#reg3ApplyModal" class="btn btn-primary float-right">APPLY NOW</button>
	      </div>
	    </div>
	    <p class="mb-0 f12"><i class="far fa-check-circle color2"></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
	  </blockquote>
	  <blockquote class="blockquote shadow-sm">
	    <div class="media">
	      <a href="#"> <img src="assets/img/img-1.jpg" width="40" class="mr-2" alt="..."></a> 
	      <div class="media-body">
	        <h6 class="m-0">NIIT University - The University of the Future</h6>
	        <small class="f10">Applications Open for 2020-21</small> 
	        <button type="button" data-toggle="modal" data-target="#reg3ApplyModal" class="btn btn-primary float-right">APPLY NOW</button>
	      </div>
	    </div>
	    <p class="mb-0 f12"><i class="far fa-check-circle color2"></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
	  </blockquote>
	</div>
	<div class="card-body border-top">
	  <div class="row">
	    <div class="col-md-9">
	      <h5 class="mb-2"><a href="#" class="text-dark">Post Graduate Programme in Business Analytics</a></h5>
	      <div class="d-flex flex-wrap">
	       <span class="mr-2 badge color-blue"><i class="far fa-bookmark"></i> 2 Years </span>
	       <span class="mr-2 badge color-purple"><i class="far fa-bookmark"></i> Degree </span>
	       <span class="mr-2  badge color-green"><i class="far fa-bookmark"></i> Full Time </span>
	       <span class="mr-2 badge color-indigo"><i class="far fa-bookmark"></i> On Campus </span>
	       <span class="mr-2 badge color-teal"><i class="far fa-bookmark"></i> Post Graduation </span>
	      </div>
	    </div>
	    <div class="col-md-3 d-flex justify-content-end">
	      <div class=" text-md-right">
	        <h4 class="color2 mb-2 "> ₹ 2,115,000 <small class="text-muted">Fees</small> </h4>
	        <a href="#" class="color-indigo">Check details</a>
	      </div>
	    </div>
	  </div>
	  <div class="color2 mb-2">
	    9.4/10 <span class="stars color-orange"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i></span> Based on 11 Reviews 
	  </div>
	  <ul class="pl-3">
	    <li>Dates : Application Starts 05 Aug 2020 | Application Ends 10 Jan 2021 Check All Dates</li>
	      <li>Ranking: #2 Management - NIRF</li>
	      <li>Exams Accepted: <span class="color2"> CAT | GMAT | GRE </span></li>
	  </ul>
	  <p>Admission Guide 2020 <a class="color-teal" href=""><i class="fas fa-download"></i> Download Brochure </a></p>
	</div>
	<div class="card-body border-top">
	  <div class="row">
	    <div class="col-md-9">
	      <h5 class="mb-2"><a href="#" class="text-dark">Post Graduate Programme in Business Analytics</a></h5>
	      <div class="d-flex flex-wrap">
	       <span class="mr-2 badge color-blue"><i class="far fa-bookmark"></i> 2 Years </span>
	       <span class="mr-2 badge color-purple"><i class="far fa-bookmark"></i> Degree </span>
	       <span class="mr-2  badge color-green"><i class="far fa-bookmark"></i> Full Time </span>
	       <span class="mr-2 badge color-indigo"><i class="far fa-bookmark"></i> On Campus </span>
	       <span class="mr-2 badge color-teal"><i class="far fa-bookmark"></i> Post Graduation </span>
	      </div>
	    </div>
	    <div class="col-md-3 d-flex justify-content-end">
	      <div class=" text-md-right">
	        <h4 class="color2 mb-2 "> ₹ 2,115,000 <small class="text-muted">Fees</small> </h4>
	        <a href="#" class="color-indigo">Check details</a>
	      </div>
	    </div>
	  </div>
	  <div class="color2 mb-2">
	    9.4/10 <span class="stars color-orange"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i></span> Based on 11 Reviews 
	  </div>
	  <ul class="pl-3">
	    <li>Dates : Application Starts 05 Aug 2020 | Application Ends 10 Jan 2021 Check All Dates</li>
	      <li>Ranking: #2 Management - NIRF</li>
	      <li>Exams Accepted: <span class="color2"> CAT | GMAT | GRE </span></li>
	  </ul>
	  <p>Admission Guide 2020 <a class="color-teal" href=""><i class="fas fa-download"></i> Download Brochure </a></p>
	</div>
</div> -->

