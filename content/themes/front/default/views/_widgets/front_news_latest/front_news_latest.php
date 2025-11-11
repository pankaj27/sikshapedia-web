<?php 
  
  if(!empty($news_list)){
    ?>
    <div class="card mb-4 position-sticky" style="top:50px;">
      <div class="card-header bg-white">
        <h5 class="m-0">Latest News</h5>
      </div>
      <ul class="list-group list-group-flush" id="news_list">
        <?php
        foreach ($news_list as $key => $value) {
          ?>
          <li class="list-group-item">
            <a href="<?php echo $value['news_link'];?>" target="_blank" class="media">
              <img src="<?php echo $value['news_banner'];?>" width="40" class="mr-2" alt="<?php echo $value['page_heading'];?>"> 
              <div class="media-body">
                <h6 class="mb-0 color2"><?php echo $value['news_heading'];?></h6>
                <small><?php echo $value['news_published_date'];?></small> 
              </div>
            </a>
          </li>
          <?php
        }
        ?>
      </ul>
    </div>
    <?php
  }
?>