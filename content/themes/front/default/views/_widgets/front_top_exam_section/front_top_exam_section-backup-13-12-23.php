<?php 

if(!empty($top_exams)){
    ?>
    <section class="commonSec topExmSec bg-white">
        <div class="wrapper">
            <div class="section-title text-white">
                <h2>Top Exams</h2>
            </div>
            <div class="btnGroup flex-wrap">          
                <div class="row">
                    <?php
                    foreach ($top_exams as $key => $value) {
                        ?>
                        <div class="col-md-4">
                         <div class="card infoCard mb-4">
                            <div class="card-header">
                                <a title="<?php echo $value['exam_short_name'];?>" target="_blank" class="text-h2 mt-1 mb-2 d-block text-secondary title" href="<?php echo $value['exam_link'];?>"><?php echo $value['exam_short_name'];?></a>
                                <p class="text-base text-silver"><?php echo $value['exam_short_desc'];?></p>
                                <a target="_blank" class="d-block text-right read-more" href="<?php echo $value['exam_readmore_link'];?>">read more</a>
                                    
                                </div>
                            </div>
                        </div>
                        <?php
                    }

                    ?>    
                </div>
            </div>
        </div>
    </section>
    <?php
}
?>