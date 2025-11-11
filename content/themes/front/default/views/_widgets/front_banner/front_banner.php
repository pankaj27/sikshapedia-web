<?php
if(!empty($banners)){
    ?>
    <section class="swiper-container isaSlider">
        <div class="swiper-wrapper">
            <?php
            foreach($banners as $banner){
                ?>
                <div class="swiper-slide">
                    <img src="<?php echo $banner['banner_image'];?>?mode=stretch" alt="<?php echo $banner['banner_main_title'];?>" title="<?php echo $banner['banner_main_title'];?>" loading="lazy">
                    <div class="slideContent">
                        <div class="contrntInner">
                            <h2 class=""> <?php echo $banner['banner_main_title'];?> </h2>
                            <p class=""><?php echo $banner['banner_sub_title'];?></p>
                            <a href="<?php echo $banner['access_url'];?>" class="btn-temp btn-orange">Explore Now</a> 
                        </div>
                    </div>
                </div>
                <?php
            }
            ?>
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
        <button class="isppBtn playing">
            <svg viewBox="0 0 200 200">
                <circle class="" stroke="#fff" fill="none" stroke-width="10" cx="100" cy="100" r="100" />
                <circle class="progressPath" stroke="#f57b32" fill="none" stroke-width="15" cx="100" cy="100" r="98" />
            </svg>
        </button>
    </section> 
    <?php
}

?>
