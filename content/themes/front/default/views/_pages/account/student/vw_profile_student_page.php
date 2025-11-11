<?php defined('BASEPATH') OR exit('No direct script access allowed');?>


<section class="pageDetailsSec py-4">
    <div class="wrapper">
        <div class="row">
            <div class="col-lg-3 mb-3 mb-lg-0">
                <div class="card">
                    <div class="card-body">
                        <?php $this->widget->run('front_profile_image_section',TRUE,$userdata->user_id);?>
                        <hr class="my-4">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap list-group-item-action <?php echo ($profile_menu_active==TRUE)?'active':'';?>">
                                <h6 class="mb-0"><span class="jsx-2394613297 icon menu-icon mr-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" class="jsx-2394613297"><path d="M510.702 438.722c-2.251-10.813-12.84-17.754-23.657-15.503-10.814 2.251-17.755 12.843-15.503 23.656 1.297 6.229-.248 12.613-4.236 17.519-2.31 2.841-7.461 7.606-15.999 7.606H60.693c-8.538 0-13.689-4.766-15.999-7.606-3.989-4.905-5.533-11.29-4.236-17.519 20.756-99.695 108.691-172.521 210.24-174.977a137.229 137.229 0 0010.624-.001c71.532 1.716 137.648 37.947 177.687 97.66 6.151 9.175 18.574 11.625 27.75 5.474 9.174-6.151 11.625-18.575 5.473-27.749-32.817-48.944-80.47-84.534-134.804-102.417C370.538 220.036 392 180.477 392 136 392 61.01 330.991 0 256 0S120 61.01 120 136c0 44.504 21.488 84.084 54.633 108.911-30.368 9.998-58.863 25.555-83.803 46.069-45.732 37.617-77.529 90.086-89.532 147.742-3.762 18.067.745 36.623 12.363 50.909C25.222 503.847 42.365 512 60.693 512h390.613c18.329 0 35.472-8.153 47.032-22.369 11.62-14.286 16.126-32.842 12.364-50.909zM160 136c0-52.935 43.065-96 96-96s96 43.065 96 96c0 51.305-40.455 93.339-91.141 95.878a261.967 261.967 0 00-9.699.001C200.465 229.35 160 187.312 160 136z" data-original="#000000" class="user_active_svg__active-path" data-old_color="#000000" fill="#FF7900"></path></svg></span><a href="<?php echo base_url('account');?>">Profile</a></h6>
                                <span class="text-secondary"></span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap list-group-item-action <?php echo ($colege_application_menu_active==TRUE)?'active':'';?>">
                                <h6 class="mb-0"><span class="jsx-2394613297 icon menu-icon mr-5"><svg height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg" class="jsx-2394613297"><path d="M467 46.003H45c-24.813 0-45 20.187-45 45v240c0 24.813 20.187 45 45 45h142.972l55.547 83.32c5.934 8.901 19.032 8.894 24.962 0l55.547-83.32H467c24.813 0 45-20.187 45-45v-240c0-24.813-20.187-45-45-45zm15 285c0 8.271-6.729 15-15 15H316a15.001 15.001 0 00-12.481 6.68L256 423.961l-47.519-71.278a15.001 15.001 0 00-12.481-6.68H45c-8.271 0-15-6.729-15-15v-240c0-8.271 6.729-15 15-15h422c8.271 0 15 6.729 15 15z"></path><path d="M161.095 182.361l-21.654-3.622-10.136-19.475c-5.599-10.757-21.021-10.74-26.611 0l-10.136 19.475-21.654 3.622c-11.961 2.003-16.71 16.672-8.223 25.31l15.389 15.657-3.246 21.713c-1.793 11.994 10.694 21.045 21.529 15.642L116 250.885l19.647 9.797c10.855 5.41 23.319-3.666 21.529-15.642l-3.246-21.713 15.389-15.657c8.5-8.65 3.72-23.309-8.224-25.309zm-33.805 25.272a15.002 15.002 0 00-4.137 12.732l.091.608-.55-.274a15 15 0 00-13.388 0l-.55.274.091-.608a14.996 14.996 0 00-4.137-12.732l-.431-.438.607-.102a14.996 14.996 0 0010.831-7.868l.284-.546.284.546a14.994 14.994 0 0010.831 7.868l.607.102zM301.095 182.361l-21.654-3.622-10.136-19.475c-5.599-10.757-21.021-10.74-26.611 0l-10.136 19.475-21.654 3.622c-11.961 2.003-16.71 16.672-8.223 25.31l15.389 15.657-3.246 21.713c-1.793 11.994 10.693 21.044 21.529 15.642L256 250.885l19.647 9.797c10.855 5.41 23.319-3.666 21.529-15.642l-3.246-21.713 15.389-15.657a15.001 15.001 0 00-8.224-25.309zm-33.805 25.272a15.002 15.002 0 00-4.137 12.732l.091.608c-2.266-1.13-4.378-1.851-7.244-1.851-2.821 0-4.928.695-7.244 1.851l.091-.608a14.996 14.996 0 00-4.137-12.732l-.431-.438.607-.102a14.996 14.996 0 0010.831-7.868l.284-.546.284.546a14.994 14.994 0 0010.831 7.868l.607.102zM441.095 182.361l-21.654-3.622-10.136-19.475c-5.599-10.757-21.021-10.74-26.611 0l-10.136 19.475-21.654 3.622c-11.961 2.003-16.71 16.672-8.223 25.31l15.389 15.657-3.246 21.713c-1.793 11.995 10.694 21.044 21.529 15.642L396 250.885l19.647 9.797c10.857 5.411 23.317-3.679 21.529-15.642l-3.246-21.713 15.389-15.657c8.5-8.65 3.72-23.309-8.224-25.309zm-33.805 25.272a15.002 15.002 0 00-4.137 12.732l.091.608c-2.266-1.13-4.378-1.851-7.244-1.851-2.821 0-4.928.695-7.244 1.851l.091-.608a14.996 14.996 0 00-4.137-12.732l-.431-.438.607-.102a14.996 14.996 0 0010.831-7.868l.284-.546.284.546a14.994 14.994 0 0010.831 7.868l.607.102z"></path></svg></span><a href="<?php echo base_url('account/applied-colleges');?>">Applied Colleges</a></h6>
                                <span class="text-secondary"></span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap list-group-item-action <?php echo ($college_favourite_menu_active==TRUE)?'active':'';?>">
                                <h6 class="mb-0"><span class="jsx-2394613297 icon menu-icon mr-5"><svg height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg" class="jsx-2394613297"><path d="M467 46.003H45c-24.813 0-45 20.187-45 45v240c0 24.813 20.187 45 45 45h142.972l55.547 83.32c5.934 8.901 19.032 8.894 24.962 0l55.547-83.32H467c24.813 0 45-20.187 45-45v-240c0-24.813-20.187-45-45-45zm15 285c0 8.271-6.729 15-15 15H316a15.001 15.001 0 00-12.481 6.68L256 423.961l-47.519-71.278a15.001 15.001 0 00-12.481-6.68H45c-8.271 0-15-6.729-15-15v-240c0-8.271 6.729-15 15-15h422c8.271 0 15 6.729 15 15z"></path><path d="M161.095 182.361l-21.654-3.622-10.136-19.475c-5.599-10.757-21.021-10.74-26.611 0l-10.136 19.475-21.654 3.622c-11.961 2.003-16.71 16.672-8.223 25.31l15.389 15.657-3.246 21.713c-1.793 11.994 10.694 21.045 21.529 15.642L116 250.885l19.647 9.797c10.855 5.41 23.319-3.666 21.529-15.642l-3.246-21.713 15.389-15.657c8.5-8.65 3.72-23.309-8.224-25.309zm-33.805 25.272a15.002 15.002 0 00-4.137 12.732l.091.608-.55-.274a15 15 0 00-13.388 0l-.55.274.091-.608a14.996 14.996 0 00-4.137-12.732l-.431-.438.607-.102a14.996 14.996 0 0010.831-7.868l.284-.546.284.546a14.994 14.994 0 0010.831 7.868l.607.102zM301.095 182.361l-21.654-3.622-10.136-19.475c-5.599-10.757-21.021-10.74-26.611 0l-10.136 19.475-21.654 3.622c-11.961 2.003-16.71 16.672-8.223 25.31l15.389 15.657-3.246 21.713c-1.793 11.994 10.693 21.044 21.529 15.642L256 250.885l19.647 9.797c10.855 5.41 23.319-3.666 21.529-15.642l-3.246-21.713 15.389-15.657a15.001 15.001 0 00-8.224-25.309zm-33.805 25.272a15.002 15.002 0 00-4.137 12.732l.091.608c-2.266-1.13-4.378-1.851-7.244-1.851-2.821 0-4.928.695-7.244 1.851l.091-.608a14.996 14.996 0 00-4.137-12.732l-.431-.438.607-.102a14.996 14.996 0 0010.831-7.868l.284-.546.284.546a14.994 14.994 0 0010.831 7.868l.607.102zM441.095 182.361l-21.654-3.622-10.136-19.475c-5.599-10.757-21.021-10.74-26.611 0l-10.136 19.475-21.654 3.622c-11.961 2.003-16.71 16.672-8.223 25.31l15.389 15.657-3.246 21.713c-1.793 11.995 10.694 21.044 21.529 15.642L396 250.885l19.647 9.797c10.857 5.411 23.317-3.679 21.529-15.642l-3.246-21.713 15.389-15.657c8.5-8.65 3.72-23.309-8.224-25.309zm-33.805 25.272a15.002 15.002 0 00-4.137 12.732l.091.608c-2.266-1.13-4.378-1.851-7.244-1.851-2.821 0-4.928.695-7.244 1.851l.091-.608a14.996 14.996 0 00-4.137-12.732l-.431-.438.607-.102a14.996 14.996 0 0010.831-7.868l.284-.546.284.546a14.994 14.994 0 0010.831 7.868l.607.102z"></path></svg></span><a href="<?php echo base_url('account/favourite-colleges');?>">Favourite Colleges</a></h6>
                                <span class="text-secondary"></span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap list-group-item-action <?php echo ($review_menu_active==TRUE)?'active':'';?>">
                                <h6 class="mb-0"><span class="jsx-2394613297 icon menu-icon mr-5"><svg height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg" class="jsx-2394613297"><path d="M467 46.003H45c-24.813 0-45 20.187-45 45v240c0 24.813 20.187 45 45 45h142.972l55.547 83.32c5.934 8.901 19.032 8.894 24.962 0l55.547-83.32H467c24.813 0 45-20.187 45-45v-240c0-24.813-20.187-45-45-45zm15 285c0 8.271-6.729 15-15 15H316a15.001 15.001 0 00-12.481 6.68L256 423.961l-47.519-71.278a15.001 15.001 0 00-12.481-6.68H45c-8.271 0-15-6.729-15-15v-240c0-8.271 6.729-15 15-15h422c8.271 0 15 6.729 15 15z"></path><path d="M161.095 182.361l-21.654-3.622-10.136-19.475c-5.599-10.757-21.021-10.74-26.611 0l-10.136 19.475-21.654 3.622c-11.961 2.003-16.71 16.672-8.223 25.31l15.389 15.657-3.246 21.713c-1.793 11.994 10.694 21.045 21.529 15.642L116 250.885l19.647 9.797c10.855 5.41 23.319-3.666 21.529-15.642l-3.246-21.713 15.389-15.657c8.5-8.65 3.72-23.309-8.224-25.309zm-33.805 25.272a15.002 15.002 0 00-4.137 12.732l.091.608-.55-.274a15 15 0 00-13.388 0l-.55.274.091-.608a14.996 14.996 0 00-4.137-12.732l-.431-.438.607-.102a14.996 14.996 0 0010.831-7.868l.284-.546.284.546a14.994 14.994 0 0010.831 7.868l.607.102zM301.095 182.361l-21.654-3.622-10.136-19.475c-5.599-10.757-21.021-10.74-26.611 0l-10.136 19.475-21.654 3.622c-11.961 2.003-16.71 16.672-8.223 25.31l15.389 15.657-3.246 21.713c-1.793 11.994 10.693 21.044 21.529 15.642L256 250.885l19.647 9.797c10.855 5.41 23.319-3.666 21.529-15.642l-3.246-21.713 15.389-15.657a15.001 15.001 0 00-8.224-25.309zm-33.805 25.272a15.002 15.002 0 00-4.137 12.732l.091.608c-2.266-1.13-4.378-1.851-7.244-1.851-2.821 0-4.928.695-7.244 1.851l.091-.608a14.996 14.996 0 00-4.137-12.732l-.431-.438.607-.102a14.996 14.996 0 0010.831-7.868l.284-.546.284.546a14.994 14.994 0 0010.831 7.868l.607.102zM441.095 182.361l-21.654-3.622-10.136-19.475c-5.599-10.757-21.021-10.74-26.611 0l-10.136 19.475-21.654 3.622c-11.961 2.003-16.71 16.672-8.223 25.31l15.389 15.657-3.246 21.713c-1.793 11.995 10.694 21.044 21.529 15.642L396 250.885l19.647 9.797c10.857 5.411 23.317-3.679 21.529-15.642l-3.246-21.713 15.389-15.657c8.5-8.65 3.72-23.309-8.224-25.309zm-33.805 25.272a15.002 15.002 0 00-4.137 12.732l.091.608c-2.266-1.13-4.378-1.851-7.244-1.851-2.821 0-4.928.695-7.244 1.851l.091-.608a14.996 14.996 0 00-4.137-12.732l-.431-.438.607-.102a14.996 14.996 0 0010.831-7.868l.284-.546.284.546a14.994 14.994 0 0010.831 7.868l.607.102z"></path></svg></span><a href="<?php echo base_url('account/my-reviews');?>">Your Review</a></h6>
                                <span class="text-secondary"></span>
                            </li>
                            <!-- <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap list-group-item-action <?php echo (is_controller('User') && is_method('indexAppliedColleges'))?'active':'';?>">
                                <h6 class="mb-0"><span class="jsx-2394613297 icon menu-icon mr-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" class="jsx-2394613297"><path d="M497.36 69.995c-7.532-7.545-19.753-7.558-27.285-.032L238.582 300.845l-83.522-90.713c-7.217-7.834-19.419-8.342-27.266-1.126-7.841 7.217-8.343 19.425-1.126 27.266l97.126 105.481a19.273 19.273 0 0013.784 6.22c.141.006.277.006.412.006a19.317 19.317 0 0013.623-5.628L497.322 97.286c7.551-7.525 7.564-19.746.038-27.291z" data-original="#000000" class="applied_active_svg__active-path" data-old_color="#000000"></path><path d="M492.703 236.703c-10.658 0-19.296 8.638-19.296 19.297 0 119.883-97.524 217.407-217.407 217.407-119.876 0-217.407-97.524-217.407-217.407 0-119.876 97.531-217.407 217.407-217.407 10.658 0 19.297-8.638 19.297-19.296C275.297 8.638 266.658 0 256 0 114.84 0 0 114.84 0 256c0 141.154 114.84 256 256 256 141.154 0 256-114.846 256-256 0-10.658-8.638-19.297-19.297-19.297z" data-original="#000000" class="applied_active_svg__active-path" data-old_color="#000000"></path></svg></span><a href="<?php echo base_url('account/applied-colleges');?>">Applied CAF</a></h6>
                                <span class="text-secondary"></span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap list-group-item-action">
                                <h6 class="mb-0"><span class="jsx-2394613297 icon menu-icon mr-5"><svg xmlns="http://www.w3.org/2000/svg" width="465.2" height="465.2" viewBox="0 0 465.2 465.2" class="jsx-2394613297"><path d="M279.591 423.714a192.461 192.461 0 01-11.629 2.52c-10.148 1.887-16.857 11.647-14.98 21.804a18.651 18.651 0 007.618 11.876 18.64 18.64 0 0014.175 3.099 233.175 233.175 0 0013.854-3.008c10.021-2.494 16.126-12.646 13.626-22.662-2.494-10.025-12.637-16.125-22.664-13.629zM417.887 173.047a18.644 18.644 0 006.97 9.398c4.684 3.299 10.813 4.409 16.662 2.475 9.806-3.256 15.119-13.83 11.875-23.631a232.327 232.327 0 00-4.865-13.314c-3.836-9.59-14.714-14.259-24.309-10.423-9.585 3.834-14.256 14.715-10.417 24.308a194.816 194.816 0 014.084 11.187zM340.36 397.013a195.86 195.86 0 01-10.134 6.261c-8.949 5.162-12.014 16.601-6.854 25.546a18.664 18.664 0 005.416 5.942c5.769 4.059 13.604 4.667 20.127.909a233.049 233.049 0 0012.062-7.452c8.614-5.691 10.985-17.294 5.291-25.912-5.693-8.621-17.291-10.989-25.908-5.294zM465.022 225.279c-.407-10.322-9.101-18.356-19.426-17.953-10.312.407-18.352 9.104-17.947 19.422.155 3.945.195 7.949.104 11.89-.145 6.473 3.021 12.243 7.941 15.711a18.647 18.647 0 0010.345 3.401c10.322.229 18.876-7.958 19.105-18.285.103-4.709.064-9.48-.122-14.186zM414.835 347.816c-8.277-6.21-19.987-4.524-26.186 3.738a195.193 195.193 0 01-7.434 9.298c-6.69 7.86-5.745 19.666 2.115 26.361.448.38.901.729 1.371 1.057 7.814 5.509 18.674 4.243 24.992-3.171a232.358 232.358 0 008.874-11.102c6.2-8.262 4.522-19.98-3.732-26.181zM442.325 280.213c-9.855-3.09-20.35 2.396-23.438 12.251a198.06 198.06 0 01-3.906 11.253c-3.105 8.156-.13 17.13 6.69 21.939a18.635 18.635 0 004.126 2.19c9.649 3.682 20.454-1.159 24.132-10.812a240.351 240.351 0 004.646-13.382c3.085-9.857-2.397-20.349-12.25-23.439zM197.999 426.402a193.1 193.1 0 01-47.968-15.244c-.18-.094-.341-.201-.53-.287a204.256 204.256 0 01-10.63-5.382c-.012-.014-.034-.023-.053-.031a199.491 199.491 0 01-18.606-11.628C32.24 331.86 11.088 209.872 73.062 121.901c13.476-19.122 29.784-35.075 47.965-47.719.224-.156.448-.311.67-.468 64.067-44.144 151.06-47.119 219.089-1.757l-14.611 21.111c-4.062 5.876-1.563 10.158 5.548 9.518l63.467-5.682c7.12-.64 11.378-6.799 9.463-13.675L387.61 21.823c-1.908-6.884-6.793-7.708-10.859-1.833l-14.645 21.161C312.182 7.638 252.303-5.141 192.87 5.165a235.263 235.263 0 00-17.709 3.78c-.045.008-.081.013-.117.021-.225.055-.453.128-.672.189-51.25 13.161-95.965 43.052-127.872 85.7-.269.319-.546.631-.8.978a220.276 220.276 0 00-3.145 4.353 229.217 229.217 0 00-4.938 7.308c-.199.296-.351.597-.525.896C10.762 149.191-1.938 196.361.24 244.383c.005.158-.004.317 0 .479a227.87 227.87 0 001.088 14.129c.027.302.094.588.145.89a230.909 230.909 0 001.998 14.145c8.344 48.138 31.052 91.455 65.079 125.16.079.079.161.165.241.247.028.031.059.047.086.076a235.637 235.637 0 0029.793 24.898c28.02 19.744 59.221 32.795 92.729 38.808 10.167 1.827 19.879-4.941 21.703-15.103 1.823-10.169-4.939-19.889-15.103-21.71z"></path><path d="M221.124 83.198c-8.363 0-15.137 6.78-15.137 15.131v150.747l137.87 71.271a15.042 15.042 0 006.933 1.69c5.476 0 10.765-2.982 13.454-8.185 3.835-7.426.933-16.549-6.493-20.384L236.244 230.65V98.329c-.001-8.351-6.767-15.131-15.12-15.131z"></path></svg></span><a href="<?php echo base_url('account');?>">Pending Application</a></h6>
                                <span class="text-secondary"></span>
                            </li> -->
                            <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap list-group-item-action">
                                <h6 class="mb-0"><span class="jsx-2394613297 icon menu-icon mr-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.996 511.996" class="jsx-2394613297"><path d="M349.85 62.196c-10.797-4.717-23.373.212-28.09 11.009-4.717 10.797.212 23.373 11.009 28.09 69.412 30.324 115.228 98.977 115.228 176.035 0 106.034-85.972 192-192 192-106.042 0-192-85.958-192-192 0-77.041 45.8-145.694 115.192-176.038 10.795-4.72 15.72-17.298 10.999-28.093-4.72-10.795-17.298-15.72-28.093-10.999C77.306 99.275 21.331 183.181 21.331 277.329c0 129.606 105.061 234.667 234.667 234.667 129.592 0 234.667-105.068 234.667-234.667 0-94.17-55.998-178.08-140.815-215.133z"></path><path d="M255.989 234.667c11.782 0 21.333-9.551 21.333-21.333v-192C277.323 9.551 267.771 0 255.989 0c-11.782 0-21.333 9.551-21.333 21.333v192c0 11.782 9.551 21.334 21.333 21.334z"></path></svg></span><a href="<?php echo base_url('logout');?>">Logout</a></h6>
                                
                            </li>
                        </ul>
                    </div>
                </div>
                
            </div>
          
            <div class="col-lg-9 mb-4 mb-lg-0">
                <div class="card userCard" style="margin-bottom:20px;">
                  <div class="card-header bg-white">
                    <div class="col-md-6">
                    <h5 class="m-0 d-inline"><?php echo $userdata->user_fullname;?></h5> <small id="user_type" class="form-text text-muted"><?php echo $userdata->user_email;?></small>
                    </div>
                    <div class="col-md-6">
                        <span><?php echo $page_name;?></span>
                    </div>
                  </div>

                  <div class="card-body">
                    <?php
                    if($show_profile_widget==TRUE){
                        ?>
                        <section id="tabs" class="project-tab">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-12" style="padding-left:5px;padding-right:5px;">
                                        <nav>
                                            <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                                <a class="nav-item nav-link active" id="nav-basic_details-tab" data-toggle="tab" href="#nav-basic_details" role="tab" aria-controls="nav-basic_details" aria-selected="true">Profile</a>
                                                <a class="nav-item nav-link" id="nav-high_school-tab" data-toggle="tab" href="#nav-high_school" role="tab" aria-controls="nav-high_school" aria-selected="false">High School</a>
                                                <a class="nav-item nav-link" id="nav-higher_education-tab" data-toggle="tab" href="#nav-higher_education" role="tab" aria-controls="nav-higher_education" aria-selected="false">Higher Education</a>
                                                <a class="nav-item nav-link" id="nav-prof_exp-tab" data-toggle="tab" href="#nav-prof_exp" role="tab" aria-controls="nav-prof_exp" aria-selected="false">Professional Experience</a>
                                            </div>
                                        </nav>
                                        <div class="tab-content" id="nav-tabContent">
                                            <div class="tab-pane fade show active" id="nav-basic_details" role="tabpanel" aria-labelledby="nav-basic_details-tab">
                                               <?php $this->widget->run('front_student_basic_details_section',TRUE);?>
                                            </div>
                                            <div class="tab-pane fade" id="nav-high_school" role="tabpanel" aria-labelledby="nav-high_school-tab">
                                                <?php $this->widget->run('front_student_high_school_details_section',TRUE);?>
                                            </div>
                                            <div class="tab-pane fade" id="nav-higher_education" role="tabpanel" aria-labelledby="nav-higher_education-tab">
                                                <?php $this->widget->run('front_student_higher_education_details_section',TRUE);?>
                                            </div>
                                            <div class="tab-pane fade" id="nav-prof_exp" role="tabpanel" aria-labelledby="nav-prof_exp-tab">
                                                <?php $this->widget->run('front_student_prof_exp_details_section',TRUE,$userdata->user_id);?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <?php
                    }

                    $this->widget->run('front_student_fvourite_collehges_section',$show_favourite_colleges_widget,$userdata->user_id,FALSE);

                    $this->widget->run('front_student_applied_colleges_section',$show_applied_colleges_widget,$userdata->user_id,TRUE);
                    $this->widget->run('front_student_reviews_section',$show_reviews_widget,$userdata->user_id,TRUE);
                    ?>
                        
                  </div>
                </div>
                <?php 
                if($show_profile_widget==TRUE){
                    $this->widget->run('front_student_settings_edit_section',TRUE);
                }
                
                ?>
            </div>
            <!-- <div class="col-lg-3 mb-3 mb-lg-0">
                
            </div> -->
        </div>
    </div> 
</section>

<?php $this->widget->run('front_subscription_section',true);?>


<style type="text/css">
    .menu-icon.jsx-2394613297 svg.jsx-2394613297 {
        height: 16px;
        width: 16px;
        vertical-align: text-top;
        fill: #696969;
        -webkit-filter: grayscale(1);
        filter: grayscale(1);
    }

    .icon {
        display: inline-block;
        line-height: initial;
        height: 15px;
        width: 15px;
    }

    .mr-5, .mx-5 {
        margin-right: 1.25rem;
    }

    .list-group-item.active {
        z-index: 2;
        color: #ed6f15;
        background-color: #ffffff;
        border-color: #ed6f15;
    }

    .list-group-item.active .icon svg{
        color: #ed6f15;
    }

    .list-group-item.active a{
        color: #ed6f15;
    }

    .project-tab {
        padding: 0%;
        margin-top: 1%;
        border: none;
    }
    .project-tab #tabs{
        background: #007b5e;
        color: #eee;
    }
    .project-tab #tabs h6.section-title{
        color: #eee;
    }
    .project-tab #tabs .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
        color: #0062cc;
        background-color: transparent;
        border-color: transparent transparent #f3f3f3;
        border-bottom: 3px solid !important;
        font-size: 16px;
        font-weight: bold;
    }
    .project-tab .nav-link {
        border: 1px solid transparent;
        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;
        color: #0062cc;
        font-size: 16px;
        font-weight: 600;
    }
    .project-tab .nav-link:hover {
        border: none;
    }
    .project-tab thead{
        background: #f3f3f3;
        color: #333;
    }
    .project-tab a{
        text-decoration: none;
        color: #333;
        font-weight: 600;
    }
</style>
<script type="text/javascript">var wbpage='';</script>

<!--https://codepen.io/chiraggoyal777/pen/xxEowxq-->

<script type="text/javascript">
	// $(document).on("change", ".uploadProfileInput", function () {
 //    var triggerInput = this;
 //    var currentImg = $(this).closest(".pic-holder").find(".pic").attr("src");
 //    var holder = $(this).closest(".pic-holder");
 //    var wrapper = $(this).closest(".profile-pic-wrapper");
 //    $(wrapper).find('[role="alert"]').remove();
 //    var files = !!this.files ? this.files : [];
 //    if (!files.length || !window.FileReader) {
 //      return;
 //    }
 //    if (/^image/.test(files[0].type)) {
 //      // only image file
 //      var reader = new FileReader(); // instance of the FileReader
 //      reader.readAsDataURL(files[0]); // read the local file

 //      reader.onloadend = function () {
 //        $(holder).addClass("uploadInProgress");
 //        $(holder).find(".pic").attr("src", this.result);
 //        $(holder).append(
 //          '<div class="upload-loader"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>'
 //        );

 //        // Dummy timeout; call API or AJAX below
 //        setTimeout(() => {
 //          $(holder).removeClass("uploadInProgress");
 //          $(holder).find(".upload-loader").remove();
 //          // If upload successful
 //          if (Math.random() < 0.9) {
 //            $(wrapper).append(
 //              '<div class="snackbar show" role="alert"><i class="fa fa-check-circle text-success"></i> Profile image updated successfully</div>'
 //            );

 //            // Clear input after upload
 //            $(triggerInput).val("");

 //            setTimeout(() => {
 //              $(wrapper).find('[role="alert"]').remove();
 //            }, 3000);
 //          } else {
 //            $(holder).find(".pic").attr("src", currentImg);
 //            $(wrapper).append(
 //              '<div class="snackbar show" role="alert"><i class="fa fa-times-circle text-danger"></i> There is an error while uploading! Please try again later.</div>'
 //            );

 //            // Clear input after upload
 //            $(triggerInput).val("");
 //            setTimeout(() => {
 //              $(wrapper).find('[role="alert"]').remove();
 //            }, 3000);
 //          }
 //        }, 1500);
 //      };
 //    } else {
 //      $(wrapper).append(
 //        '<div class="alert alert-danger d-inline-block p-2 small" role="alert">Please choose the valid image.</div>'
 //      );
 //      setTimeout(() => {
 //        $(wrapper).find('role="alert"').remove();
 //      }, 3000);
 //    }
 //  });

</script>


<style type="text/css">
	.profile-pic-wrapper {
  /*height: 100vh;*/
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pic-holder {
  text-align: center;
  position: relative;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.pic-holder .pic {
  height: 100%;
  width: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
}

.pic-holder .upload-file-block,
.pic-holder .upload-loader {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(90, 92, 105, 0.7);
  color: #f8f9fc;
  font-size: 12px;
  font-weight: 600;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.pic-holder .upload-file-block {
  cursor: pointer;
}

.pic-holder:hover .upload-file-block {
  opacity: 1;
}

.pic-holder.uploadInProgress .upload-file-block {
  display: none;
}

.pic-holder.uploadInProgress .upload-loader {
  opacity: 1;
}

/* Snackbar css */
.snackbar {
  visibility: hidden;
  min-width: 250px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  font-size: 14px;
  transform: translateX(-50%);
}

.snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}

</style>
