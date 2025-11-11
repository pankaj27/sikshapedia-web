<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="profile-content py-4">
    <div class="wrapper">
      <div class="row">
        <div class="col-lg-9 mb-4 mb-lg-0">
          <div class="card userCard">
            <div class="card-header bg-white">
              <h5 class="m-0 d-inline">Personal Information</h5> 
            </div>
            <div class="card-body">
                <form id="profileEditForm">
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label>First Name</label>
                            <input class="form-control" value="Abhijit " >
                        </div>
                        <div class="form-group col-sm-6">
                            <label>Last Name</label>
                            <input class="form-control" value="Mandal " >
                        </div>
                        <div class="form-group col-sm-6">
                            <label>Email</label>
                            <input class="form-control" value="Click2avi@gmail " >
                        </div>
                        <div class="form-group col-sm-6">
                            <label>Phone no</label>
                            <input class="form-control" value="9836627402" >
                        </div>
                        <div class="form-group col-sm-6">
                          <label for="inputState">State</label>
                          <select id="inputState" class="form-control">
                            <option selected>Choose...</option>
                            <option>...</option>
                          </select>
                        </div>
                        <div class="form-group col-sm-6">
                            <label class="d-block">Gender</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" checked  id="Male" name="mf">
                                <label class="form-check-label" for="Male">Male</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input"  id="Female" name="mf">
                                <label class="form-check-label" for="Female">Female</label>
                            </div>
                        </div>

                        <div class="form-group col-sm-6">
                          <label class="d-block">Checkbox</label>
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">
                            <label class="form-check-label" for="inlineCheckbox1">1</label>
                          </div>
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2">
                            <label class="form-check-label" for="inlineCheckbox2">2</label>
                          </div>
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3" disabled>
                            <label class="form-check-label" for="inlineCheckbox3">3 (disabled)</label>
                          </div>

                        </div>





                        <div class="col-sm-12">
                            <button class="btn btn-primary " type="submit" > Save Chenges</button>
                        </div>
                    </div>
                </form>
            </div>
          </div>
        </div>
        <div class="col-lg-3 ">
          <div class="card mb-4">
            <div class="card-header bg-white">
              <h5 class="m-0">Featured News</h5>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="assets/img/img-1.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="assets/img/img-2.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="assets/img/img-3.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
            </ul>
            <div class="card-header bg-white text-center">
              <a class="#">View All News</a>
            </div>
          </div>
          <div class="card mb-4">
            <div class="card-header bg-white">
              <h5 class="m-0">Featured News</h5>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="assets/img/img-1.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="assets/img/img-2.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="assets/img/img-3.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
            </ul>
            <div class="card-header bg-white text-center">
              <a class="#">View All News</a>
            </div>
          </div>
        </div>
      </div>

      
      

    </div> 
</div>