$(function(){
$('.selectpicker').selectpicker();

});	
$(window).on('load resize', function() {
  if ($(window).width() < 767) {
    $(".banner .btn").text("открыть счет");
  }
  if ($(window).width() < 767) {
    $(".footer .navbar .btn").text("Стать агентом");
  }
});