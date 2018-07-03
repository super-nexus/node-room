$(function(){

  console.log('script running');

  $.post('/setupPage').done(function(recievedStirng){

    $('.nodes').html(recievedStirng);

  })


})
