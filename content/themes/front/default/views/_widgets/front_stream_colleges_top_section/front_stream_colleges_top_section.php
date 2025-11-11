
<?php
if(!empty($colleges)){
  ?>
  <div class="card mb-4">
    <div class="card-header bg-white">
      <h5 class="m-0 text-uppercase">TOP <?php echo $stream_data->stream_name;?> COLLEGES</h5>
    </div>
    <ul class="list-group list-group-flush">
      <?php
      foreach ($colleges as $key => $value) {
        ?>
        <li class="list-group-item">
          <a href="<?php echo $value['access_url'];?>" class="media">
            <div class="card__image loading"></div>
            <img data-src="<?php echo $value['college_logo'];?>" width="40" class="mr-2 lazy" alt="<?php echo $value['college_name'];?>" style="display:none;">
            <noscript><img src="<?php echo $value['college_logo'];?>" width="40" class="mr-2 lazy" alt="<?php echo $value['college_name'];?>" style="display:none;"></noscript> 
            <div class="media-body">
              <h6 class="mb-0 color2"><?php echo $value['college_name'];?></h6>
              <small><?php echo $value['college_state'];?>,<?php echo $value['college_city'];?></small> 
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

<style type="text/css">
  .text-uppercase {
        text-transform: uppercase;
    }
    .card__image.loading {
        height: 40px;
        width: 40px;
        margin-right: 5px !important;
        background: #d3d3d370;
        background-repeat: repeat-y;
        background-size: 40px 40px;
        background-position: 0 0;
    }
   .skeleton-loader {
      width: 100%;
      height: 15px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
        ),
        lightgray;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite; 
    }
    @keyframes shine {  
      to {
        background-position: 100% 0, /* move highlight to right */ 0 0;
      }
    }

    .skeleton-loader:empty {      
      width: 100%;
      height: 15px;
      display: block;
      background: linear-gradient( to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% ), #d3d3d370;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      animation: shine 1s infinite;
    }

    #btn_get_contact_details{
      cursor: pointer !important;
      margin-bottom:20px;
    }

    .headerBnrSec.overlayBnr .bnrThumbBox .bnrThumbCon {
        width: calc(100% - 210px);
    }
  </style>