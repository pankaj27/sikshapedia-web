<?php

if(isset($practice_papers) && !empty($practice_papers)){
	?>
	<div class="card infoCard mb-4">
	  	<div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
		    <div class="media">
		      <!-- <a href="#" class="mr-3 "><img class="img-circle" src="assets/img/avatar.jpg" width="60" alt=""></a> -->
		      <div class="media-body"><h5>Practice Papers </h5>
		      </div>
		    </div>
		    <!-- <div class="updateDate">Updated On - December 7th, 2020</div> -->
	  	</div>
	  	<div class="card-body">
	    	<div class="row">
	    		<?php
	    		foreach ($practice_papers as $key => $value) {
	    			?>
	    			<div class="col-md-6 col-lg-3">
			            <div class="pricing pricing-warning file-man-o-box">
			                <div class="title"><a href=""><?php echo $value['practice_paper_exam'];?></a></div>
			                <div class="price-box">
			                    <div class="icon pull-right border circle">
			                        <span class="livicon livicon-processed" data-n="shopping-cart" data-s="32" data-c="#1e1e1e" data-hc="0" id="livicon-1" style="width: 32px; height: 32px;">
			                        	<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
												 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
											<path style="fill:#C30B15;" d="M511.344,274.266C511.77,268.231,512,262.143,512,256C512,114.615,397.385,0,256,0S0,114.615,0,256
												c0,117.769,79.53,216.949,187.809,246.801L511.344,274.266z"/>
											<path style="fill:#85080E;" d="M511.344,274.266L314.991,77.913L119.096,434.087l68.714,68.714C209.522,508.787,232.385,512,256,512
												C391.243,512,501.976,407.125,511.344,274.266z"/>
											<polygon style="fill:#FFFFFF;" points="278.328,333.913 255.711,77.913 119.096,77.913 119.096,311.652 "/>
											<polygon style="fill:#E8E6E6;" points="392.904,311.652 392.904,155.826 337.252,133.565 314.991,77.913 255.711,77.913 
												256.067,333.913 "/>
											<polygon style="fill:#FFFFFF;" points="314.991,155.826 314.991,77.913 392.904,155.826 "/>
											<rect x="119.096" y="311.652" style="fill:#FC0F1A;" width="273.809" height="122.435"/>
											<g>
												<path style="fill:#FFFFFF;" d="M204.871,346.387c13.547,0,21.341,6.659,21.341,18.465c0,12.412-7.795,19.601-21.341,19.601h-9.611
													v14.909h-13.471v-52.975L204.871,346.387L204.871,346.387z M195.26,373.858h8.93c5.904,0,9.308-2.952,9.308-8.552
													c0-5.525-3.406-8.324-9.308-8.324h-8.93V373.858z"/>
												<path style="fill:#FFFFFF;" d="M257.928,346.387c16.649,0,28.152,10.746,28.152,26.487c0,15.666-11.655,26.488-28.683,26.488
													h-22.25v-52.975H257.928z M248.619,388.615h9.611c8.249,0,14.151-6.357,14.151-15.665c0-9.384-6.205-15.817-14.757-15.817h-9.006
													V388.615z"/>
												<path style="fill:#FFFFFF;" d="M308.563,356.982v12.26h23.763v10.596h-23.763v19.525h-13.471v-52.975h39.277v10.595h-25.806
													V356.982z"/>
											</g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
											<g></g>
										</svg>
			                        </span>
			                    </div>
			                    <div class="starting"><?php echo $value['practice_paper_name'];?></div>
			                    <div class="price"><?php echo $value['practice_paper_year'];?><span></span></div>
			                </div>
			                <ul class="options">
			                    <li class="active">
			                    	<span><a href="<?php echo $value['practice_paper'];?>" class="file-download" download><i class="fa fa-download"></i></a></span>Question Paper
			                    </li>
			                    <li class="active">
			                    	<?php
			                    	if(!empty($value['paper_answer_paper'])){
			                    		?>
			                    		<span><a href="<?php echo $value['paper_answer_paper']['answer_paper'];?>" class="file-download" download><i class="fa fa-download"></i></a></span>Answer Paper
			                    		<?php
			                    	}else{
			                    		?>
			                    		---
			                    		<?php
			                    	}
			                    	?>
			                    	
			                    </li>
			                </ul>
			            </div>
			        </div>
	    			<?php
	    		}
	    		?>
		    </div>         
	  	</div>
	</div>
	<?php
}
?>


	

<style type="text/css">
	.file-man-o-box {
	    border: 1px solid #e3eaef;
	    border-radius: 5px;
	    position: relative;
	    margin-bottom: 20px
	}
	.file-man-box {
	    padding: 20px;
	    border: 1px solid #e3eaef;
	    border-radius: 5px;
	    position: relative;
	    margin-bottom: 20px
	}

	.file-man-box .file-close {
	    color: #f1556c;
	    position: absolute;
	    line-height: 24px;
	    font-size: 24px;
	    right: 10px;
	    top: 10px;
	    visibility: hidden
	}

	.file-man-box .file-img-box {
	    line-height: 120px;
	    text-align: center
	}

	.file-man-box .file-img-box img {
	    height: 64px
	}

	.file-man-box .file-download {
	    font-size: 32px;
	    color: #98a6ad;
	    position: absolute;
	    right: 10px
	}

	.file-man-box .file-download:hover {
	    color: #313a46
	}

	.file-man-box .file-man-title {
	    padding-right: 25px
	}

	.file-man-box:hover {
	    -webkit-box-shadow: 0 0 24px 0 rgba(0, 0, 0, .06), 0 1px 0 0 rgba(0, 0, 0, .02);
	    box-shadow: 0 0 24px 0 rgba(0, 0, 0, .06), 0 1px 0 0 rgba(0, 0, 0, .02)
	}

	.file-man-box:hover .file-close {
	    visibility: visible
	}
	.text-overflow {
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    display: block;
	    width: 100%;
	    overflow: hidden;
	}

	.hide {
	  display: none;
	}


	/***Practice Paper List***/
	body{margin-top:20px;}
/******************************************************************************
  Pricing
*******************************************************************************/
.pricing {
  background-color: #fff;
  margin: 0 auto 40px;
  max-width: 270px;
  position: relative;
  text-align: left;
}
.pricing * {
  position: relative;
}
.pricing:before {
  background: #f7f7f7;
  background: rgba(30,30,30,.06);
  bottom: 0;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.pricing .title {
  line-height: 32px;
  padding: 17px 20px 21px;
}
.pricing .title a {
  color: #1e1e1e;
  font-size: 24px;
  font-weight: bold;
  line-height: 32px;
  text-decoration: none;
}
.pricing .price-box {
  font-size: 12px;
  line-height: 1;
  overflow: hidden;
  padding: 0 20px 20px;
}
.pricing .price-box .icon {
  background: #fff;
  color: #505050;
  height: 60px;
  text-align: center;
  width: 60px;
  z-index: 1;
}
.pricing .price-box .icon i,
.pricing .price-box .icon .livicon {
  background: none;
  font-size: 30px;
  height: auto;
  line-height: 52px;
  margin: 0;
  width: auto;
}
.pricing .price-box .icon .livicon {
  height: 60px !important;
}
.pricing .price-box .icon .livicon svg {
  top: 0 !important;
  vertical-align: middle;
}
.pricing .price-box .price {
  font-size: 36px;
  font-weight: bold;
  margin: 13px 0 0;
}
.pricing .price-box .price span {
  font-size: 12px;
}
.pricing .options {
  list-style: none;
  margin: 0;
  padding: 0;
}
.pricing .options li {
  border-top: 1px solid rgba(30,30,30,.1);
  color: #999;
  color: rgba(30,30,30,.4);
  line-height: 22px;
  padding: 13px 10px 13px 45px;
  position: relative;
}
.pricing .options li span {
  color: #1e1e1e;
  display: none;
  left: 25px;
  line-height: 1;
  position: absolute;
  top: 16px;
}
.pricing .options li.active {
  color: #1e1e1e;
}
.pricing .options li.active span {
  display: block;
}
.pricing .bottom-box {
  border-top: 1px solid rgba(30,30,30,.1);
  background: rgba(30,30,30,.05);
  overflow: hidden;
  padding: 19px 19px 20px;
}
.pricing .bottom-box .more {
  color: #7f7f7f;
  color: rgba(30,30,30,.7);
  display: block;
  float: left;
  font-size: 12px;
  line-height: 1;
  text-decoration: none;
  -webkit-transition: opacity .2s linear;
  transition: opacity .2s linear;
}
.pricing .bottom-box .more:hover {
  opacity: .65;
  filter: alpha(opacity=65);
  -webkit-transition: opacity .2s linear;
  transition: opacity .2s linear;
}
.pricing .bottom-box .more span {
  font-size: 17px;
  line-height: 12px;
  margin: 0 0 0 3px;
  vertical-align: top;
}
.pricing .bottom-box .rating-box {
  float: right;
}
.pricing .bottom-box .btn {
  font-weight: bold;
  margin: 19px 0 0;
  width: 100%;
}
.pricing.prising-info:before {
  background: rgba(1,165,219,.06);
}
.pricing.prising-info .title a {
  color: #01a5db;
}
.pricing.prising-info .price-box .icon {
  color: #35beeb;
  border-color: #35beeb;
}
.pricing.prising-info .options li,
.pricing.prising-info .bottom-box {
  border-color: rgba(1,165,219,.1);
  color: rgba(1,165,219,.4);
}
.pricing.prising-info .bottom-box {
  border-top: 1px solid rgba(1,165,219,.1);
  background: rgba(1,165,219,.05);
} 
.pricing.prising-info .options li span,
.pricing.prising-info .bottom-box .more,
.pricing.prising-info .options li.active {
  color: #01a5db;
}
.pricing.pricing-success:before {
  background: rgba(132,162,0,.06);
}
.pricing.pricing-success .title a {
  color: #84a200;
}
.pricing.pricing-success .price-box .icon {
  border-color: #9ab71a;
  color: #9ab71a;
}
.pricing.pricing-success .options li,
.pricing.pricing-success .bottom-box {
  border-color: rgba(132,162,0,.1);
  color: rgba(132,162,0,.4);
}
.pricing.pricing-success .bottom-box {
  border-top: 1px solid rgba(132,162,0,.1);
  background: rgba(132,162,0,.05);
}
.pricing.pricing-success .bottom-box .more,
.pricing.pricing-success .options li span,
.pricing.pricing-success .options li.active {
  color: #84a200;
}
.pricing.pricing-error:before {
  background: rgba(212,7,70,.06);
}
.pricing.pricing-error .title a {
  color: #d40746;
}
.pricing.pricing-error .price-box .icon {
  border-color: #de2a61;
  color: #de2a61;
}
.pricing.pricing-error .options li,
.pricing.pricing-error .bottom-box {
  border-color: rgba(212,7,70,.1);
  color: rgba(212,7,70,.4);
}
.pricing.pricing-error .bottom-box {
  border-top: 1px solid rgba(212,7,70,.1);
  background: rgba(212,7,70,.05);
}
.pricing.pricing-error .options li span,
.pricing.pricing-error .bottom-box .more,
.pricing.pricing-error .options li.active {
  color: #d40746;
}

.icon.border {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-width: 1px;
}

.icon.circle {
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
}
.icon.pull-right {
    float: right;
    margin-left: 10px;
}

.pricing-warning:before {
    background-color: rgba(248,148,6,.06) !important;
}

.pricing.pricing-info:before {
    background: rgba(1,165,219,.06);
}

.pricing-warning .title a, .pricing-warning .options li.active, .pricing-warning .options li span, .package .title a, .package .price-box .price {
    color: #f89406 !important;
}

.pricing.pricing-info .options li span, .pricing.pricing-info .bottom-box .more, .pricing.pricing-info .options li.active {
    color: #01a5db;
}

.pricing.pricing-info .options li, .pricing.pricing-info .bottom-box {
    border-color: rgba(1,165,219,.1);
    color: rgba(1,165,219,.4);
}

.pricing.pricing-warning .options li {
    color: rgba(248,148,6,.4);
}

.pricing.pricing-info .title a {
    color: #01a5db;
}
</style>