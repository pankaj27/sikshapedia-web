<?php defined('BASEPATH') OR exit('No direct script access allowed');?>


<?php
if(!empty($fees_data)){
	?>
	<div class="jsx-3764765541 section_wrapper  my-4 pb-5">
		<div class="jsx-3764765541 article_heading">
			<h2 class="jsx-3764765541 font-weight-normal"><b class="jsx-3764765541">Fee</b> Structure</h2>
		</div>
		<ul class="jsx-3764765541 fee_struct list-unstyled p-0 m-0">

			<?php
			foreach ($fees_data as $key => $value) {
				?>
				<li class="jsx-3764765541">

					<?php
					if($value['fees_currency_format']=='left'){
						?>
						<?php echo $value['fees_currency'];?> <span class="jsx-3764765541"> <?php echo $value['fees_value'];?></span><div class="jsx-3764765541 category d-inline-block text-base"><?php echo $value['fees_category'];?></div>
						<?php
					}else if($value['fees_currency_format']=='right'){
						?>
						 <span class="jsx-3764765541"> <?php echo $value['fees_value'];?></span> <?php echo $value['fees_currency'];?> <div class="jsx-3764765541 category d-inline-block text-base"><?php echo $value['fees_category'];?></div>
						<?php
					}
					?>
					</li>
				<?php
			}
			?>
		</ul>
	</div>

	<hr class="jsx-3025402055 jsx-1091906639">
	<?php
}


if(!empty($mock_file_data)){
	?>
	<div class="jsx-222626221 section_wrapper my-4 pb-5">
		<div class="jsx-222626221 article_heading">
			<h2 class="jsx-222626221 font-weight-normal"><b class="jsx-222626221">Sample/Mock</b> Papers</h2>
		</div>
		<div class="jsx-222626221 row">
			<?php
			foreach ($mock_file_data as $key => $value) {
				?>
				<div class="jsx-222626221 col-md-3 col-sm-6">
					<a href="<?php echo $value['mock_file'];?>" target="_blank" class="jsx-222626221 text-md">
						<div class="jsx-222626221 download_sample">
							<span class="jsx-222626221 month">2021</span>
							<h3 class="jsx-222626221 text-base py-2"><?php echo $value['mock_file_name'];?></h3>
							<span class="jsx-222626221 text-md">Download here<span class="jsx-222626221 icon mock_paper_download_button">
								<svg id="new_download_as_pdf_svg__Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 49.2 45.5" xml:space="preserve" fill="#fff"><style></style>
									<path d="M39.3 29.4c-1.1-1.9-5.8-3.2-9.9-3.4-.4-.4-.8-.8-1.1-1.3-3.6-4.1-5-10-5.5-13.1-.1-.7-.1-1.2-.2-1.6 0-.3-.1-1-.9-1-.2 0-.4.1-.6.3-.3.3-.2.6-.2 1s.1 1 .2 1.6c.3 3.2.4 9.2-2 14.1-.3.5-.5 1-.8 1.4-4.6 1.3-8.3 3.7-8.8 5.7-.2.7 0 1.4.5 1.9.6.6 1.3.9 2.1.9 2.2 0 4.6-2.4 7.3-7.2 1.2-.3 2.4-.5 3.6-.7.4 0 1.2-.1 1.6-.2 1.2-.2 2.6-.3 4.1-.2 3.3 3.5 6 5.2 8.1 5.2 1.1 0 2-.5 2.5-1.5.4-.6.4-1.3 0-1.9zm-27.2 4.8c-.3 0-.6-.1-.9-.4-.1-.1-.1-.2-.1-.4.3-1 2.6-2.8 6.1-4-2 3.1-3.8 4.8-5.1 4.8zm12.3-8c-.4.1-1.1.2-1.5.2-.8.1-1.6.2-2.4.4 0-.1.1-.1.1-.2 1.2-2.4 1.9-5.2 2.2-8.4 1.1 3.1 2.5 5.6 4.3 7.6l.2.2c-1.1 0-2 .1-2.9.2zm13.5 4.3c-.3.5-.6.7-1.2.7-1.3 0-3.2-1.2-5.6-3.4 3.6.5 6.3 1.6 6.8 2.4.1.1.1.2 0 .3zm0 0"></path></svg>
								</span>
							</span>
						</div>
					</a>
				</div>
				<?php
			}

			?>
				

		</div>
	</div>

	<hr class="jsx-3025402055 jsx-1091906639">
	<?php
}

?>

