
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 6
    });
    // var infoWindow = new google.maps.InfoWindow({map: map});

    var marker = new google.maps.Marker({
		position: map.center,
		map: map
    });

    map.addListener('click', function(e) {
    	

      //inhide info box
      var info = document.getElementById('info-box');
      info.className += " active";

      //get all info
      var name;
	    var lat = e.latLng.lat();
	    var lng = e.latLng.lng();

      //reset map to marker
      placeMarkerAndPanTo(e.latLng, map);

      var submit = document.getElementById('submit');
      submit.addEventListener("click", function() { 
        name = document.getElementById('name').value;

        console.log("Name: " + name + ", Lat: " + lat + ", Long: " + lng);
      }, false);

      //prepare mocky info
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', "//www.mocky.io/v2/5185415ba171ea3a00704eed", true);
      xhr.send();

      xhr.addEventListener("readystatechange", processRequest, false);

      function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // time to partay!!!
        }
      }

	}, false);



  // Try HTML5 geolocation.
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(function(position) {
  //       var pos = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       };

  //       infoWindow.setPosition(pos);
  //       infoWindow.setContent('Location found.');
  //       map.setCenter(pos);
  //     }, function() {
  //       handleLocationError(true, infoWindow, map.getCenter());
  //     });
  //   } else {
  //     // Browser doesn't support Geolocation
  //     handleLocationError(false, infoWindow, map.getCenter());
  //   }
  // }

  // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent(browserHasGeolocation ?
  //                         'Error: The Geolocation service failed.' :
  //                         'Error: Your browser doesn\'t support geolocation.');
 }

function placeMarkerAndPanTo(latLng, map) {
	var marker = new google.maps.Marker({
		position: latLng,
		map: map
	});
map.panTo(latLng);
}

