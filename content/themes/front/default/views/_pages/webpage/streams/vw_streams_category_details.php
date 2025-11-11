<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<section class="bradcumSec bg-white py-2">
    <div class="wrapper">
        <div class="row">
             <div class="col-md-8 mb-2 mb-md-0 d-flex align-items-center justify-content-center justify-content-md-start">
                 <h4 class="m-0 text-center text-md-left text-uppercase"><?php echo $page_heading;?></h4>
             </div>
             <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-end">
                 <nav aria-label="breadcrumb">
                     <ol class="breadcrumb bg-white m-0">
                     	<?php
                     	if(!empty($bread_crumb)){
                     		foreach ($bread_crumb as $key => $value) {
                     			?>
                     			<li class="breadcrumb-item <?php echo ($value!='')?$value:'';?>" <?php echo ($value!='')?'aria-current="page"':'';?>>
                     				<?php
                     				if($value!=''){
                     					?>
                     					<a href="<?php echo $value;?>"><?php echo $key;?></a>
                     					<?php
                     				}else{
                     					echo $key;
                     				}

                     				?>

                     				</li>
                     			<?php
                     		}
                     	}
                     	?>
                     </ol>
                 </nav>
             </div>
        </div>
        <?php
         if(!empty($page_sub_heading)){
          ?>
          <p><?php echo $page_sub_heading;?></p>
          <?php
         }
         ?>
    </div>
</section>

<?php $this->widget->run('front_stream_category_section',$show_stream_category_widget);?>




<?php $this->widget->run('front_subscription_section',TRUE);?>


<style type="text/css">
    .course-level-section.jsx-1737880607 {
        background-color: rgb(245, 248, 249);
        padding: 20px 0px;
    }
    .course-level-section.jsx-1737880607 .streams-wrapper.jsx-1737880607 {
        margin: 0px auto;
        width: 83.33%;
    }
    .levelCard.jsx-1321156703 {
        border: 1px solid rgb(204, 204, 204);
        background-color: rgb(255, 255, 255);
        margin-bottom: 20px;
    }
    .d-flex {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
    }
    .iconWrapper.jsx-1321156703 {
        width: 30%;
        flex-direction: column;
        text-align: center;
        -webkit-box-align: center;
        align-items: center;
        position: relative;
        border-right: 1px solid rgb(204, 204, 204);
        background: url(https://images.collegedunia.com/public/college_data/images/resources/course_icon_bg.jpeg) 0% 0% / cover;
    }
    .justify-content-center {
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
    }
    a {
        color: #ff7900;
        -webkit-text-decoration: none;
        text-decoration: none;
        background-color: transparent;
    }
    .iconWrapper.jsx-1321156703 .streamIcon.jsx-1321156703 {
        display: inline-block;
        height: 90px;
        width: 90px;
        transition: all 0.5s ease 0s;
        z-index: 2;
    }
    .iconWrapper.jsx-1321156703 .streamHeading.jsx-1321156703 {
        color: rgb(51, 51, 51);
        margin-top: 22px;
        font-size: 20px;
        font-weight: bold;
        z-index: 2;
    }
    .listWrapper.jsx-1321156703 {
        width: 70%;
        padding: 18px 25px 70px;
        min-height: 325px;
    }
    .position-relative {
        position: relative;
    }
    .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703:first-child {
        border-top: none;
    }
    
    .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703 {
        padding: 10px 0px;
        border-top: 1px dotted rgb(204, 204, 204);
        list-style: none;
    }

    .justify-content-between {
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }

    .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703 .courseName.jsx-1321156703 {
        color: rgb(255, 121, 0);
        text-transform: uppercase;
        font-size: 15px;
        display: inline-block;
    }
    .font-weight-bold, h1.font-weight-bold, h2.font-weight-bold, h3.font-weight-bold, h4.font-weight-bold, h5.font-weight-bold, h6.font-weight-bold, .h1.font-weight-bold, .h2.font-weight-bold, .h3.font-weight-bold, .h4.font-weight-bold, .h5.font-weight-bold, .h6.font-weight-bold {
        font-weight: 700;
    }
    .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703 .courseDuration.jsx-1321156703 .year.jsx-1321156703 {
        margin-right: 20px;
        color: rgb(255, 121, 0);
    }
   
    .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703 .courseDuration.jsx-1321156703 .year.jsx-1321156703, .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703 .courseDuration.jsx-1321156703 .shift.jsx-1321156703 {
        font-size: 10px;
        font-weight: 600;
        position: relative;
        text-transform: uppercase;
    }

    .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703 .courseDuration.jsx-1321156703 .shift.jsx-1321156703 {
        color: rgb(62, 174, 141);
    }
    
    .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703 .courseDuration.jsx-1321156703 .year.jsx-1321156703, .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703 .courseDuration.jsx-1321156703 .shift.jsx-1321156703 {
        font-size: 10px;
        font-weight: 600;
        position: relative;
        text-transform: uppercase;
    }

    .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703 .link-block.jsx-1321156703 {
        font-size: 10px;
        padding-top: 5px;
        text-transform: uppercase;
    }

    svg {
        height: 100%;
        width: 100%;
    }
    svg {
        overflow: hidden;
        vertical-align: middle;
    }
    .listWrapper.jsx-1321156703 ul.jsx-1321156703 {
        padding: 0px;
    }
    ol, ul, dl {
        margin-top: 0;
        margin-bottom: 1rem;
    }
    ul {
        display: block;
        list-style-type: disc;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;
    }

    .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703 .link-block.jsx-1321156703 .overview-link.jsx-1321156703 {
        margin-right: 9px;
    }
    .text-link {
        color: #4FB8DD;
    }
    .font-weight-semi {
        font-weight: 600;
    }
    .listWrapper.jsx-1321156703 .courseBlock.jsx-1321156703 .link-block.jsx-1321156703 .customPill.jsx-1321156703 {
        background-color: rgb(255, 121, 0);
        border-radius: 50rem;
        font-size: 10px;
        text-transform: uppercase;
        color: white;
        padding: 2px 10px;
        border: none;
        outline: none;
    }

    .view-btn.jsx-1321156703 {
        bottom: 25px;
        right: 25px;
    }
    .text-right {
        text-align: right;
    }
    .position-absolute {
        position: absolute;
    }
    .listWrapper.jsx-1321156703 .allCourseBtn.jsx-1321156703 {
        color: white;
    }
    .btn-primary {
        color: #fff;
        background-color: #ff7900;
        border-color: #ff7900;
    }
    
    .mr-1, .mx-1 {
        margin-right: 0.25rem;
    }
</style>