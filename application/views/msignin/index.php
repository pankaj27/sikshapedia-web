<!DOCTYPE html>
<html lang="en">
  <head>
      ADS
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script
      src="https://kit.fontawesome.com/64d58efce2.js"
      crossorigin="anonymous"
    ></script>
    <link rel="stylesheet" href="<?php echo base_url();  ?>public/msignin/style.css" />
    <title>Sign In: Waytoadmissions</title>
  </head>
  <body>
    <div class="container">
      <div class="forms-container">
        <div class="signin-signup">
            
          <form action="#" class="sign-in-form">
              <div class="social-media">
              
              <img src ="https://www.waytoadmissions.com/public/data/app/2021/RToXI5Hjmg.webp" style="width:80%;">
            </div>
            <br>
            <br>
              
            <h2 class="title">Sign in</h2>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" placeholder="Username" required="required" />
               <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input type="password" placeholder="Password" required="required" />
            </div>
            <input type="submit" value="Login" class="btn solid" />
            <p class="social-text">Signin with your credentials </p>
            
          </form>
          <form action="#" class="sign-up-form">
              <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">
              
              <div class="social-media">
                
                <img src ="https://www.waytoadmissions.com/public/data/app/2021/RToXI5Hjmg.webp" style="width:80%;">
                
              
            </div>
              
            <h2 class="title">Sign up</h2>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" placeholder="Username" required="required" />
            </div>
            <div class="input-field">
              <i class="fas fa-envelope"></i>
              <input type="email" placeholder="Email" required="required" />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input type="password" placeholder="Password" required="required" />
            </div>
            <input type="submit" class="btn" value="Sign up" />
            <p class="social-text">New here? Please sign up to continue</p>
            
          </form>
        </div>
      </div>

      <div class="panels-container">
        <div class="panel left-panel">
          <div class="content">
            <h3>New here ?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button class="btn transparent" id="sign-up-btn">
              Sign up
            </button>
          </div>
          <img src="<?php echo base_url();  ?>public/msignin/img/log.svg" class="image" alt="" />
        </div>
        <div class="panel right-panel">
          <div class="content">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button class="btn transparent" id="sign-in-btn">
              Sign in
            </button>
          </div>
          <img src="<?php echo base_url();  ?>public/msignin/img/register.svg" class="image" alt="" />
        </div>
      </div>
    </div>

    <script src="<?php echo base_url();  ?>public/msignin/app.js"></script>
  </body>
</html>
