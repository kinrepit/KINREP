function id(element) {
	return document.getElementById(element);
}
 
document.addEventListener("deviceready", onDeviceReady, false);
 
function onDeviceReady() {
	navigator.splashscreen.hide();
//            var options = { timeout: 300000 }; // Track Geo Location for every 5 Min.
        var options = {
                enableHighAccuracy: true,
                timeout: 10000
            };
        var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
}


	function onSuccess(position) {
	    // Successfully retrieved the geolocation information. Display it all.
        //var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //localStorage.setItem("latlng", latlng);
        //localStorage.setItem("fos_lat", position.coords.latitude);
        //localStorage.setItem("fos_lng", position.coords.longitude);
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var geocoder = geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                localStorage.setItem("geoloc", results[1].formatted_address);
                $.get('https://www.kinrep.com/foster/ws/virtualroomservice.asmx/logFOS', { foscode: localStorage.getItem("FOSCode"), lat: position.coords.latitude, lng: position.coords.longitude })
                 .error(function() { localStorage.setItem("errinfo", "App failed to geocode. Please report this error."); });
            }
          }
        });
        
        
        
	    /*for (key in position.coords) {
	        document.getElementById(key).innerText = position.coords[key];
	    }
        document.getElementById("timestamp").innerText = new Date(position.timestamp).toLocaleTimeString().split(" ")[0];

        this._setStatus();
        document.getElementById("results").classList.remove("hidden");*/
	}
    
	function onError(error) {
		/*this._setStatus('code: ' + error.code + '<br/>' +
						 'message: ' + error.message + '<br/>');

		document.getElementById("results").classList.add("hidden");*/
	}


 
