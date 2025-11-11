<?php
if (!empty($compared_colleges)) {
    $total_colleges = count($compared_colleges); // Count the number of compared colleges
    $i = 0;

    foreach ($compared_colleges as $key => $v) {
        // Show VS divider before the first item if there are multiple colleges
        if ($i > 0 && $total_colleges > 1) {
            ?>
            <div class="d-flex align-items-center my-3" id="rowV<?php echo $v['data_id']; ?>">
                <div class="flex-grow-1 border-bottom"></div>
                <div class="px-3 py-1 bg-dark text-white rounded-circle font-weight-bold">VS</div>
                <div class="flex-grow-1 border-bottom"></div>
            </div>
            <?php
        }
        ?>

        <div class="col-md-12" id="row<?php echo $v['data_id']; ?>">
            <div class="proBox">
                <div class="imgBox">
                    <a href="<?php echo $v['college_url']; ?>" contenteditable="false" style="cursor: pointer;"> 
                        <img class="" src="<?php echo $v['college_banner']; ?>" alt="<?php echo $v['college_name']; ?>">
                    </a>  
                    <div class="proReview btn_del_compare" data-bs-toggle="tooltip" data-bs-placement="right" title="Delete from Compare"
                        data-id="<?php echo $v['data_id']; ?>" data-college_id="<?php echo $v['college_id']; ?>" data-c_id="<?php echo $v['_id']; ?>"
                        onClick="delCompare(this)">
                        <i class="fas fa-trash"></i>
                    </div>                                      
                </div>
                <div class="proBoxBody">
                    <div class="proInfo">
                        <div class="infoImg">
                            <a href="<?php echo $v['college_url']; ?>" contenteditable="false" style="cursor: pointer;">
                                <img src="<?php echo $v['college_logo']; ?>" alt="<?php echo $v['college_name']; ?>">
                            </a>
                        </div>
                        <p class="infoTitle">
                            <a href="<?php echo $v['college_url']; ?>" contenteditable="false" style="cursor: pointer;"><?php echo $v['college_name']; ?></a>
                        </p>
                        <p class="infoLocation"><i class="fas fa-map-marker-alt"></i> <?php echo $v['college_state_city']; ?></p>
                    </div>
                </div>
            </div>
        </div>

        <?php
        $i++;
    }
}
?>