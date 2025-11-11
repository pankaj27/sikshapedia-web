<?php 
  if(!empty($news_data)){
    ?>
    <div class="card imageCard mb-4 front_news_brief_section">
      <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
        <div class="media">
          <div class="media-body">
            <h5 class="mt-0 color2">COLLEGE NEWS AND ARTICLE</h5>
          </div>
        </div>

        <div class="updateDate color2"><a class="color2" href="<?php echo $value['news_view_all_link'];?>">View All</a></div>
      </div>
      <div class="card-body">
        <div class="row">
        <?php
            foreach ($news_data as $key => $value) {
                ?>
                <div class="col-lg-4" style="margin-top:20px;">
                    <div class="card crd-prt">
                      <!-- <span class="badge bg-success position-absolute top-0 end-0 m-3 fs-sm spon">Sponsored</span> -->
                      <img src="<?php echo $value['news_image'];?>" alt="<?php echo $value['news_title'];?>" style="height:278px;">
                      <div class="card-body crd-body">
                        <a class="fs-sm text-uppercase text-decoration-none txt" href="#"><?php echo $value['blog_category'];?></a>
                        <h2 class="headi-prt">
                          <a href="<?php echo $value['news_link'];?>"><?php echo $value['news_title'];?></a>
                        </h2>
                                         
                      </div>
                      <div class="card-footer border-top-0 foter-prt">
                        <a class="d-flex align-items-center text-decoration-none position-relative zindex-5" href="#">
                          <img class="rounded-circle" src="<?php echo $value['new_user_image'];?>" width="48" alt="<?php echo $value['news_user_name'];?>">
                          <div class="ps-2">
                            <h6 class="fs-sm text-nav lh-base mb-1 nme1 color2"><?php echo $value['news_user_name'];?></h6>
                            <div class="d-flex text-body fs-xs">
                              <span class="me-2 pe-1">
                                <i class="fi-calendar-alt opacity-70 mt-n1 me-1 align-middle"></i><?php echo $value['news_published'];?> </span>
                              <!-- <span>
                                <i class="fi-chat-circle opacity-70 mt-n1 me-1 align-middle"></i>0 comments </span> -->
                            </div>
                          </div>
                        </a>
                      </div>
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
    .crd-prt h2.headi-prt{
        font-size: 18px;
    }
</style>