SAMPLE_SETLIST ="/setlists/1001";

$(document).ready(function(){
    $.ajax({
        url: SAMPLE_SETLIST
    }).then(function(data) {
    	 console.log(data);
       populateSetlist(data.result);
    });
});

function populateSetlist(data){

  setlist = data.setlist;
  notes = data.notes;
  count = 0;

  $('#setlist-date-long').append(data.dateLong);
  $('#setlist-location').append(data.location);
  $('#setlist-notes').append(notes);


  console.log('number of sets ' + setlist.length);
  $setlistContainer = $('#setlist-container');
  for(var i = 0;i<setlist.length;i++){
    setArray = setlist[i];
    console.log('number of items in set ' + setArray.length);
    for(var j = 0; j<setArray.length; j++){
      setObj = setArray[j];
      if(setObj["type"] == "identifier"){
        console.log('identifier : ' + setObj["name"]);
        $setlistContainer.append(setObj["name"] + ": ");
      }else if (!setObj["type"]){
        //var link = $('<a>', {href: "stats.html/" + setObj["song"]["id"]});
        // console.log("song " + setObj["song"]["name"]);
        // $setlistContainer.append(link);
        $setlistContainer.append("<span class='song-link' song-id ='" + setObj["song"]["id"] + "'>" +  setObj["song"]["name"] + "</div>");
      } else{
        if(setObj["type"] == ">"){
          $setlistContainer.append(" " + setObj["type"] + " ");
        }
        if(setObj["type"] == ","){
          $setlistContainer.append(setObj["type"] + " ");
        }
      }
    }
    $setlistContainer.append("<br><br>");
  }

  $('.song-link').click(function(){
    songId = $(this).attr("song-id");
    $('#song-title').text($(this).text());

    $.ajax({
        url: "/songs/" + songId
    }).then(function(res) {
       populateSong(res.result);
    });
  });
}


function populateSong(song){
  if(song == null){
    $("#song-container").hide();
    $("#no-song-info").show();
  }else{
    $("#no-song-info").hide();
    $("#song-container").show();
  }
}