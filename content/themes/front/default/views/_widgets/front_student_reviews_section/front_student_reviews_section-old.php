
<div class="row">
	<div class="col-lg-12">
		<div class="card userCard" style="border:none !important;">
			<div class="card-header bg-white text-uppercase color-orange font-weight-semi mb-9 mt-3 text-center" style="border:none !important;"><h4 class="m-0 d-inline font-weight-bold">MANAGE YOUR REVIEWS</h4></div>
			<div class="card-body">
				<div class="jsx-2025705379 college-review-list h2">					
					<div class="jsx-2025705379 list-head d-flex justify-content-between">
						<p class="jsx-2025705379 mb-3  title font-weight-semi">Review Of</p>
						<p class="jsx-2025705379 status mb-3  font-weight-semi">Status</p>
					</div>

					<?php
					if(!empty($review_data)){
						$i=1;
						foreach ($review_data as $key => $value) {
							?>
							<hr class="jsx-2025705379 mt-0 mb-3 ml-6">
							<div class="jsx-2025705379 list-title d-flex justify-content-between mb-1">
								<div class="jsx-2025705379 d-flex">
									<p class="jsx-2025705379 font-weight-semi num mr-1"><?php echo $i;?>.</p>
									<p class="jsx-2025705379  mb-3 font-weight-semi"><?php echo $value['college_name'];?> [<?php echo $value['course_name'];?>]</p>
								</div>
								<p class="jsx-2025705379 mb-3  font-weight-semi text-danger">Incomplete and Not Approved</p>
							</div>
							<div class="jsx-2025705379 list-body d-flex justify-content-between">
								<div class="jsx-2025705379 status-detail position-relative text-center">
									<p class="jsx-2025705379 text-top mb-2  font-weight-semi text-nowrap text-base"><?php echo $value['review_at'];?></p>
									<span class="jsx-2025705379 status-cirlce active show-after-line d-inline-block"></span>
									<p class="jsx-2025705379 mb-2 text-md font-weight-semi">Submitted On</p>
								</div>
								<div class="jsx-2025705379 status-detail position-relative text-center">
									<p class="jsx-2025705379 text-top mb-2 font-weight-semi text-base">Done</p>
									<span class="jsx-2025705379 status-cirlce d-inline-block active show-after-line"></span>
									<p class="jsx-2025705379 mb-2 text-md font-weight-semi">Moderation</p>
								</div>
								<div class="jsx-2025705379 status-detail position-relative text-center">
									<p class="jsx-2025705379 text-top mb-2 font-weight-semi text-base"><?php echo $value['review_status'];?></p>
									<span class="jsx-2025705379 status-cirlce active d-inline-block "></span>
									<p class="jsx-2025705379 mb-2 text-md font-weight-semi">Status</p>
								</div>
								<div class="jsx-2025705379 status-detail position-relative text-center">
									<p class="jsx-2025705379 text-top mb-2 font-weight-semi text-base">Pending</p>
									<span class="jsx-2025705379 status-cirlce d-inline-block "></span>
									<p class="jsx-2025705379 mb-2 text-md font-weight-semi">Upload ID card</p>
								</div>
							</div>
							<?php

							$i++;
						}
					}

					?>




					<!-- <hr class="jsx-2025705379 mt-0 mb-3 ml-6">
							<div class="jsx-2025705379 list-title d-flex justify-content-between mb-1">
								<div class="jsx-2025705379 d-flex">
									<p class="jsx-2025705379 font-weight-semi num mr-1">1.</p>
									<p class="jsx-2025705379  mb-3 font-weight-semi">LPU Jalandhar, Bachelor of Technology [B.Tech] (Computer Science and Engineering)</p>
								</div>
								<p class="jsx-2025705379 mb-3  font-weight-semi text-danger">Incomplete and Not Approved</p>
							</div>
							<div class="jsx-2025705379 list-body d-flex justify-content-between">
								<div class="jsx-2025705379 status-detail position-relative text-center">
									<p class="jsx-2025705379 text-top mb-2  font-weight-semi text-nowrap text-base">Apr 24th 08:07 AM</p>
									<span class="jsx-2025705379 status-cirlce active show-after-line d-inline-block"></span>
									<p class="jsx-2025705379 mb-2 text-md font-weight-semi">Submitted On</p>
								</div>
								<div class="jsx-2025705379 status-detail position-relative text-center">
									<p class="jsx-2025705379 text-top mb-2 font-weight-semi text-base">Done</p>
									<span class="jsx-2025705379 status-cirlce d-inline-block active show-after-line"></span>
									<p class="jsx-2025705379 mb-2 text-md font-weight-semi">Moderation</p>
								</div>
								<div class="jsx-2025705379 status-detail position-relative text-center">
									<p class="jsx-2025705379 text-top mb-2 font-weight-semi text-base">Not Approved</p>
									<span class="jsx-2025705379 status-cirlce active d-inline-block "></span>
									<p class="jsx-2025705379 mb-2 text-md font-weight-semi">Status</p>
								</div>
								<div class="jsx-2025705379 status-detail position-relative text-center">
									<p class="jsx-2025705379 text-top mb-2 font-weight-semi text-base">Pending</p>
									<span class="jsx-2025705379 status-cirlce d-inline-block "></span>
									<p class="jsx-2025705379 mb-2 text-md font-weight-semi">Upload ID card</p>
								</div>
							</div> -->			

				</div>


				


			</div>
		</div>
	</div>
</div>


<style type="text/css">
	
</style>

<!-- <div class="row">

	<div class="col-lg-12">
		<div class="card userCard" style="border:none !important;">
			<div class="card-header bg-white text-uppercase color-orange font-weight-semi mb-9 mt-3 text-center" style="border:none !important;"><h4 class="m-0 d-inline font-weight-bold">MANAGE YOUR REVIEWS</h4></div>
			<div class="card-body">
				<div class="user-reviews-section p-6 mb-8">
					<div class="college-review-list h2">
						<div class="nothing-to-show text-center mb-3">
							<div class="">
								<p class="text-muted">Nothing to show yet. You haven't written any review yet.</p>
								<span class="py-6 mt-3 mb-6">
									<img src="https://www.waytoadmissions.com/assets/img/image2.jpg" width="300px" height="250px">
								</span>
								<div class="">
									<a class="btn btn-danger text-white" href="/reviews/write">Write a review now</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>



	
</div>


<div class="row">
	<div class="col-lg-12">
		<div class="card userCard" style="border:none !important;">
			<div class="card-header bg-white text-center" style="border:none !important;"><h4 class="m-0 d-inline font-weight-bold">Rewards &amp; Approval Terms &amp; Conditions:</h4></div>
			<div class="card-body">
				<ol class="mb-0 pl-8 text-lg">
					<li class="review-subtitle mb-1">Don't spam or write duplicate content.</li>
					<li class="review-subtitle mb-1">Your review will be moderated within 15 days.</li>
					<li class="review-subtitle mb-1">Once your review is approved and published, the reward will be released</li>
					<li class="jsx-920989825 review-subtitle mb-1">The review amount range between <strong class="">₹50 - ₹200 (for India)</strong>  <strong class=""></strong>.</li>
					<li class="review-subtitle">MBA Grads will recieve extra <strong class="">₹20</strong> to complete this form.</li>
				</ol>
			</div>
		</div>
	</div>
</div> -->


<style type="text/css">



.college-review-list.jsx-2025705379 .list-body.jsx-2025705379 .status-detail.jsx-2025705379 {
    min-width: 124px;
    width: 20%;
}


.college-review-list.jsx-2025705379 .list-body.jsx-2025705379 .status-cirlce.active.show-after-line.jsx-2025705379::before {
    background: rgb(255, 121, 0) !important;
}

.college-review-list.jsx-2025705379 .list-body.jsx-2025705379 .status-cirlce.jsx-2025705379::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 5px;
    top: 53%;
    left: calc(50% + 10px);
    background: rgb(205, 205, 205);
    transform: translateY(-50%);
}

.college-review-list.jsx-2025705379 .list-body.jsx-2025705379 .status-cirlce.active.show-after-line.jsx-2025705379::after {
    left: -53%;
}

	.user-reviews-section.jsx-920989825 {
	    border-radius: 10px;
	    box-shadow: rgb(232 232 232) 8px 8px 16px, rgb(255 255 255) -8px -8px 16px;
	    background: rgb(247, 247, 247);
	}
	.p-6 {
	    padding: 1.5rem;
	}
	.mb-8, .my-8 {
	    margin-bottom: 2rem;
	}
	.text-primary {
	    color: #ff7900;
	}
	.font-weight-semi {
	    font-weight: 600;
	}
	.text-uppercase {
	    text-transform: uppercase;
	}
	.text-center {
	    text-align: center;
	}
	.mb-9, .my-9 {
	    margin-bottom: 2.25rem;
	}
	.mt-3, .my-3 {
	    margin-top: 0.75rem;
	}
	h2, .h2 {
	    font-size: 1.125rem;
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
	.college-review-list.jsx-2025705379 .list-head.jsx-2025705379 .title.jsx-2025705379, .college-review-list.jsx-2025705379 .list-action.jsx-2025705379 {
	    padding-left: 24px;
	}
	p.mb-3, p.my-3 {
	    margin-bottom: 0.75rem;
	}
	.font-weight-semi {
	    font-weight: 600;
	}
	p.mb-3, p.my-3 {
	    margin-bottom: 0.75rem;
	}
	.font-weight-semi {
	    font-weight: 600;
	}
	.mb-3, .my-3 {
	    margin-bottom: 0.75rem;
	}
	.ml-6, .mx-6 {
	    margin-left: 1.5rem;
	}
	.mb-3, .my-3 {
	    margin-bottom: 0.75rem;
	}
	.mt-0, .my-0 {
	    margin-top: 0;
	}
	hr {
	    margin-top: 1rem;
	    margin-bottom: 1rem;
	    border: 0;
	    border-top: 1px solid rgba(0,0,0,0.1);
	}
	hr {
	    box-sizing: content-box;
	    height: 0;
	    overflow: visible;
	}
	.mb-1, .my-1 {
	    margin-bottom: 0.25rem;
	}
	.justify-content-between {
	    -webkit-box-pack: justify;
	    -webkit-justify-content: space-between;
	    -ms-flex-pack: justify;
	    justify-content: space-between;
	}

	.text-center {
	    text-align: center;
	}
	.position-relative {
	    position: relative;
	}
	.college-review-list.jsx-2025705379 .list-body.jsx-2025705379 .status-detail.jsx-2025705379 .text-top.jsx-2025705379 {
	    height: 20px;
	}
	p.mb-2, p.my-2 {
	    margin-bottom: 0.5rem;
	}
	.font-weight-semi {
	    font-weight: 600;
	}
	.text-nowrap {
	    white-space: nowrap;
	}
	.college-review-list.jsx-2025705379 .list-body.jsx-2025705379 .status-cirlce.active.jsx-2025705379 {
	    background: rgb(255, 121, 0) !important;
	}
	
	.college-review-list.jsx-2025705379 .list-body.jsx-2025705379 .status-cirlce.jsx-2025705379 {
	    height: 20px;
	    width: 20px;
	    background: rgb(205, 205, 205);
	    border-radius: 50%;
	}
	.d-inline-block {
	    display: inline-block;
	}
	p.mb-2, p.my-2 {
	    margin-bottom: 0.5rem;
	}
	.font-weight-semi {
	    font-weight: 600;
	}
	.mb-2, .my-2 {
	    margin-bottom: 0.5rem;
	}

	.text-md {
	    font-size: .75rem;
	}

	.college-review-list.jsx-2025705379 .list-body.jsx-2025705379 .status-cirlce.active.jsx-2025705379 {
	    background: rgb(255, 121, 0) !important;
	}

	.college-review-list.jsx-2025705379 .list-body.jsx-2025705379 .status-cirlce.jsx-2025705379 {
	    height: 20px;
	    width: 20px;
	    background: rgb(205, 205, 205);
	    border-radius: 50%;
	}
	.d-inline-block {
	    display: inline-block;
	}
</style>