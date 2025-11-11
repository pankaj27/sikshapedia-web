<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">

  <div class="row chat-wrapper">
    <div class="col-md-12">
      <div class="card">
        <div class="card-body">
          <div class="row position-relative">
            <div class="col-lg-3 chat-aside border-lg-right">
              <div class="aside-content">
                <div class="aside-header">
                  <div class="d-flex justify-content-between align-items-center pb-2 mb-2">
                    <div class="d-flex align-items-center">
                      <div><h6 id="curent_folder"></h6></div>
                    </div>
                    <div class="dropdown">
                      <button class="btn p-0" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="icon-lg text-muted pb-3px" data-feather="plus" data-toggle="tooltip" title="Settings"></i> <span class="">New</span>
                      </button>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item d-flex align-items-center" href="#" data-toggle="modal" data-target="#newFolderModal"><i data-feather="folder-plus" class="icon-sm mr-2"></i> <span class="">New Folder</span></a>
                        <a class="dropdown-item d-flex align-items-center" href="#" data-toggle="modal" data-target="#newFileModal"><i data-feather="file-plus" class="icon-sm mr-2"></i> <span class="">Upload File</span></a>
                      </div>
                    </div>
                  </div>
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
                      <a class="nav-link" id="calls-tab" data-toggle="tab" href="#calls" role="tab" aria-controls="calls" aria-selected="false">
                        <div class="d-flex flex-row flex-lg-column flex-xl-row align-items-center">
                          <i data-feather="phone-call" class="icon-sm mr-sm-2 mr-lg-0 mr-xl-2 mb-md-1 mb-xl-0"></i>
                          <p class="d-none d-sm-block">Recents</p>
                        </div>
                      </a>
                    </li> -->
                    <li class="nav-item">
                      <a class="nav-link" id="contacts-tab" data-toggle="tab" href="#contacts" role="tab" aria-controls="contacts" aria-selected="false">
                        <div class="d-flex flex-row flex-lg-column flex-xl-row align-items-center">
                          <i data-feather="trash-2" class="icon-sm mr-sm-2 mr-lg-0 mr-xl-2 mb-md-1 mb-xl-0"></i>
                          <p class="d-none d-sm-block">Trash</p>
                        </div>
                      </a>
                    </li>
                  </ul>
                  <div class="tab-content mt-3">
                    <div class="tab-pane fade show active" id="chats" role="tabpanel" aria-labelledby="chats-tab">
                      <div id="sys_folders">
                      </div>
                    </div>

                    <!-- <div class="tab-pane fade" id="calls" role="tabpanel" aria-labelledby="calls-tab">
                      <p class="text-muted mb-1">Recent calls</p>
                      <ul class="list-unstyled chat-list px-1">
                        <li class="chat-item pr-1">
                          <a href="javascript:;" class="d-flex align-items-center">
                            <figure class="mb-0 mr-2">
                              <img src="../../../assets/images/faces/face4.jpg" class="img-xs rounded-circle" alt="user">
                              <div class="status online"></div>
                            </figure>
                            <div class="d-flex align-items-center justify-content-between flex-grow border-bottom">
                              <div>
                                <p class="text-body">Jensen Combs</p>
                                <div class="d-flex align-items-center">
                                  <i data-feather="arrow-up-right" class="icon-sm text-success mr-1"></i>
                                  <p class="text-muted tx-13">Today, 03:11 AM</p>
                                </div>
                              </div>
                              <div class="d-flex flex-column align-items-end">
                                <i data-feather="phone-call" class="text-success icon-md"></i>
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
                                <p class="text-body">Leonardo Payne</p>
                                <div class="d-flex align-items-center">
                                  <i data-feather="arrow-down-left" class="icon-sm text-success mr-1"></i>
                                  <p class="text-muted tx-13">Today, 11:41 AM</p>
                                </div>
                              </div>
                              <div class="d-flex flex-column align-items-end">
                                <i data-feather="video" class="text-success icon-md"></i>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li class="chat-item pr-1">
                          <a href="javascript:;" class="d-flex align-items-center">
                            <figure class="mb-0 mr-2">
                              <img src="../../../assets/images/faces/face6.jpg" class="img-xs rounded-circle" alt="user">
                              <div class="status offline"></div>
                            </figure>
                            <div class="d-flex align-items-center justify-content-between flex-grow border-bottom">
                              <div>
                                <p class="text-body">Carl Henson</p>
                                <div class="d-flex align-items-center">
                                  <i data-feather="arrow-down-left" class="icon-sm text-danger mr-1"></i>
                                  <p class="text-muted tx-13">Today, 04:24 PM</p>
                                </div>
                              </div>
                              <div class="d-flex flex-column align-items-end">
                                <i data-feather="phone-call" class="text-danger icon-md"></i>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li class="chat-item pr-1">
                          <a href="javascript:;" class="d-flex align-items-center">
                            <figure class="mb-0 mr-2">
                              <img src="../../../assets/images/faces/face7.jpg" class="img-xs rounded-circle" alt="user">
                              <div class="status online"></div>
                            </figure>
                            <div class="d-flex align-items-center justify-content-between flex-grow border-bottom">
                              <div>
                                <p class="text-body">Jensen Combs</p>
                                <div class="d-flex align-items-center">
                                  <i data-feather="arrow-down-left" class="icon-sm text-danger mr-1"></i>
                                  <p class="text-muted tx-13">Today, 12:53 AM</p>
                                </div>
                              </div>
                              <div class="d-flex flex-column align-items-end">
                                <i data-feather="video" class="text-danger icon-md"></i>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li class="chat-item pr-1">
                          <a href="javascript:;" class="d-flex align-items-center">
                            <figure class="mb-0 mr-2">
                              <img src="../../../assets/images/faces/face2.jpg" class="img-xs rounded-circle" alt="user">
                              <div class="status online"></div>
                            </figure>
                            <div class="d-flex align-items-center justify-content-between flex-grow border-bottom">
                              <div>
                                <p class="text-body">John Doe</p>
                                <div class="d-flex align-items-center">
                                  <i data-feather="arrow-down-left" class="icon-sm text-success mr-1"></i>
                                  <p class="text-muted tx-13">Today, 01:42 AM</p>
                                </div>
                              </div>
                              <div class="d-flex flex-column align-items-end">
                                <i data-feather="video" class="text-success icon-md"></i>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li class="chat-item pr-1">
                          <a href="javascript:;" class="d-flex align-items-center">
                            <figure class="mb-0 mr-2">
                              <img src="../../../assets/images/faces/face3.jpg" class="img-xs rounded-circle" alt="user">
                              <div class="status offline"></div>
                            </figure>
                            <div class="d-flex align-items-center justify-content-between flex-grow border-bottom">
                              <div>
                                <p class="text-body">John Doe</p>
                                <div class="d-flex align-items-center">
                                  <i data-feather="arrow-up-right" class="icon-sm text-success mr-1"></i>
                                  <p class="text-muted tx-13">Today, 12:01 AM</p>
                                </div>
                              </div>
                              <div class="d-flex flex-column align-items-end">
                                <i data-feather="phone-call" class="text-success icon-md"></i>
                              </div>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div> -->

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
                  <div class="d-flex align-items-center mr-n1">
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
                </div>
              </div>
              <div class="chat-body">
                <div class="jFiler-items jFiler-row">
                  <ul class="jFiler-item-list">
                    <li class="jFiler-item">
                      <div class="jFiler-item-container">
                        <div class="jFiler-item-thumb">
                          <div class="jFiler-item-status"></div>
                          <div class="jFiler-item-info">
                            <span class="jFiler-item-title"><b title="image_2020_06_13T15_41_11_672Z.png">image_2020_06_13T15_41...</b></span>
                          </div>
                          <div class="jFiler-item-thumb-image">
                            <img src="" draggable="false">
                          </div>
                        </div>
                        <div class="jFiler-item-assets jFiler-row">
                          <ul class="list-inline pull-left">
                            <li>
                              <div class="jFiler-item-others text-success" style=""><i class="icon-jfi-check-circle"></i> image_2020_06_13T15...</div>
                            </li>
                          </ul>
                          <ul class="list-inline pull-right">
                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
                          </ul>
                        </div>
                      </div>
                    </li>

                    <li class="jFiler-item">
                      <div class="jFiler-item-container">
                        <div class="jFiler-item-thumb">
                          <div class="jFiler-item-status"></div>
                          <div class="jFiler-item-info">
                            <span class="jFiler-item-title"><b title="image_2020_06_13T15_41_11_672Z.png">image_2020_06_13T15_41...</b></span>
                          </div>
                          <div class="jFiler-item-thumb-image">
                            <img src="" draggable="false">
                          </div>
                        </div>
                        <div class="jFiler-item-assets jFiler-row">
                          <ul class="list-inline pull-left">
                            <li>
                              <div class="jFiler-item-others text-success" style=""><i class="icon-jfi-check-circle"></i> image_2020_06_13T15...</div>
                            </li>
                          </ul>
                          <ul class="list-inline pull-right">
                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
                          </ul>
                        </div>
                      </div>
                    </li>

                    <li class="jFiler-item">
                      <div class="jFiler-item-container">
                        <div class="jFiler-item-thumb">
                          <div class="jFiler-item-status"></div>
                          <div class="jFiler-item-info">
                            <span class="jFiler-item-title"><b title="image_2020_06_13T15_41_11_672Z.png">image_2020_06_13T15_41...</b></span>
                          </div>
                          <div class="jFiler-item-thumb-image">
                            <img src="" draggable="false">
                          </div>
                        </div>
                        <div class="jFiler-item-assets jFiler-row">
                          <ul class="list-inline pull-left">
                            <li>
                              <div class="jFiler-item-others text-success" style=""><i class="icon-jfi-check-circle"></i> image_2020_06_13T15...</div>
                            </li>
                          </ul>
                          <ul class="list-inline pull-right">
                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
                          </ul>
                        </div>
                      </div>
                    </li>

                    <li class="jFiler-item">
                      <div class="jFiler-item-container">
                        <div class="jFiler-item-thumb">
                          <div class="jFiler-item-status"></div>
                          <div class="jFiler-item-info">
                            <span class="jFiler-item-title"><b title="image_2020_06_13T15_41_11_672Z.png">image_2020_06_13T15_41...</b></span>
                          </div>
                          <div class="jFiler-item-thumb-image">
                            <img src="" draggable="false">
                          </div>
                        </div>
                        <div class="jFiler-item-assets jFiler-row">
                          <ul class="list-inline pull-left">
                            <li>
                              <div class="jFiler-item-others text-success" style=""><i class="icon-jfi-check-circle"></i> image_2020_06_13T15...</div>
                            </li>
                          </ul>
                          <ul class="list-inline pull-right">
                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
                          </ul>
                        </div>
                      </div>
                    </li>

                    <li class="jFiler-item">
                      <div class="jFiler-item-container">
                        <div class="jFiler-item-thumb">
                          <div class="jFiler-item-status"></div>
                          <div class="jFiler-item-info">
                            <span class="jFiler-item-title"><b title="image_2020_06_13T15_41_11_672Z.png">image_2020_06_13T15_41...</b></span>
                          </div>
                          <div class="jFiler-item-thumb-image">
                            <img src="" draggable="false">
                          </div>
                        </div>
                        <div class="jFiler-item-assets jFiler-row">
                          <ul class="list-inline pull-left">
                            <li>
                              <div class="jFiler-item-others text-success" style=""><i class="icon-jfi-check-circle"></i> image_2020_06_13T15...</div>
                            </li>
                          </ul>
                          <ul class="list-inline pull-right">
                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
                          </ul>
                        </div>
                      </div>
                    </li>

                    <li class="jFiler-item">
                      <div class="jFiler-item-container">
                        <div class="jFiler-item-thumb">
                          <div class="jFiler-item-status"></div>
                          <div class="jFiler-item-info">
                            <span class="jFiler-item-title"><b title="image_2020_06_13T15_41_11_672Z.png">image_2020_06_13T15_41...</b></span>
                          </div>
                          <div class="jFiler-item-thumb-image">
                            <img src="" draggable="false">
                          </div>
                        </div>
                        <div class="jFiler-item-assets jFiler-row">
                          <ul class="list-inline pull-left">
                            <li>
                              <div class="jFiler-item-others text-success" style=""><i class="icon-jfi-check-circle"></i> image_2020_06_13T15...</div>
                            </li>
                          </ul>
                          <ul class="list-inline pull-right">
                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
                          </ul>
                        </div>
                      </div>
                    </li>

                    <li class="jFiler-item">
                      <div class="jFiler-item-container">
                        <div class="jFiler-item-thumb">
                          <div class="jFiler-item-status"></div>
                          <div class="jFiler-item-info">
                            <span class="jFiler-item-title"><b title="image_2020_06_13T15_41_11_672Z.png">image_2020_06_13T15_41...</b></span>
                          </div>
                          <div class="jFiler-item-thumb-image">
                            <img src="" draggable="false">
                          </div>
                        </div>
                        <div class="jFiler-item-assets jFiler-row">
                          <ul class="list-inline pull-left">
                            <li>
                              <div class="jFiler-item-others text-success" style=""><i class="icon-jfi-check-circle"></i> image_2020_06_13T15...</div>
                            </li>
                          </ul>
                          <ul class="list-inline pull-right">
                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
                          </ul>
                        </div>
                      </div>
                    </li>

                    <li class="jFiler-item">
                      <div class="jFiler-item-container">
                        <div class="jFiler-item-thumb">
                          <div class="jFiler-item-status"></div>
                          <div class="jFiler-item-info">
                            <span class="jFiler-item-title"><b title="image_2020_06_13T15_41_11_672Z.png">image_2020_06_13T15_41...</b></span>
                          </div>
                          <div class="jFiler-item-thumb-image">
                            <img src="" draggable="false">
                          </div>
                        </div>
                        <div class="jFiler-item-assets jFiler-row">
                          <ul class="list-inline pull-left">
                            <li>
                              <div class="jFiler-item-others text-success" style=""><i class="icon-jfi-check-circle"></i> image_2020_06_13T15...</div>
                            </li>
                          </ul>
                          <ul class="list-inline pull-right">
                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
                          </ul>
                        </div>
                      </div>
                    </li>

                    <li class="jFiler-item">
                      <div class="jFiler-item-container">
                        <div class="jFiler-item-thumb">
                          <div class="jFiler-item-status"></div>
                          <div class="jFiler-item-info">
                            <span class="jFiler-item-title"><b title="image_2020_06_13T15_41_11_672Z.png">image_2020_06_13T15_41...</b></span>
                          </div>
                          <div class="jFiler-item-thumb-image">
                            <img src="" draggable="false">
                          </div>
                        </div>
                        <div class="jFiler-item-assets jFiler-row">
                          <ul class="list-inline pull-left">
                            <li>
                              <div class="jFiler-item-others text-success" style=""><i class="icon-jfi-check-circle"></i> image_2020_06_13T15...</div>
                            </li>
                          </ul>
                          <ul class="list-inline pull-right">
                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="chat-footer d-flex">
                      <div>
                        <button type="button" class="btn border btn-icon rounded-circle mr-2" data-toggle="tooltip" title="" data-original-title="Emoji">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-smile text-muted"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                        </button>
                      </div>
                      <div class="d-none d-md-block">
                        <button type="button" class="btn border btn-icon rounded-circle mr-2" data-toggle="tooltip" title="" data-original-title="Attatch files">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-paperclip text-muted"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                        </button>
                      </div>
                      <form class="">
                        <div class="search-form flex-grow mr-2 input-group">
                          <div class="jFiler-jProgressBar" style="display: block;"><div class="bar" style="width: 100%;"></div></div>
                        </div>
                      <div>
                      </div>
                    </div>
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


<div class="modal fade" id="newFileModal" tabindex="-1" role="dialog" aria-labelledby="newFileModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="newFileModalLabel">Upload File</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            <input type="text" id="folder_data" value="">
            <input type="file" name="documet_file">
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <!-- <button type="submit" class="btn btn-primary">Upload</button> -->
      </div>
 
    </div>
  </div>
</div>
