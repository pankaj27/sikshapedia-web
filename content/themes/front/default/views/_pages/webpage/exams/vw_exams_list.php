<section class="bradcumSec bg-white py-2 bg-white">
       <div class="wrapper">
            <div class="row">
                <div class="col-md-10">
                    <nav aria-label="breadcrumb" >
                        <ol class="breadcrumb bg-white m-0 pl-0">
                          <?php
                          foreach ($exams_data['breadcumb'] as $key => $value) {
                            ?>
                            <li class="breadcrumb-item <?php echo (empty($value))?'active':'';?>">
                              <?php
                              if(!empty($value)){
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
                          ?>
                        </ol>
                    </nav>
                </div>
                <div class="col-md-12">
                    <h3 class=" mb-3" style="color: #ff7900;"><?php echo $exams_data['exam_heading'];?></h3>
                </div>

                <?php
                if(!empty($exams_data['exam_page_description'])){
                  ?>
                  <div class="col-md-12 readall">
                    <?php echo $exams_data['exam_page_description'];?>
                  </div>
                  <?php
                }

                ?>
            </div>
        </div>
  </section>

<main class="isa-main-content" id="main_content">
    

  <section class="col-lg-12" id="exams_list" style="margin-top:10px;">
  <?php $this->widget->run('front_exam_list_details_section',true,$_country_id,$_stream_id);?>
  </section>

</main>

   <?php $this->widget->run('front_subscription_section',TRUE);?>

  <script type="text/javascript">var _filter_country='<?php echo $country_id;?>';var _filter_stream='<?php echo $stream_id;?>';var page='exam_list_page';var _c='';var wbpage='examlistpage';var _vtype='';</script>

  <style type="text/css">
    .text-primary {
    color: #ff7900;
}
  </style>

  <style type="text/css">
  .exam_list_view_wrapper .exam_list_view {
      border-radius: 2.7px;
      box-shadow: 0 0 4px 0 rgb(207 207 207 / 50%);
  }
  .text-gray {
      color: #666;
  }
  .font-italic {
      font-style: italic;
  }
  .color-pink{
    color: #937fd7
  }
  .color-sky-blue{
    color: #5a88bb
  }
  .bg-gray{
    background-color: #e5e1e1;
  }
  .text-sidebar-heading {
      color: #4d586c;
  }

  .font-weight-semi {
      font-weight: 600;
  }
</style>