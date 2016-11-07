// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic',"firebase"])


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
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
])

.config(function ($stateProvider, $urlRouterProvider) {    
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // State to represent Login View
    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "Login"       
    })


    // setup an abstract state for the tabs directive
    .state('signup', {
        url: "/signup",
        templateUrl: "templates/signup.html",
        controller: "Signup"
       
    })

    // Each tab has its own nav history stack:

    .state('db_connect', {
        url: '/db_connect',
        templateUrl: "templates/db_connect.html",
        controller: "DB_connect"
    })

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
    })

    .state('tabs.lines', {
      url: "/lines",
      views: {
        'lines-tab': {
          templateUrl: "templates/lines.html",
          controller: 'LinesController'
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

})

.controller("DB_connect",  ["$scope", "Auth",'$state',
  function($scope, Auth,$state) {

    	$scope.submit_db = function() {
    			$refpath = $scope.dbForm.ref.$modelValue;
    			$data1 = $scope.dbForm.data1.$modelValue;
    			$data2 = $scope.dbForm.data2.$modelValue;
    			$data3 = $scope.dbForm.data3.$modelValue;
    			
    		//write data to db with current user
    		firebase.database().ref($refpath).set({
    			data1: $data1,
    			data2: $data2,
    			data3 : $data3
    		}).then(function() {
             alert("Data submitted");
            })
    		.catch(function(error) {
    		    
    			alert(error.message);
            });
    	}	
  		
      //go to first tab
  		$scope.signup = function() {
  		   $state.go('signup');
  		}
  		
      //go to db tab
  		$scope.login = function() {
  		   $state.go('login');
  		}		
}])
	
	
.controller("Login",  ["$scope", "Auth",'$state',
  function($scope, Auth,$state) {

    	//go to first tab
    	$scope.signup = function() {
           $state.go('signup');
    	}
    	//go to db tab
    	$scope.db_connect = function() {
           $state.go('db_connect');
    	}
    	$scope.signout = function() {
         firebase.auth().signOut().then(function() {
             alert("Signed out successfully");
            })
    		.catch(function(error) {      		    
    			alert(error.message);
        });
      }
    	
      $scope.getuser = function() {
         
    	    //get current user if signed in
          var user = firebase.auth().currentUser;

    			if (user) {
    			  //show user id on screen if signed in
    				$scope.user = {
    				id: 'User ID: ' + user.uid};
    			} else {
    			  $scope.user = {
    				id: 'no user signed in'};
    			}      			 
    	
      }
    	
      $scope.login = function() {
             
        	$signin_email = $scope.userloginForm.email.$modelValue;
        	$signin_password = $scope.userloginForm.password.$modelValue;
        		
          
          if ($signin_email === undefined || $signin_email === "" || $signin_email === null) {
            alert("Email inválido.");
          } 
          else if ($signin_password === undefined || $signin_password === "" || $signin_password === null) {
            alert("Preecha o campo senha.");
          } else {
            	// sign in
              Auth.$signInWithEmailAndPassword($signin_email, $signin_password)
                  .then(function(firebaseUser) {
                      //$scope.message = "User created with uid: " + firebaseUser.uid;            
          		        alert(firebaseUser.email + " logged in successfully!");
                      $state.go('tabs.home');
                  }).catch(function(error) {		    
          			      alert(error.message);
                      //$scope.error = error;
              });
          }      
      }	       
}])
  
.controller("Signup",  ["$scope", "Auth",'$state',
  function($scope, Auth,$state) {	
    	$scope.login = function(){
    	     $state.go('login');
    	}
    	//go to db tab
    	 $scope.db_connect = function() {
           $state.go('db_connect');
    	}
  	
      $scope.createUser = function() {
        $scope.message = null;
        $scope.error = null;
  	  
    	  //get users email and password from ui
    		$email_str = $scope.userForm.email.$modelValue;
    		$password_str = $scope.userForm.password.$modelValue;
     
        if ($email_str === undefined || $email_str === "" || $email_str === null) {
          alert("Email inválido.");
        } 
        else if ($password_str === undefined || $password_str === "" || $password_str === null) {
          alert("Preecha o campo senha.");
        } else {
          // Create a new user
          Auth.$createUserWithEmailAndPassword($email_str, $password_str)
            .then(function(firebaseUser) {
              $scope.message = "User created with uid: " + firebaseUser.uid;
            }).catch(function(error) {
              alert(error.message);
              $scope.error = error;
            });
        }
      };

      $scope.deleteUser = function() {
        $scope.message = null;
        $scope.error = null;

        // Delete the currently signed-in user
        Auth.$deleteUser().then(function() {
          $scope.message = "User deleted";
        }).catch(function(error) {
          $scope.error = error;
        });
      };
    }
])

.controller('MapController',  ["$scope", '$ionicLoading', '$http', "BusStopJson", 
  function($scope, $ionicLoading, $http, BusStopJson) {                  
      
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
  }
])

.controller('BusStopController', ["$scope", '$ionicLoading', '$http', "BusStopJson", 
  function($scope, $ionicLoading, $http, BusStopJson) {    
      $scope.BusStopList = BusStopJson.busStopList;    
  }
])

.controller('LinesController', ["$scope", '$ionicLoading', '$http', "BusStopJson", 
  function($scope, $ionicLoading, $http, BusStopJson) {    
      $scope.BusStopList = BusStopJson.busStopList;    

      $scope.Linhas = [];

      $.each(BusStopJson.busStopList, function() {
          $.each(this.LINHAS, function() {
              if(!(this.LINHA in $scope.Linhas)){
                  $scope.Linhas.push(this.LINHA);
              }
          })             
      })
      console.log($scope.Linhas);
  }
]);