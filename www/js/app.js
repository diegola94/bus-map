// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bus-map', ['ionic'])

.factory('BusStopJson', function() {
    return {
        busStopList : (function() {
                    var json = null;
                    $.ajax({
                        async: false,
                        global: false,
                        url: "js/data/points.json",
                        dataType: "json",
                        success: function (data) {
                            json = data;
                        }
                    });
                    return json;
                })()
    };
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'MapController'
        }
      }
    })
    .state('tabs.bus-stop', {
      url: "/bus-stop",
      views: {
        'bus-stop-tab': {
          templateUrl: "templates/bus-stop.html",
          controller: 'BusStopController'
        }
      }
    });

   $urlRouterProvider.otherwise("/tab/home");

})

.controller('MapController', function($scope, $ionicLoading, $http, BusStopJson) {                  
      google.maps.event.addDomListener(window, 'load', function() {
            var myLatlng = new google.maps.LatLng(-23.9343084, -46.3302259);                 

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP,         
                mapTypeControl: false,
                styles: [{
                  featureType: "transit.station.bus",
                  stylers: [
                    { visibility: "off" }
                  ]
                }]
            };
            
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;                 
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
     
            directionsDisplay.setMap(map);

            navigator.geolocation.getCurrentPosition(function(pos) {
                map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                var myLocation = new google.maps.Marker({
                    position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                    map: map,                
                    title: "Você",
                    icon: 'img/icon-you-here.png'
                });
            });

            var allInfoWindows = [];                          
     
            $.each( BusStopJson.busStopList, function() {                
                  var myLatlng = new google.maps.LatLng(this.COORDINATEY, this.COORDINATEX);

                  var linhas = "";

                  $.each( this.LINHAS, function() {
                        linhas += this.LINHA + ", ";
                  })  
                  linhas = linhas.substring(0, linhas.length - 2);

                  var contentString = 
                        '<div>'+                      
                          '<h4>Ponto de Onibus</h4>'+
                          '<div id="bodyContent">'+
                              'Endereço: ' + this.ADDRESS + 
                              '<br /> Linhas que passam neste ponto: ' + linhas +                            
                          '</div>'+
                        '</div>';
                                    
                  var infowindow = new google.maps.InfoWindow({
                        content: contentString
                  });

                  allInfoWindows.push(infowindow);

                  var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        icon: 'img/icon-bus-stop.png'
                  });                              

                  marker.addListener('click', function() {                  
                    for (var i=0;i<allInfoWindows.length;i++) {
                        allInfoWindows[i].close();
                    }
                    infowindow.open(map, marker);
                  });              
            });                                           

            $scope.map = map;
            // Teste            
            var originAddress = (document.getElementById('txtOrigin'));            ;
            var destinationAddress = (document.getElementById('txtDestination'));

            var originAutocomplete = new google.maps.places.Autocomplete(originAddress);
            originAutocomplete.bindTo('bounds', map);

            var destinationAutocomplete = new google.maps.places.Autocomplete(destinationAddress);
            destinationAutocomplete.bindTo('bounds', map);

            $( "#calcRouteForm" ).submit(function( event ) {                  
                  directionsService.route({
                        origin: document.getElementById('txtOrigin').value,
                        destination: document.getElementById('txtDestination').value,
                        travelMode: google.maps.TravelMode.DRIVING,
                        transitOptions: {
                          departureTime: new Date(1337675679473),
                          modes: [google.maps.TransitMode.BUS],
                          routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
                        }
                      }, 
                      function(response, status) {
                            if (status === google.maps.DirectionsStatus.OK) {
                                directionsDisplay.setDirections(response);
                            } else {
                                window.alert('Directions request failed due to ' + status);
                            }
                  });            
                  event.preventDefault();
            });

            /*var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
              map: map,
              anchorPoint: new google.maps.Point(0, -29)
            });

            autocomplete.addListener('place_changed', function() {
                  infowindow.close();
                  marker.setVisible(false);
                  var place = autocomplete.getPlace();
                  if (!place.geometry) {
                    window.alert("Autocomplete's returned place contains no geometry");
                    return;
                  }

                  // If the place has a geometry, then present it on a map.
                  if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                  } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);  // Why 17? Because it looks good.
                  }
                  marker.setIcon(({
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(35, 35)
                  }));
                  marker.setPosition(place.geometry.location);
                  marker.setVisible(true);

                  var address = '';
                  if (place.address_components) {
                    address = [
                      (place.address_components[0] && place.address_components[0].short_name || ''),
                      (place.address_components[1] && place.address_components[1].short_name || ''),
                      (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                  }

                  infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
                  infowindow.open(map, marker);
            });*/
            //Fim teste
      });               
})

.controller('BusStopController', function($scope, $ionicLoading, $http, BusStopJson) {    
      $scope.BusStopList = BusStopJson.busStopList;      
});