
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 6
    });
    var infoWindow = new google.maps.InfoWindow({map: map});

    var marker = new google.maps.Marker({
		position: map.center,
		map: map
    });

    map.addListener('click', function(e) {
    	//get all info
    	getAllInfo(e);

	    // var lat = e.latLng.lat();
	    // var lng = e.latLng.lng();
	    // console.log("Lat: " + lat + ", Long: " + lng);
	});

	function getAllInfo(e) {
		//pop up info box
		//get name
		placeMarkerAndPanTo(e.latLng, map);
	}



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

