
<div class="modal fade bd-example-modal-xl" id="tinyFileBrowserModal_3" tabindex="-1" role="dialog" aria-labelledby="tinyFileBrowserModal_3" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="courseModal">Course Files</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body">

            	<div class="row chat-wrapper">


							<div class="col-lg-12">
								<div class="row position-relative">
		              <div class="col-lg-3 chat-aside border-lg-right">
		                  <div class="aside-content">
		                    <div class="aside-header">
		                      <div class="d-flex justify-content-between align-items-center pb-2 mb-2">
		                        <div class="d-flex align-items-center">
		                        	<button type="button" class="btn btn-xs btn-primary" id="back_to_parent">Back</button>
		                          <div>
		                            <h6 id="curent_folder"></h6>
		                            <p class="text-muted tx-13" id="curent_folder_created"></p>

		                          </div>
		                        </div>
		                        <div class="dropdown">
		                          <button class="btn p-0" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
		                            <i class="icon-lg text-muted pb-3px" data-feather="settings" data-toggle="tooltip" title="Settings"></i>
		                          </button>
		                          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
		                            <a class="dropdown-item d-flex align-items-center" href="#" data-toggle="modal" data-target="#newFolderModal"><i data-feather="folder-plus" class="icon-sm mr-2"></i> <span class="">New Folder</span></a>
		                            <a class="dropdown-item d-flex align-items-center" href="#" data-toggle="modal" data-target="#newFileModal"><i data-feather="file-plus" class="icon-sm mr-2"></i> <span class="">Upload File</span></a>
		                          </div>
		                        </div>
		                      </div>
		                      <form class="search-form">
		                        <div class="input-group border rounded-sm">
		                          <div class="input-group-prepend">
		                            <div class="input-group-text border-0 rounded-sm">
		                              <i data-feather="search" class="icon-md cursor-pointer"></i>
		                            </div>
		                          </div>
		                          <input type="text" class="form-control  border-0 rounded-sm" id="searchForm" placeholder="Search here...">
		                        </div>
		                      </form>
		                    </div>
		                    <div class="aside-body">
		                      <ul class="nav nav-tabs mt-3" role="tablist">
		                        <li class="nav-item">
		                          <a class="nav-link active" id="chats-tab" data-toggle="tab" href="#chats" role="tab" aria-controls="chats" aria-selected="true">
		                            <div class="d-flex flex-row flex-lg-column flex-xl-row align-items-center">
		                              <i data-feather="cloud" class="icon-sm mr-sm-2 mr-lg-0 mr-xl-2 mb-md-1 mb-xl-0"></i>
		                              <p class="d-none d-sm-block">Storage</p>
		                            </div>
		                          </a>
		                        </li>
		                        
		                        <!-- <li class="nav-item">
		                          <a class="nav-link" id="contacts-tab" data-toggle="tab" href="#contacts" role="tab" aria-controls="contacts" aria-selected="false">
		                            <div class="d-flex flex-row flex-lg-column flex-xl-row align-items-center">
		                              <i data-feather="trash-2" class="icon-sm mr-sm-2 mr-lg-0 mr-xl-2 mb-md-1 mb-xl-0"></i>
		                              <p class="d-none d-sm-block">Trash</p>
		                            </div>
		                          </a>
		                        </li> -->
		                      </ul>
		                      <div class="tab-content mt-3">
		                        <div class="tab-pane fade show active" id="chats" role="tabpanel" aria-labelledby="chats-tab">
		                           <div id="sys_folders"></div>
		                        </div>
		                        
		                        <div class="tab-pane fade" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
		                          <p class="text-muted mb-1">Contacts</p>
		                          <ul class="list-unstyled chat-list px-1">
		                            <li class="chat-item pr-1">
		                              <a href="javascript:;" class="d-flex align-items-center">
		                                <figure class="mb-0 mr-2">
		                                  <img src="../../../assets/images/faces/face2.jpg" class="img-xs rounded-circle" alt="user">
		                                  <div class="status offline"></div>
		                                </figure>
		                                <div class="d-flex align-items-center justify-content-between flex-grow border-bottom">
		                                  <div>
		                                    <p class="text-body">Amiah Burton</p>
		                                    <div class="d-flex align-items-center">
		                                      <p class="text-muted tx-13">Front-end Developer</p>
		                                    </div>
		                                  </div>
		                                  <div class="d-flex align-items-end text-body">
		                                    <i data-feather="message-square" class="icon-md text-success mr-2"></i>
		                                    <i data-feather="phone-call" class="icon-md text-primary mr-2"></i>
		                                    <i data-feather="video" class="icon-md text-danger"></i>
		                                  </div>
		                                </div>
		                              </a>
		                            </li>
		                            <li class="chat-item pr-1">
		                              <a href="javascript:;" class="d-flex align-items-center">
		                                <figure class="mb-0 mr-2">
		                                  <img src="../../../assets/images/faces/face3.jpg" class="img-xs rounded-circle" alt="user">
		                                  <div class="status online"></div>
		                                </figure>
		                                <div class="d-flex align-items-center justify-content-between flex-grow border-bottom">
		                                  <div>
		                                    <p class="text-body">John Doe</p>
		                                    <div class="d-flex align-items-center">
		                                      <p class="text-muted tx-13">Back-end Developer</p>
		                                    </div>
		                                  </div>
		                                  <div class="d-flex align-items-end text-body">
		                                    <i data-feather="message-square" class="icon-md text-success mr-2"></i>
		                                    <i data-feather="phone-call" class="icon-md text-primary mr-2"></i>
		                                    <i data-feather="video" class="icon-md text-danger"></i>
		                                  </div>
		                                </div>
		                              </a>
		                            </li>
		                            <li class="chat-item pr-1">
		                              <a href="javascript:;" class="d-flex align-items-center">
		                                <figure class="mb-0 mr-2">
		                                  <img src="../../../assets/images/faces/face4.jpg" class="img-xs rounded-circle" alt="user">
		                                  <div class="status offline"></div>
		                                </figure>
		                                <div class="d-flex align-items-center justify-content-between flex-grow border-bottom">
		                                  <div>
		                                    <p class="text-body">Yaretzi Mayo</p>
		                                    <div class="d-flex align-items-center">
		                                      <p class="text-muted tx-13">Fullstack Developer</p>
		                                    </div>
		                                  </div>
		                                  <div class="d-flex align-items-end text-body">
		                                    <i data-feather="message-square" class="icon-md text-success mr-2"></i>
		                                    <i data-feather="phone-call" class="icon-md text-primary mr-2"></i>
		                                    <i data-feather="video" class="icon-md text-danger"></i>
		                                  </div>
		                                </div>
		                              </a>
		                            </li>
		                            <li class="chat-item pr-1">
		                              <a href="javascript:;" class="d-flex align-items-center">
		                                <figure class="mb-0 mr-2">
		                                  <img src="../../../assets/images/faces/face5.jpg" class="img-xs rounded-circle" alt="user">
		                                  <div class="status offline"></div>
		                                </figure>
		                                <div class="d-flex align-items-center justify-content-between flex-grow border-bottom">
		                                  <div>
		                                    <p class="text-body">John Doe</p>
		                                    <div class="d-flex align-items-center">
		                                      <p class="text-muted tx-13">Front-end Developer</p>
		                                    </div>
		                                  </div>
		                                  <div class="d-flex align-items-end text-body">
		                                    <i data-feather="message-square" class="icon-md text-success mr-2"></i>
		                                    <i data-feather="phone-call" class="icon-md text-primary mr-2"></i>
		                                    <i data-feather="video" class="icon-md text-danger"></i>
		                                  </div>
		                                </div>
		                              </a>
		                            </li>
		                          </ul>
		                        </div>
		                      </div>
		                    </div>
		                  </div>
		              </div>
		              <div class="col-lg-9 chat-content">

		                  <div class="chat-header border-bottom pb-2">
		                    <div class="d-flex justify-content-between">
		                      <div class="d-flex align-items-center">
		                        <form class="search-form flex-grow mr-2">
		                        <div class="input-group">
		                          <input type="text" class="form-control rounded-pill" id="chatForm" placeholder="Search files..">
		                        </div>
		                      </form>
		                      </div>
		                      <div class="d-flex align-items-center mr-n1">
		                      	<form id="form_file_browser_upload">
		                      		<input type="hidden" value="" id="file_parent_folder" name="file_parent_folder">
		                      		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
			                      	<input type="file" name="file_browse" class="file-upload-default" style="visibility: hidden;">
			                        <div class="input-group col-xs-12">		                          	
																<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Image" value="">
																<span class="input-group-append">
																	<button class="file-upload-browse btn btn-primary" type="button">Browse Image</button>
																	<button class="btn btn-primary" type="submit" id="btn_upload_files">Upload</button>
																</span>
															</div>
														</form>
		                      </div>
		                    </div>
		                    <div class="progress ht-5" style="margin-top: 2px;margin-bottom: 2px;margin-left: 398px;margin-right: -4px;">
														  <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
														</div>
		                  </div>
		                  <div class="chat-body">

		                  	<input type="hidden" name="parent_folder" id="parent_folder" value="">
		                  	<div class="latest-photos">
													<div class="row" id="sys_files">
														
													</div>
												</div>
												<div class="row">
													<div id="inline" style="display: none;"><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); color: #fff;">Some inline content</div></div>
												</div>
		                  	<div class="jFiler-items jFiler-row">
		                  		
		                  	
			                  <ul class="jFiler-item-list" id="sys_folders_inner">

			                  </ul>
			                </div>

		                  </div>
		                  <div class="chat-footer d-flex">
		                  </div>
		              </div>
		          	</div>
							</div>

				</div>
				<div class="modal-footer">
					<div class="row">
					<div class="progress ht-5">
							  <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
							</div>
				</div>
					
				</div>
			</div>
		</div>
    </div>
</div>


<div class="modal fade" id="newFolderModal" tabindex="-1" role="dialog" aria-labelledby="newFolderModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <form class="forms-sample" id="form_folder_browser" role="form" name="form_folder_browser" method="POST" autocomplete="off">
        <div class="modal-header">
          <h5 class="modal-title" id="newFolderModalLabel">New Folder</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          
          <div class="form-group">
          	<input type="hidden" class="form-control" id="parent_folder_disk_name" name="parent_folder_disk_name">
            <input type="text" class="form-control" id="folder_name" name="folder_name" placeholder="Enter folder name">
          </div>
          <div class="form-group diverror"></div>
          
        
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary" id="btn_create_btn" disabled="true">Create</button>
        </div>
      </form>
    </div>
  </div>
</div>