<section class="commonSec futureSec bg-white ">
	<div class="wrapper">
		<div class="section-title">

            <h2>CHOOSE YOUR FUTURE</h2>

            <p>Waytoadmissions.com is an extensive search engine for the students, parents,and education industry players who are seeking information</p>

        </div>

        <div class="tab mb-5 d-flex justify-content-center" role="tabpanel">

            <ul class="nav nav-tabs">

                <li class="nav-item">

                  <a class="nav-link active" href="#futureTab1" data-toggle="tab">COLLEGES</a>

                </li>

                <li class="nav-item">

                  <a class="nav-link" href="#futureTab2" data-toggle="tab">EXAMS</a>

                </li>

            </ul>

        </div>

        <div class="tab-content" id="futureTabContent">
        	<div class="tab-pane show fade active" id="futureTab1">
        		<div class="row">
        			<?php
        			if(!empty($streams)){
        				foreach ($streams as $key => $value) {
        					?>
        					<div class="col-md-3 col-sm-6">
        						<a href="<?php echo $value['access_link'];?>" class="futureBox">
        							<div class="future-icon">
        								<?php echo $value['stream_icon'];?>
        							</div>
        							<div class="future-content">

			                            <h3><?php echo $value['stream_name'];?></h3>

			                            <h4><?php echo $value['stream_tolal_colleges'];?> </h4>

			                        </div>
        						</a>
        					</div>
        					<?php
        				}
        			}

        			?>
        		</div>
        	</div>

        	<div class="tab-pane show fade" id="futureTab2">
        		<div class="row">
        			<?php
        			if(!empty($streams)){
        				foreach ($streams as $key => $value) {
        					?>
        					<div class="col-md-3 col-sm-6">
        						<a href="<?php echo $value['exam_access_link'];?>" class="futureBox">
        							<div class="future-icon">
        								<?php echo $value['stream_icon'];?>
        							</div>
        							<div class="future-content">

			                            <h3><?php echo $value['stream_name'];?></h3>

			                            <h4><?php echo $value['stream_tolal_exams'];?> </h4>

			                        </div>
        						</a>
        					</div>
        					<?php
        				}
        			}

        			?>
        		</div>
        	</div>
        </div>

	</div>
</section>