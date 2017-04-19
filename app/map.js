var map;
var markersAll = [];
var infowindowsAll = [];
var mapClick;
var bounds;

function initMap() {
  bounds = new google.maps.LatLngBounds();

  map = new google.maps.Map(document.getElementById('map'), {});
  console.log(map);
  setupMap();
}

function closeInput() {
  var input = document.querySelector('#info-box');
  input.className = "info-box";
  mapClick = map.addListener('click', showInputBox, false);
}

function showInputBox() {
  //remove ability to click map when info box is open
  google.maps.event.removeListener(mapClick);
  //inhide info box
  var info = document.getElementById('info-box');
  info.className = "info-box active";

  var infoName = document.getElementById("name");

  //clear input when opened
  infoName.value = "";
  //focus input on opening
  infoName.focus();

  var submit = document.getElementById('submit');

  submit.addEventListener("click", function() { 
    var name = document.getElementById('name').value;
    info.className = "info-box";

    //prepare mocky info
    var request = new XMLHttpRequest();

    request.open('POST', 'https://private-979a5-test11968.apiary-mock.com/markers');

    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
      var content;
      if (this.readyState === 4) {
        // console.log('Status:', this.status);
        // console.log('Headers:', this.getAllResponseHeaders());
        // console.log('Body:', this.responseText);

        var json = JSON.parse(this.response);

        //attach info to a marker
        var content = setInfo(json);
        // console.log(content);
      
        //reset map to marker
        var marker = placeMarker(content.coords, map, content.info);
        //pan to the new marker
        map.panTo(content.coords);
        mapClick = map.addListener('click', showInputBox, false);
      }
    };

    var body = {
      'submitted_by': 'Erika Carrington',
      'lat': 32.934292,
      'lng': -97.078065,
      'note': 'This is the city I live in.'
    };

    request.send(JSON.stringify(body));
  }, false);

  var exit = document.querySelector('#exit');
  exit.addEventListener('click', closeInput, false);
}

function setupMap() {
  // console.log("setupMap is working");
  // var bounds = new google.maps.LatLngBounds();

  //get all markers from Apiary
  var request = new XMLHttpRequest();
  request.open('GET', 'https://private-979a5-test11968.apiary-mock.com/markers');

  request.onreadystatechange = function () {
    // console.log("get apiary-mock");
    if (this.readyState === 4) {
      // console.log('Status:', this.status);
      // console.log('Headers:', this.getAllResponseHeaders());
      // console.log('Body:', this.responseText);

      var json = JSON.parse(this.response);

        //if array is defined and has at least one element
      if(typeof json !== 'undefined' && json.length > 0) {
        for(var i = 0; i < json.length; i++) {

          var content = setInfo(json[i]);
          // console.log(content);
          //map to marker
          var marker = placeMarker(content.coords, map, content.info);
          // console.log(marker);
          bounds.extend(marker.position); //each marker
          // console.log(bounds);
        }
      }
      map.fitBounds(bounds); //auto-zoom
      map.panToBounds(bounds); //auto-center
    }
  };

  request.send();  
  //show all markers  

  mapClick = map.addListener('click', showInputBox, false);
}

function setInfo(response) {

  var json = response;
  var latLng = {lat: json.lat, lng: json.lng}
  var note = json.note;

  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">' + json.submitted_by + '</h1>'+
      '<div id="bodyContent">'+
      '<p>' + note + '</p>'+
      '</div>'+
      '</div>';

  var markerInfo = { coords: latLng, info: contentString };

  return markerInfo;
}

function placeMarker(latLng, map, contentString) {
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });

  //add to global array
  markersAll.push(marker);
  infowindowsAll.push(infowindow);

  //add event listener to every marker
  markerClickListener = google.maps.event.addListener(marker, 'click', infoWindowHandler);

  function infoWindowHandler() {
    var input = document.getElementById('info-box');
  
    //per status of each marker
    if(!marker.open){
        infowindow.open(map, marker);
        marker.open = true;
        //close dialogue box
        input.className = "info-box";
    }
    else {
        infowindow.close();
        marker.open = false;
    }
    //per status of all markers
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
        marker.open = false;
        showInputBox();
    });
  }

  return marker;
}