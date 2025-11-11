<?php

if(!empty($blog_post_data)){
	foreach ($blog_post_data as $key => $value) {
		?>
		<div class="col-lg-4">
          <div class="card crd-prt">
            <span class="badge bg-success position-absolute top-0 end-0 m-3 fs-sm spon">Sponsored</span>
            <img src="<?php echo $value['blog_cover_image'];?>" alt="Post image">
            <div class="card-body crd-body">
              <a class="fs-sm text-uppercase text-decoration-none txt" href="#">Loreal Ipsum</a>
              <h2 class="headi-prt">
                <a href="<?php echo $value['blog_link'];?>"> <?php echo $value['blog_title'];?>.</a>
              </h2>
              <p class="mb-md-4 text-muted"><?php echo $value['blog_exerpt'];?></p>
            </div>
            <div class="card-footer p-0 border-top-0 foter-prt">
              <a class="d-flex align-items-center text-decoration-none position-relative zindex-5" href="#">
                <img class="rounded-circle" src="https://i.pravatar.cc/150?img=41" width="48" alt="Avatar">
                <div class="ps-2">
                  <h6 class="fs-sm text-nav lh-base mb-1 nme1">Kristin Watson</h6>
                  <div class="d-flex text-body fs-xs">
                    <span class="me-2 pe-1">
                      <i class="fi-calendar-alt opacity-70 mt-n1 me-1 align-middle"></i>Apr 28 </span>
                    <span>
                      <i class="fi-chat-circle opacity-70 mt-n1 me-1 align-middle"></i>0 comments </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
		<?php
	}
}


?>