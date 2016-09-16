// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var exampleApp = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


exampleApp.controller('MapController', function($scope, $ionicLoading, $http) {
 
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
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,                
                title: "Você está aqui"
            });
        });

        $.getJSON( "js/data/points.json", function( data ) {                                                
            $.each( data, function() {
                $(".bus-stop").append( "<li>" + this.ADDRESS + "</li>");

                var myLatlng = new google.maps.LatLng(this.COORDINATEY, this.COORDINATEX);
                
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: 'img/icon-bus-stop.png'
                });                              

            });                   
        });              
 
        $scope.map = map;
    });
 
    $.getJSON( "js/data/points.json", function( data ) {                                                
        $.each( data, function() {
            $(".bus-stop").append( "<li>" + this.ADDRESS + "</li>");
        });                   
    });              
});
