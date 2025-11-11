<div class="card infoCard mb-4">
	<div class="card-header bg-white">
      <h5 class="m-0 color2"> COMMENTS</h5>
    </div>
    <div class="card-body">
    	<form id="form_college_comment" novalidate="novalidate">
    		<div class="row">
                <div class="col-sm-12" id="comment_msg">
                    
                </div>
    			<div class="col-sm-12">    			
	    			<div class="form-group">
	                  <textarea class="form-control" rows="5" name="comment_value"></textarea>
	                </div>
	            </div>
	            <div class="col-sm-12">    		
	    			<div class="form-group">
	    				<?php
	    				if($account_verification_popup=='no'){
	    					?>
	    					<button type="submit" class="btn btn-warning pull-right" id="btn_post_comment">Post Your Comment</button>
	    					<?php
	    				}else if($account_verification_popup=='yes'){
	    					?>
	    					<a class="btn btn-warning pull-right" href="<?php echo base_url('signin');?>">Post Your Comment</a>
	    					<?php
	    				}
	    				?>
	                   
	                </div>
	    		</div>
	    	</div>
    	</form>
        <?php
         if(!empty($comments)){
            ?>
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Recent Comments</h4>
                            <h6 class="card-subtitle"><?php echo $total_comments;?> comments</h6>
                        </div>
                        <div class="comment-widgets m-b-20">
                            <?php
                            $i=0;
                            foreach ($comments as $key => $value) {
                                ?>
                                <div class="d-flex flex-row comment-row ">
                                    <div class="p-2"><span class="round"><img src="<?php echo $value['comment_user_image'];?>" alt="<?php echo $value['comment_user'];?>" width="50"></span></div>
                                    <div class="comment-text active w-100">
                                        <h5><?php echo $value['comment_user'];?></h5>
                                        <div class="comment-footer"> <span class="date"><?php echo $value['comment_date'];?></span></div>
                                        <p class="m-b-5 m-t-10"><?php echo $value['comment_value'];?></p>

                                        <?php
                                        if(!empty($reply_comments)){
                                            foreach ($reply_comments as $k => $v) {
                                                ?>
                                                <div class="d-flex flex-row comment-row ">
                                                    <div class="p-2"><span class="round"><img src="<?php echo $v['comment_user_image'];?>" alt="<?php echo $v['comment_user'];?>" width="50"></span></div>
                                                    <div class="comment-text active w-100">
                                                        <h5><?php echo $v['comment_user'];?></h5>
                                                        <div class="comment-footer"> <span class="date"><?php echo $v['comment_date'];?></span> </div>
                                                        <p class="m-b-5 m-t-10"><?php echo $v['comment_value'];?></p>
                                                    </div>
                                                </div>
                                                <?php
                                            }
                                        }
                                        ?>

                                        <div class="">
                                            <form class="form_college_comment<?php echo $i;?>" novalidate="novalidate">
                                                <input type="hidden" name="comment_to_reply" value="<?php echo $value['comment_id'];?>">
                                                <div class="row">
                                                    <div class="col-sm-12" id="comment_msg<?php echo $i;?>">
                                                        
                                                    </div>
                                                    <div class="col-sm-12">             
                                                        <div class="form-group">
                                                          <textarea class="form-control" rows="3" name="comment_value"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12">         
                                                        <div class="form-group">
                                                            <?php
                                                            if($account_verification_popup=='no'){
                                                                ?>
                                                                <button type="submit" onclick="submit_reply_comment('form_college_comment<?php echo $i;?>','btn_post_comment<?php echo $i;?>','comment_msg<?php echo $i;?>');" class="btn btn-warning pull-right" id="btn_post_comment<?php echo $i;?>">Reply</button>
                                                                <?php
                                                            }else if($account_verification_popup=='yes'){
                                                                ?>
                                                                <a class="btn btn-warning pull-right" href="<?php echo base_url('signin');?>">Reply</a>
                                                                <?php
                                                            }
                                                            ?>
                                                           
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>                                            
                                    </div>
                                </div>
                                <?php
                                $i++;
                            }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
            <?php
         }
        ?>
    	
    </div>
</div>

<?php
if($account_verification_popup=='yes'){
	?>
	<div class="modal fade logRegModal" id="accverifyForCommentModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="logSignSec">
        <div class="head d-flex align-items-center justify-content-between">
          <a href="#" class="logoBrand"><img src="<?php echo $system_logo;?>" width="100" alt="<?php echo $system_name;?>"></a>
          <ul class="nav flex-row">
              <li class="nav-item  d-none d-sm-inline">
                <span class="nav-link">Not a member yet?<a href="#regModal"  data-toggle="modal" data-dismiss="modal" id="sign_up_btns" data-login_from="">  Sign Up</a></span>
              </li>
              <li class="nav-item ">
                <button class="nav-link btn" href="#" data-dismiss="modal" aria-label="Close"><span class="fas fa-times"></span></button>
              </li>
          </ul>
        </div>
        <div class="logSignContent">
            
            <div class="secRight">
              <div class="secInner">
                <h4 class="mb-4">Log Into Your Account</h4>
                <!-- <div class="d-flex justify-content-between mb-4">
                    <button class="btn-temp btn_social" data-social_id="gauth" id="btn_gauth"><i class="fab fa-google"></i> <span class="d-none d-sm-inline"> Google </span></button>
                    <button class="btn-temp btn_social" data-social_id="fbauth" id="btn_fbauth"><i class="fab fa-facebook"></i><span class="d-none d-sm-inline"> Facebook</span> </button>
                    <button class="btn-temp btn_social" data-social_id="appleauth" id="btn_appleauth"><i class="fab fa-apple"></i> <span class="d-none d-sm-inline"> Apple </span></button>
                </div>
                <h6 class="orTitle mb-3" id="">Or log in using your email address</h6> -->
                <form id="form_login">
                    <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
                    <input type="hidden" name="user_curl" id="user_curl" value="">
                    <input type="hidden" name="login_from" id="login_from" value="normal">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Username</label>
                                <input type="text" placeholder="Username" class="form-control" id="user_name" name="user_name">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" placeholder="7+ characters" class="form-control" id="user_password" name="user_password">
                            </div>
                        </div>
                        <!-- <div class="col-sm-12">
                            <div class="form-group form-check">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                                <label class="form-check-label" for="exampleCheck1">Keep meLogged In.</label>
                              </div>
                        </div> -->
                    </div>
                    <div class="d-flex justify-content-between">
                        <button class="btn-temp" type="submit" id="btn_login">Log In</button>
                        <span>Forgot Password? <a href="javascript:void(0);" id="forget_link"> Click Here.</a></span>
                    </div>
                </form>
                <form id="form_forget_pass" style="display:none;">
                    <input type="hidden" name="user_curl" id="user_curl" value="">
                    <input type="hidden" name="login_from" id="login_from" value="normal">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Registered Email</label>
                                <input type="text" placeholder="Registered Email" class="form-control" id="registered_email" name="registered_email">
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button class="btn-temp" type="submit" id="btn_login">Submit</button>
                    </div>
                </form>
              </div>
            </div> 
        </div>
      </div>
    </div>
  </div>
</div>
	<?php
}
?>

<script type="text/javascript">
	var comment_type_id='<?php echo $college_id;?>';
	var comment_type='college';
</script>
<style type="text/css">
.card-no-border .card {
    border: 0px;
    border-radius: 4px;
    -webkit-box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05)
}

.card-body {
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 1.25rem
}

.comment-widgets .comment-row:hover {
    background: rgba(0, 0, 0, 0.02);
    cursor: pointer
}

.comment-widgets .comment-row {
    border-bottom: 1px solid rgba(120, 130, 140, 0.13);
    padding: 15px
}

.comment-text:hover {
    visibility: hidden
}

.comment-text:hover {
    visibility: visible
}

.label {
    padding: 3px 10px;
    line-height: 13px;
    color: #ffffff;
    font-weight: 400;
    border-radius: 4px;
    font-size: 75%
}

.round img {
    border-radius: 100%
}

.label-info {
    background-color: #1976d2
}

.label-success {
    background-color: green
}

.label-danger {
    background-color: #ef5350
}

.action-icons a {
    padding-left: 7px;
    vertical-align: middle;
    color: #99abb4
}

.action-icons a:hover {
    color: #1976d2
}

.mt-100 {
    margin-top: 100px
}

.mb-100 {
    margin-bottom: 100px
}
</style>


 <!-- <div class="d-flex flex-row comment-row">
                                    <div class="p-2"><span class="round"><img src="https://i.imgur.com/cAdLHeY.jpg" alt="user" width="50"></span></div>
                                    <div class="comment-text w-100" id="myGroup">
                                        <h5>Sarah Tim</h5>
                                        <div class="comment-footer"> <span class="date">Jan 20, 2020</span> <span class="label label-danger">Rejected</span> <span class="action-icons"> <a href="#" data-abc="true"><i class="fa fa-pencil"></i></a> <a href="#" data-abc="true"><i class="fa fa-rotate-right"></i></a> <a href="#" data-abc="true"><i class="fa fa-heart"></i></a> </span> </div>
                                        <p class="m-b-5 m-t-10">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure</p>
                                        <div id="collapse-1" class="bg-light p-2 collapse" data-parent="#myGroup">
                                            <div class="d-flex flex-row align-items-start"><img class="rounded-circle" src="https://i.imgur.com/RpzrMR2.jpg" width="40"><textarea class="form-control ml-1 shadow-none textarea"></textarea></div>
                                            <div class="mt-2 text-right"><button class="btn btn-primary btn-sm shadow-none" type="button">Post comment</button><button class="btn btn-outline-primary btn-sm ml-1 shadow-none" type="button">Cancel</button></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-row comment-row">
                                    <div class="p-2"><span class="round"><img src="https://i.imgur.com/uIgDDDd.jpg" alt="user" width="50"></span></div>
                                    <div class="comment-text w-100">
                                        <h5>Samso Nagaro</h5>
                                        <div class="comment-footer"> <span class="date">March 20, 2020</span> <span class="label label-info">Pending</span> <span class="action-icons"> <a href="#" data-abc="true"><i class="fa fa-pencil"></i></a> <a href="#" data-abc="true"><i class="fa fa-rotate-right"></i></a> <a href="#" data-abc="true"><i class="fa fa-heart"></i></a> </span> </div>
                                        <p class="m-b-5 m-t-10">It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
                                    </div>
                                </div> -->

<script type="text/javascript">
	
</script>