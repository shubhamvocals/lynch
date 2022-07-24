$(document).ready(function()
{
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

$(window).on("load",function(){
    $(".loader-wrapper").fadeOut("slow");
});