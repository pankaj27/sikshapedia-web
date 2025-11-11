<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js" integrity="sha512-0prPS4bqbfG6htnK0GfzPc6ABt1qDf7CgPi1whokI1W/bRpgi8cLo0WTPP93gFP3RSQf6ewU8ytrwIhIsPT8QA==" crossorigin="anonymous"></script>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/streams">Streams</a></li>
			<li class="breadcrumb-item active" aria-current="page">Tools-Files Editor</li>
		</ol>
	</nav>


	<div class="row">					
		<div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">

              	<?php
              	if(isset($error_msg)){
              		?>
              		<div class="row">
              			<div class="col-md-12">
              				<div class="alert alert-danger">
								<?php echo $error_msg;?>
							</div>
              			</div>
              		</div>
              		<?php
              	}else{
              		?>
              		<h6 class="card-title">robots.txt</h6>

					<?php
					if($file_is_locked=='yes'){
						?>
						<div class="alert alert-danger"><?php echo $message;?></div>
						<?php
					}
					?>

					<form class="forms-sample" id="form_robots" autocomplete="off" method="post">
						<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
						<div class="form-group row">
							<div class="col-md-12">
								<div id="editor"><?php echo $robotsTxtContent;?></div>
							</div>
						</div>

						<?php
						if($file_is_locked_by=='me'){
							?>
							<button type="submit" class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" id="btn_submit">Save Changes & Close File</button>
							<?php
						}

						if($file_is_locked=='yes' && $file_is_locked_by=='me'){
							?>
							<button type="button" class="btn btn-dark btn-icon-text mb-2 mb-md-0" id="btn_close_filet">Close File</button>
							<?php
						}
						?>

						
					</form>
              		<?php
              	}

              	?>

					
              </div>
            </div>
		</div>
	</div>




</div>


<style type="text/css">
	 textarea.file_editor_txt {
	    width: 99%;
	}

	.code, code {
	    font-family: Consolas, Monaco, monospace;
	    direction: ltr;
	    unicode-bidi: embed;
	}

	
</style>
