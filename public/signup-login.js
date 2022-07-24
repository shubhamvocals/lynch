$(window).on("load",function(){
    $(".loader-wrapper").fadeOut("slow");
});
  
$(document).ready(function(){ 

    $(".signup-heading").text("Best Of Cloud Gaming");          // for signup page
    setTimeout(function(){
    $(".signup-heading").text("Just a Step Away!");
    },8000);

    $(".login-heading").text("Login to Play");          // for login page
    setTimeout(function(){
    $(".login-heading").text("Enjoy!");
    },8000);
});

$(".modal").ready(function(){
    $(".mail-image").hover(
        function()
        {
            $(this).attr("src", "images/mail.gif");
        },
        function()
        {
            $(this).attr("src", "images/mail.png");
        });
});

$("textarea").each(function () {
    this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
  }).on("input", function () {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
});