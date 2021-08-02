jQuery(function ($) {

    $(".sidebar-dropdown > a").click(function (e) {
        e.preventDefault();
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
                .parent()
                .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });

    $("#close-sidebar").click(function (e) {
        e.preventDefault();
        $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function (e) {
        e.preventDefault();
        $(".page-wrapper").addClass("toggled");
    });





});

function myFunction(x) {
    if (x.matches) { // If media query matches
        document.getElementById('siteName').textContent = "CRMS";
        $(".page-wrapper").removeClass("toggled");
        $('.container-fluid > div').removeClass("container");
    }
    else {
        document.getElementById('siteName').textContent = "Criminal Record Management System";
        $(".page-wrapper").addClass("toggled");
        $('.container-fluid > div').addClass("container");
    }
}

var x = window.matchMedia("(max-width: 768px)")
myFunction(x) // Call listener function at run time
x.addListener(myFunction) // Attach listener function on state changes