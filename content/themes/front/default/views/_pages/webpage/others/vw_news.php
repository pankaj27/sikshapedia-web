

<section class="commonSec pt-3 pb-4">
    <div class="wrapper">

        <div class="row">

            <div class="col-lg-9">

                <?php $this->widget->run('front_news_carousel',TRUE);?>
                <div class="row"><br></div>

                <!--ads block-->
                
                <div class="row">

                    <?php
                    if(!empty($exam_news)){
                        ?>
                        <div class="col-lg-6">
                            
                            <div class="section-title text-left mt-4 mb-0">
                                <h5> Exams News</h5>
                            </div>
                            <div id="" class="owl-carousel news-slider">
                            
                                <?php
                                foreach ($exam_news as $key => $value) {
                                    ?>
                                    <div class="post-slide">
                                        <div class="post-img">
                                            <img src="<?php echo $value['exam_news_image'];?>" alt="<?php echo $value['exam_news_short_title'];?>">
                                            <div class="over-layer">
                                                <ul class="post-link">
                                                    <li><a href="#" class="fa fa-search"></a></li>
                                                    <li><a href="#" class="fa fa-link"></a></li>
                                                </ul>
                                            </div>
                                            <div class="post-date">
                                                <span class="date"><?php echo $value['exam_news_published_day'];?></span>
                                                <span class="month"><?php echo $value['exam_news_published_month'];?></span>
                                            </div>
                                        </div>
                                        <div class="post-content">
                                            <h3 class="post-title">
                                                <a href="<?php echo $value['exam_news_link'];?>"><?php echo $value['exam_news_short_title'];?></a>
                                            </h3>
                                            <p class="post-description">
                                                <?php echo $value['exam_news_desc'];?>
                                            </p>
                                            <a href="<?php echo $value['exam_news_link'];?>" class="read-more">read more</a>
                                        </div>
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
                    if(!empty($college_news)){
                        ?>
                        <div class="col-lg-6">
                            
                            <div class="section-title text-left mt-4 mb-0">
                                <h5> College News</h5>
                            </div>
                            <div id="" class="owl-carousel news-slider">
                            
                                <?php
                                foreach ($college_news as $key => $value) {
                                    ?>
                                    <div class="post-slide">
                                        <div class="post-img">
                                            <img src="<?php echo $value['college_news_image'];?>" alt="<?php echo $value['college_news_short_title'];?>">
                                            <div class="over-layer">
                                                <ul class="post-link">
                                                    <li><a href="#" class="fa fa-search"></a></li>
                                                    <li><a href="#" class="fa fa-link"></a></li>
                                                </ul>
                                            </div>
                                            <div class="post-date">
                                                <span class="date"><?php echo $value['college_news_published_day'];?></span>
                                                <span class="month"><?php echo $value['college_news_published_month'];?></span>
                                            </div>
                                        </div>
                                        <div class="post-content">
                                            <h3 class="post-title">
                                                <a href="<?php echo $value['college_news_link'];?>"><?php echo $value['college_news_short_title'];?></a>
                                            </h3>
                                            <p class="post-description">
                                                <?php echo $value['college_news_desc'];?>
                                            </p>
                                            <a href="<?php echo $value['college_news_link'];?>" class="read-more">read more</a>
                                        </div>
                                    </div>
                                    <?php
                                }
                                ?>
                            </div>
                        </div>
                        <?php
                    }
                    ?>


                   
                    <!-- <div class="col-lg-4">
                            <div class="section-title text-left mt-4 mb-0">
                                <h5> Admission News</h5>
                            </div>
                            <div id="" class="owl-carousel news-slider">
                            <div class="post-slide">
                                <div class="post-img">
                                    <img src="<?php echo base_url();?>uploads/sample/img-1.jpg" alt="">
                                    <div class="over-layer">
                                        <ul class="post-link">
                                            <li><a href="#" class="fa fa-search"></a></li>
                                            <li><a href="#" class="fa fa-link"></a></li>
                                        </ul>
                                    </div>
                                    <div class="post-date">
                                        <span class="date">3</span>
                                        <span class="month">Mar</span>
                                    </div>
                                </div>
                                <div class="post-content">
                                    <h3 class="post-title">
                                        <a href="#">Latest News Post</a>
                                    </h3>
                                    <p class="post-description">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                                    </p>
                                    <a href="#" class="read-more">read more</a>
                                </div>
                            </div>
             
                            <div class="post-slide">
                                <div class="post-img">
                                    <img src="<?php echo base_url();?>uploads/sample/img-2.jpg" alt="">
                                    <div class="over-layer">
                                        <ul class="post-link">
                                            <li><a href="#" class="fa fa-search"></a></li>
                                            <li><a href="#" class="fa fa-link"></a></li>
                                        </ul>
                                    </div>
                                    <div class="post-date">
                                        <span class="date">5</span>
                                        <span class="month">Mar</span>
                                    </div>
                                </div>
                                <div class="post-content">
                                    <h3 class="post-title">
                                        <a href="#">Latest News Post</a>
                                    </h3>
                                    <p class="post-description">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                                    </p>
                                    <a href="#" class="read-more">read more</a>
                                </div>
                            </div>
                            <div class="post-slide">
                                <div class="post-img">
                                    <img src="<?php echo base_url();?>uploads/sample/img-3.jpg" alt="">
                                    <div class="over-layer">
                                        <ul class="post-link">
                                            <li><a href="#" class="fa fa-search"></a></li>
                                            <li><a href="#" class="fa fa-link"></a></li>
                                        </ul>
                                    </div>
                                    <div class="post-date">
                                        <span class="date">5</span>
                                        <span class="month">Mar</span>
                                    </div>
                                </div>
                                <div class="post-content">
                                    <h3 class="post-title">
                                        <a href="#">Latest News Post</a>
                                    </h3>
                                    <p class="post-description">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                                    </p>
                                    <a href="#" class="read-more">read more</a>
                                </div>
                            </div>
                            <div class="post-slide">
                                <div class="post-img">
                                    <img src="<?php echo base_url();?>uploads/sample/img-4.jpg" alt="">
                                    <div class="over-layer">
                                        <ul class="post-link">
                                            <li><a href="#" class="fa fa-search"></a></li>
                                            <li><a href="#" class="fa fa-link"></a></li>
                                        </ul>
                                    </div>
                                    <div class="post-date">
                                        <span class="date">5</span>
                                        <span class="month">Mar</span>
                                    </div>
                                </div>
                                <div class="post-content">
                                    <h3 class="post-title">
                                        <a href="#">Latest News Post</a>
                                    </h3>
                                    <p class="post-description">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                                    </p>
                                    <a href="#" class="read-more">read more</a>
                                </div>
                            </div>
                        </div>
                    </div> -->
                </div>
                
                
                <div class="row adBlock" style="margin-top: 10px;">
                    <div style="text-align: center;" id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9545373166119354"
                            crossorigin="anonymous"></script>
                        <!-- wayto_hz_1_ads -->
                        <ins class="adsbygoogle"
                            style="display:inline-block;width:728px;height:90px"
                            data-ad-client="ca-pub-9545373166119354"
                            data-ad-slot="7117741101" style="clear: both; display: flex;justify-content: center;margin-left:50px;margin-right:50px;"></ins>
                        <script>
                            (adsbygoogle = window.adsbygoogle || []).push({});
                        </script>
                    </div>
                </div>
                

            </div>
            <div class="col-lg-3">
               
                    <?php $this->widget->run('front_news_featured',TRUE);?>                    
               
                
                   <?php $this->widget->run('front_subscription2_section',TRUE);?>                    
                
                
                
                   <?php $this->widget->run('front_news_top_trending',TRUE);?>                    
                
            </div>
        </div>


        

        <!--<div class="row">
            <div class="col-lg-9 mb-4 mb-lg-0">

                <div class="section-title text-left mt-4 mb-0">
                    <h5> Exams News</h5>
                </div>
                <div id="" class="owl-carousel news-slider">
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-1.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">3</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
     
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-2.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">5</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-3.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">5</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-4.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">5</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
                </div>

                <div class="section-title text-left mt-4 mb-0">
                    <h5> College News</h5>
                </div>
                <div id="" class="owl-carousel news-slider">
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-1.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">3</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
     
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-2.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">5</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-3.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">5</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-4.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">5</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
                </div>

                <div class="section-title text-left mt-4 mb-0">
                    <h5> Admission News</h5>
                </div>
                <div id="" class="owl-carousel news-slider">
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-1.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">3</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
     
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-2.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">5</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-3.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">5</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
                    <div class="post-slide">
                        <div class="post-img">
                            <img src="<?php echo base_url();?>uploads/sample/img-4.jpg" alt="">
                            <div class="over-layer">
                                <ul class="post-link">
                                    <li><a href="#" class="fa fa-search"></a></li>
                                    <li><a href="#" class="fa fa-link"></a></li>
                                </ul>
                            </div>
                            <div class="post-date">
                                <span class="date">5</span>
                                <span class="month">Mar</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="#">Latest News Post</a>
                            </h3>
                            <p class="post-description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur cumque dolorum, ex incidunt ipsa laudantium necessitatibus neque quae tempora......
                            </p>
                            <a href="#" class="read-more">read more</a>
                        </div>
                    </div>
                </div>

            </div>

            

        </div>-->

        <?php $this->widget->run('front_news_section',TRUE);?>
 
    </div> 
</section>

<?php $this->widget->run('front_subscription_section',TRUE);?>
<script>
    jQuery(document).ready(function($) {
    
   $(".tab-titles li").hover(function() {
       console.log('hello');
       	$(".tab-titles li").removeClass('active');
       	$(this).addClass("active");
       	var selected_tab = $(this).attr("data-slide-to");
       	$(".tab-content").removeClass('active');
       	console.log(selected_tab);
       	$("#c"+selected_tab+"").addClass("active");
	
		
	});
    
});
</script>