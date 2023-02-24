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

  // metadata
  $('#setlist-title').append(data.title);
  $('#setlist-date-long').append(data.dateLong);
  $('#setlist-location').append(", " + data.location);
  $('#setlist-notes').append(notes);

  // audio 
  if(data.nugsLink != null){
    $('#nugs-link').append("<a href='" + "http://www.nugs.com" + "'>NUGS");
  }else{
    $('#nugs-link').append("<a href='" + "http://www.nugs.com" + "'>NUGS");
  }

  if(data.archiveLink != null){
    $('#archive-link').append("<a href='" + "http://www.archive.org" + "'>ARCHIVE");
  }else{
    $('#archive-link').append("<a href='" + "http://www.archive.org" + "'>ARCHIVE");
  }


  console.log('number of sets ' + setlist.length);
  $setlistContainer = $('#setlist-container');
  for(var i = 0;i<setlist.length;i++){
    setArray = setlist[i];
    console.log('number of items in set ' + setArray.length);
    for(var j = 0; j<setArray.length; j++){
      setObj = setArray[j];
      if (!setObj["identifier"]){ // song link
       // console.log('song: ' + setObj["song"]["name"]);
        if(setObj["song"]["note"] != null){ 
          $setlistContainer.append("<span class='song-link' song-id ='" + setObj["song"]["id"] + "'>" +  setObj["song"]["name"] + "<sup>" + setObj["song"]["note"] + "</sup></div>");
        }else{
          $setlistContainer.append("<span class='song-link' song-id ='" + setObj["song"]["id"] + "'>" +  setObj["song"]["name"] + "</div>");
        }
      } else{
        if(setObj["identifier"].includes("Set")){
          $setlistContainer.append(setObj["identifier"] + ": ");
        }else if(setObj["identifier"] == ">"){
          $setlistContainer.append("<span class='song-separator'> " + setObj["identifier"] + " </span>");
        } else if(setObj["identifier"] == ","){
          $setlistContainer.append("<span class='song-separator'>" + setObj["identifier"] + " </span>");
        }
      }
    }
    $setlistContainer.append("<br>");
  }

  $('.song-link').click(function(){
    songId = $(this).attr("song-id");
    $('#song-title').text($(this).html());

    $.ajax({
        url: "/songs/" + songId
    }).then(function(res) {
       populateSong(res.result);
    });
  });
}


function populateSong(song){
  if(song == null){
    $("#song-metadata-container").hide();
    $("#no-song-info").show();
  }else{
    $('#song-title').text(song.name);
    $("#song-metadata-container").show();
    $("#no-song-info").hide();

    $("#song-info-author").text(song.author);
    $("#song-info-ltp").text(song.ltp);
    $("#song-info-play-count").text(song.playCount);

    $("#song-info-ltp").text(song.ltp);

    $("#song-info-average-gap").text("6 shows");
  }

  // function calculateAverageGap(count, start){
   
  // }

}