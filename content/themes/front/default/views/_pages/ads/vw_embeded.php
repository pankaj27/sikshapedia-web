<html>
    <head>
    </head>
    <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">

        <?php

        if($ads_type=='CUSTOM_IMG_ADS'){
            echo $this->widget->run('front_image_ads_ads_section',TRUE,['ads_id'=>$ads_id]);
        }else{
            ?>
            <div style="position: absolute; left: 0px; top: 0px;">
                <a href="<?php echo $ads_url;?>" target="_blank" rel="nofollow"><img
                    src="<?php echo $ads_image;?>"
                    border="0"
                    width="1"
                    height="1"
                    alt="<?php echo $ads_name;?>"
                    style="display: none;"
                /></a>
            </div>
            <?php
        }

        ?>

    	
    </body>
</html>
