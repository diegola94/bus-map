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

.run(function($ionicPlatform, $rootScope, $state, $ionicPopup) {
  $rootScope.signout = function() {
     firebase.auth().signOut().then(function() {
        $rootScope.showConfirm();                    
     })

    .catch(function(error) {              
      alert(error.message);
    });
  }

  $rootScope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Sair',
       template: 'Você tem certeza que deseja sair?'
     });

     confirmPopup.then(function(res) {
       if(res) {
         $state.go('login');
       } else {
         //console.log('You are not sure');
       }
     });
   };

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
    })

    .state('tabs.favorites', {
      url: "/favorites",
      views: {
        'favorites-tab': {
          templateUrl: "templates/favorites.html",
          controller: 'FavoritesController'
        }
      }
    })

    .state('tabs.historic', {
      url: "/historic",
      views: {
        'historic-tab': {
          templateUrl: "templates/historic.html",
          controller: 'HistoricController'
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
    			data3: $data3
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
            var markersArray = [];
            var myLatlng = new google.maps.LatLng(-23.9804479, -46.3109819);                 

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

            var myLocation = new google.maps.Marker({
                    position: myLatlng,
                    map: map,                
                    title: "Você",
                    icon: 'img/icon-you-here.png'
            });

            $scope.map = map;



            // navigator.geolocation.getCurrentPosition(function(pos) {
            //     map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            //     var myLocation = new google.maps.Marker({
            //         position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            //         map: map,                
            //         title: "Você",
            //         icon: 'img/icon-you-here.png'
            //     });
            // });

            


            var allInfoWindows = [];                          
     
            $("#show-pin").change(function() {
                if(this.checked) {
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
                          
                          markersArray.push(marker);

                          marker.addListener('click', function() {                                              
                              for (var i=0;i<allInfoWindows.length;i++) 
                                  allInfoWindows[i].close();
                              
                              infowindow.open(map, marker);
                          });              
                    });                                           
                } else {
                      for (var i = 0; i < markersArray.length; i++ ) 
                        markersArray[i].setMap(null);
                      
                      markersArray.length = 0;
                }
            });                        
           
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

                  if( (document.getElementById('txtOrigin').value != null || document.getElementById('txtOrigin').value != undefined )  && (document.getElementById('txtDestination').value != null || document.getElementById('txtDestination').value != undefined )){
                     var StorageHistorico = [];
                     StorageHistorico = JSON.parse(localStorage.getItem("historico"));
                      if(StorageHistorico == null || StorageHistorico == undefined){
                        StorageHistorico = [];
                      }
                    var historico = {
                    origem:document.getElementById('txtOrigin').value,
                    destino:document.getElementById('txtDestination').value
                  };
                
                  StorageHistorico.push(historico);
                  localStorage.setItem("historico", JSON.stringify(StorageHistorico));

                  }
                  event.preventDefault();
            });          
  }
])

.controller('BusStopController', ["$scope", '$ionicLoading', '$http', "BusStopJson", 
  function($scope, $ionicLoading, $http, BusStopJson) {    
        $scope.BusStopList = BusStopJson.busStopList;    

        $("#mapBusStop").hide();
        $("#busStopMap").hide();

        var allInfoWindows = [];

        $scope.showMap = function(busStop) {            
            $("#listBusStop").hide();
            $("#mapBusStop").show();
            $("#busStopMap").show();

            console.log(busStop.BusStop);
            var markersArray = [];
            var myLatlng = new google.maps.LatLng(-23.9804479, -46.3109819);                 

            var mapOptions = {
                center: new google.maps.LatLng(busStop.BusStop.COORDINATEY, busStop.BusStop.COORDINATEX),
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
            var map = new google.maps.Map(document.getElementById("busStopMap"), mapOptions);
     
            directionsDisplay.setMap(map);

            var myLocation = new google.maps.Marker({
                    position: myLatlng,
                    map: map,                
                    title: "Você",
                    icon: 'img/icon-you-here.png'
            });

            $scope.map = map;  
            
            console.log($scope.PinnedLinhas);

            var myLatlng = new google.maps.LatLng(busStop.BusStop.COORDINATEY, busStop.BusStop.COORDINATEX);

            var linhas = "";

            $.each( busStop.BusStop.LINHAS, function() {
                  linhas += this.LINHA + ", ";
            })  
            linhas = linhas.substring(0, linhas.length - 2);

            var contentString = 
                  '<div>'+                      
                    '<h4>Ponto de Onibus</h4>'+
                    '<div id="bodyContent">'+
                        'Endereço: ' + busStop.BusStop.ADDRESS + 
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
            
            markersArray.push(marker);
            infowindow.open(map, marker);          
        }


        $scope.hideMap = function() {
            $("#listBusStop").show();
            $("#mapBusStop").hide();
            $("#busStopMap").hide();
        }
  }
])

.controller('LinesController', ["$scope", '$ionicLoading', '$http', "BusStopJson", 
  function($scope, $ionicLoading, $http, BusStopJson) {    

        $("#mapLines").hide();
        $("#linesMap").hide();

        $scope.BusStopList = BusStopJson.busStopList;    
        $scope.Linhas = [];
        $scope.PinnedLinhas = [];

        $.each(BusStopJson.busStopList, function() {
            $.each(this.LINHAS, function() {                
                if($.inArray(this.LINHA,$scope.Linhas) == -1){
                    $scope.Linhas.push(this.LINHA);                  
                }
            })
        })
        $scope.Linhas.sort();

        $scope.showMap = function(line) {
            $("#listLines").hide();
            $("#mapLines").show();
            $("#linesMap").show();

            $scope.PinnedLinhas = [];
            var markersArray = [];


            $.each(BusStopJson.busStopList, function() {
                var busStops = this;

                $.each(this.LINHAS, function() {                
                    if(this.LINHA == line.Linha){
                        $scope.PinnedLinhas.push(busStops);
                    }
                })
            })

            var myLatlng = new google.maps.LatLng(-23.9804479, -46.3109819);                 

            var mapOptions = {
                center: new google.maps.LatLng($scope.PinnedLinhas[0].COORDINATEY, $scope.PinnedLinhas[0].COORDINATEX),
                zoom: 15,
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
            var map = new google.maps.Map(document.getElementById("linesMap"), mapOptions);
     
            directionsDisplay.setMap(map);

            var myLocation = new google.maps.Marker({
                    position: myLatlng,
                    map: map,                
                    title: "Você",
                    icon: 'img/icon-you-here.png'
            });

            $scope.map = map;
                      

            var allInfoWindows = [];         
            $.each( $scope.PinnedLinhas, function() {                
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
                
                markersArray.push(marker);

                marker.addListener('click', function() {                                              
                    for (var i=0;i<allInfoWindows.length;i++) 
                        allInfoWindows[i].close();
                    
                    infowindow.open(map, marker);
                });

            })
        }                  

        $scope.hideMap = function() {
            $("#listLines").show();
            $("#mapLines").hide();
            $("#linesMap").hide();
        }
  }
])

.controller('FavoritesController', ["$scope", '$ionicLoading', '$ionicPopup', '$http', "BusStopJson", 
  function($scope, $ionicLoading, $ionicPopup, $http, BusStopJson) {    
      

       $scope.reply_click = function() {
          console.log('bla');
       }

      var templateElemento = '<div class="item item-avatar item-button-right">'
                           + '<img src="../img/bus-map-icon-star.jpg">'
                           + '<p>#apelido#</p>'
                           + '<span>#rota#</span>'
                           + '<!-- <button class="button button-clear button-assertive"> <i class="icon ion-close-circled"></i></button>-->'
                           + '<button data-index="#index#" ng-click="reply_click()" class="button button-icon button-list-fav icon ion-close-circled button-assertive button-clear"></button>'
                           + '</div>'
      var ElementoListaFavoritos = angular.element( document.querySelector( '#listaFavoritos' ) );
      var Storagefavoritos = JSON.parse(localStorage.getItem("favoritos"));

      for (i in Storagefavoritos)
      {
        var elemento = templateElemento.replace("#index#",i).replace("#apelido#",Storagefavoritos[i].apelido).replace("#rota#",Storagefavoritos[i].rota);
        ElementoListaFavoritos.append(elemento);
      }



      $scope.showPopup = function() {
        $scope.data = {}

        var favHtml = ' <div class="list">'
                      + '  <label class="item item-input item-stacked-label">'
                      + '    <span class="input-label">Apelido para rota</span>'
                      + '    <input type="text" placeholder="Casa">'
                      + '  </label>'
                      + '  <label class="item item-input item-stacked-label">'
                      + '    <span class="input-label">Rota</span>'
                      + '    <input type="text" placeholder="Av. Ana Costa 209">'
                      + '  </label>  '
                      + '</div>'
                      

         // An elaborate, custom popup
           var myPopup = $ionicPopup.show({
           template: '<input type="text" ng-model="data.apelido" placeholder="Apelido para Rota"><br /><input type="text" ng-model="data.rota" placeholder="Rota">',
           title: 'Adicionar nova rota favorito',
           subTitle: '',
           scope: $scope,
           buttons: [
             { text: 'Cancelar' },
             {
               text: '<b>Salvar</b>',
               type: 'button-positive',
               onTap: function(e) {
                 if (!$scope.data.apelido) {
                   //don't allow the user to close unless he enters wifi password
                   e.preventDefault();
                 } else {
                   return $scope.data.apelido;
                 }
               }
             },]
          });                 
      
          myPopup.then(function(res) {
              if (res) {
                var Storagefavoritos = [];
                Storagefavoritos = JSON.parse(localStorage.getItem("favoritos"));
                if(Storagefavoritos == null || Storagefavoritos == undefined){
                  Storagefavoritos = [];
                }
                var favorito = {
                    apelido:$scope.data.apelido,
                    rota:$scope.data.rota
                  };
                
                Storagefavoritos.push(favorito);
                localStorage.setItem("favoritos", JSON.stringify(Storagefavoritos));
                location.reload();
              }
          });
    }
  }   
])

.controller('HistoricController', ["$scope", '$ionicLoading', '$http', "BusStopJson", 
  function($scope, $ionicLoading, $http, BusStopJson) {    

      var templateElemento = '<div class="item item-avatar item-button-right">'
                           + '<img src="../img/bus-map-icon-historic.jpg">'
                           + '<span>#origem#</span><br />'
                           + '<span class="span-list">#destino#</span>'
                           + '<!-- <button class="button button-clear button-assertive"> <i class="icon ion-close-circled"></i></button> -->'
                           + '<button class="button button-positive button-list"> <i class="icon ion-android-refresh"></i></button>'
                           + '</div>'
      var ElementoListaHistorico = angular.element( document.querySelector( '#listaHistorico' ) );
      var StorageHistorico = JSON.parse(localStorage.getItem("historico"));

      for (i in StorageHistorico)
      {
        var elemento = templateElemento.replace("#origem#",StorageHistorico[i].origem).replace("#destino#",StorageHistorico[i].destino);
        ElementoListaHistorico.append(elemento);
      }
  }
]);