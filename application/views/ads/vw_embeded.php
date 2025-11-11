<html>
    <head>
    </head>
    <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">

        <?php

        if(!empty($ads) && $ads['listing_category']=='CUSTOM_IMG_ADS'){
            
            ?>
            <div class="adBlock" style="padding-top: 10px;margin-bottom: -42px;">
                <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
                    <div class="adBlock">
                        <div class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
                            <div class="mb-4" style="text-align:center;">
                                <a href="<?php echo $ads['ads_link'];?>" target="_blank" title="<?php echo $ads['image_title'];?>" onClick="at('<?php echo $ads['ads_id'];?>')">
                                    <img src="<?php echo $ads['ads_image'];?>" width="<?php echo $ads['image_width'];?>px" height="<?php echo $ads['image_height'];?>px" alt="<?php echo $ads['image_alt'];?>" title="<?php echo $ads['image_title'];?>" loading="lazy" class="ads_link">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <?php

            if(!empty($ads)){
                ?>
                <style type="text/css">
                    .ads_link{
                        cursor: pointer;
                    }
                </style>
                <script type="text/javascript">

                    function at(ads_id){
                        <?php
                            if($ads['track_visits']=='1'){
                                ?>
                                
                                $.ajax({
                                    type:'POST',
                                    url:base_url+'/recordadsvisits',
                                    data:{[csrf_name]:csrf_hash,ads_id:ads_id},
                                    success:function(){

                                        setTimeout(function(){
                                            //window.location.href="<?php echo $ads['ads_link'];?>";
                                        },1100);
                                    }
                                });
                                <?php                   
                            }else{
                                ?>
                                //window.location.href="<?php echo $ads['ads_link'];?>";
                                <?php
                            }

                            ?>
                    }

                
                </script>
                <?php
            }

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
