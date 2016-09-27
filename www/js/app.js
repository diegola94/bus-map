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
     
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
     
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
      });         
})

.controller('BusStopController', function($scope, $ionicLoading, $http, BusStopJson) {    
      $scope.BusStopList = BusStopJson.busStopList;      
});