$("#home").html("hi buddy");
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction()
};
var ih = window.innerHeight - 200;

function scrollFunction() {
  if (document.body.scrollTop > ih || document.documentElement.scrollTop > ih) {
    // document.getElementById("toggle-menu").style.color = "#b11111";
    // $("#toTop").removeClass("d-none");
    document.getElementById("toTop").style.display = "block";
  } else {
    // document.getElementById("toggle-menu").style.color = "#fff";
    // $("#toTop").addClass(" d-none");
    document.getElementById("toTop").style.display = "none";
  }
}

$("#toTop").click(function() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

