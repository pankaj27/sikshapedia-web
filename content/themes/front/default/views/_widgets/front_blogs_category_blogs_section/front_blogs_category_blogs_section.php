<?php
if(!empty($blog_post_data)){
	?>
	<section class="commonSec collegeExmSec bg-white feature-area">
    	<div class="wrapper">
    		<div class="container">
    			<div class="section-title">
			        <h2>Related Posts</h2>
			    </div>
			    <div class="swiper-container itemsSlider" id="collegeExmSlider">
			    	<div class="swiper-wrapper">
			    		<?php
			    		foreach ($blog_post_data as $key => $value) {
			    			?>
			    			<div class="col-lg-3 swiper-slide">
					            <div class="card shadow-sm feature-post">
					              <div class="feature-post-thumb"> <img src="<?php echo $value['blog_cover_image'];?>" style="height:320px !important;width:255px !important;" class="card-img-top" alt="<?php echo $value['blog_title'];?>" draggable="false"></div>
					              <div class="card-body text-center p-2 feature-post-content">
					                <!-- <h6 class="card-title mb-2">Card title</h6>
					                <p class="card-text m-0"><small> quick example text</small></p> -->
					                <div class="post-meta">
					                    <div class="meta-categories">
					                        <a href="#" tabindex="-1">TECHNOLOGY</a>
					                    </div>
					                    <div class="meta-date">
					                        <span>March 26, 2020</span>
					                    </div>
					                </div>
					                <h4 class="title"><a href="<?php echo $value['blog_link'];?>" tabindex="-1"><?php echo $value['blog_title'];?></a></h4>
					              </div>

					            </div>
					          </div>
			    			<?php
			    		}
			    		?>
			    	</div>
			    	<div class="swiper-button-next swiper-button-white"></div>
	        		<div class="swiper-button-prev swiper-button-white"></div>
			    </div>
    		</div>
    	</div>
    </section>
	<?php
}

?>



<section class="feature-area">
	<div class="container">
	    <div class="row">
	        <div class="col-lg-12">
	            <div class="section-title">
	                <h3 class="title">Feature News</h3>
	            </div>
	        </div>
	    </div>
	    <div class="row feature-post-slider slick-initialized slick-slider">
	        
	        
	        
	        
	        
	    <div class="slick-list draggable"><div class="slick-track" style="opacity: 1; width: 3240px; transform: translate3d(-1350px, 0px, 0px);"><div class="col-lg-3 slick-slide slick-cloned" tabindex="-1" style="width: 270px;" data-slick-index="-2" aria-hidden="true">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-4.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="-1">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="-1">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	        <div class="col-lg-3 slick-slide slick-cloned" tabindex="-1" style="width: 270px;" data-slick-index="-1" aria-hidden="true">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-2.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="-1">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="-1">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	        <div class="col-lg-3 slick-slide" tabindex="-1" style="width: 270px;" data-slick-index="0" aria-hidden="true">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-1.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="-1">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="-1">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	        <div class="col-lg-3 slick-slide" tabindex="-1" style="width: 270px;" data-slick-index="1" aria-hidden="true">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-2.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="-1">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="-1">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	        <div class="col-lg-3 slick-slide" tabindex="-1" style="width: 270px;" data-slick-index="2" aria-hidden="true">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-3.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="-1">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="-1">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	        <div class="col-lg-3 slick-slide slick-current slick-active" tabindex="0" style="width: 270px;" data-slick-index="3" aria-hidden="false">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-4.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="0">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="0">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	        <div class="col-lg-3 slick-slide slick-active" tabindex="0" style="width: 270px;" data-slick-index="4" aria-hidden="false">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-2.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="0">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="0">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	        <div class="col-lg-3 slick-slide slick-cloned" tabindex="-1" style="width: 270px;" data-slick-index="5" aria-hidden="true">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-1.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="-1">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="-1">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	        <div class="col-lg-3 slick-slide slick-cloned" tabindex="-1" style="width: 270px;" data-slick-index="6" aria-hidden="true">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-2.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="-1">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="-1">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	        <div class="col-lg-3 slick-slide slick-cloned" tabindex="-1" style="width: 270px;" data-slick-index="7" aria-hidden="true">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-3.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="-1">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="-1">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	        <div class="col-lg-3 slick-slide slick-cloned" tabindex="-1" style="width: 270px;" data-slick-index="8" aria-hidden="true">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-4.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="-1">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="-1">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	        <div class="col-lg-3 slick-slide slick-cloned" tabindex="-1" style="width: 270px;" data-slick-index="9" aria-hidden="true">
	            <div class="feature-post">
	                <div class="feature-post-thumb">
	                    <img src="https://quomodosoft.com/html/newsprk/assets/images/feature-2.jpg" alt="feature">
	                </div>
	                <div class="feature-post-content">
	                    <div class="post-meta">
	                        <div class="meta-categories">
	                            <a href="#" tabindex="-1">TECHNOLOGY</a>
	                        </div>
	                        <div class="meta-date">
	                            <span>March 26, 2020</span>
	                        </div>
	                    </div>
	                    <h4 class="title"><a href="#" tabindex="-1">Best garden wing supplies for the horticu ltural</a></h4>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
</div>
	</div>
</section>