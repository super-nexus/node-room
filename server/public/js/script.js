$(function(){

  console.log('script running');

  $.post('/setupPage').done(function(objectArray){

    var htmlString = '';
    var counter = 0;
    for(var i = 0; i < objectArray.length; i++){

        if(counter == 0){
          htmlString+= '<div class="row my-row">'
        }

        counter++;

        htmlString+= '<a href="#" class="node col-md-3" data-pannel="' + objectArray[i].mac_address + '"><div class="nodeWrapper">' +
        '<img class="img-responsive" src="./images/nodeDevKit.jpg" />' +
        '<div class="nodeName"><span class="nodeNameText">' + objectArray[i].name + '</span></div></div></a>'

        if(counter == 4){
          htmlString+= '</div>';
          counter = 0;
        }

    }

    $('.nodes').html(htmlString);

  })


})
