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
    $rootScope.showConfirm();
  }

  $rootScope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Sair',
       template: 'Você tem certeza que deseja sair?'
     });

     confirmPopup.then(function(res) {
       if(res) {
          localStorage.removeItem('user');
          $state.go('login');
          firebase.auth().signOut();
       } else {
         //console.log('You are not sure');
       }
     });
  };

  $rootScope.isConnected = function() {
        //get current user if signed in
        var user = firebase.auth().currentUser;
        //console.log(user != null);        
        if(user){ 
          return "ng-show";
        } else {
          return "ng-hide";
        }

        
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
      StatusBar.hide();
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
        cache: false,
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "Login"       
    })


    // setup an abstract state for the tabs directive
    .state('signup', {
        cache: false,
        url: "/signup",
        templateUrl: "templates/signup.html",
        controller: "Signup"
       
    })  

    // Each tab has its own nav history stack:    
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
      cache: false,
      url: "/bus-stop",
      views: {
        'bus-stop-tab': {
          templateUrl: "templates/bus-stop.html",
          controller: 'BusStopController'
        }
      }
    })

    .state('tabs.lines', {
      cache: false,
      url: "/lines",
      views: {
        'lines-tab': {
          templateUrl: "templates/lines.html",
          controller: 'LinesController'
        }
      }
    })

    .state('tabs.favorites', {
      cache: false,
      url: "/favorites",
      views: {
        'favorites-tab': {
          templateUrl: "templates/favorites.html",
          controller: 'FavoritesController'
        }
      }
    })

    .state('tabs.historic', {
      cache: false,
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
      				$scope.user = { id: user.uid };
      			} else {
      			  $scope.user = { id: '' };
      		  }      			 
    	
      }
    	
      $scope.login = function() {
             
        	$signin_email = $scope.userloginForm.email.$modelValue;
        	$signin_password = $scope.userloginForm.password.$modelValue;
        		
          
          if ($signin_email === undefined || $signin_email === "" || $signin_email === null) {
            var alertPopup = $ionicPopup.alert({
               title: 'Alerta',
               template: 'Email Inválido'
            });                                  
          } 
          else if ($signin_password === undefined || $signin_password === "" || $signin_password === null) {
            var alertPopup = $ionicPopup.alert({
               title: 'Alerta',
               template: 'Preecha o campo senha.'
            });                                              
          } else {
            	// sign in
              Auth.$signInWithEmailAndPassword($signin_email, $signin_password)
                  .then(function(firebaseUser) {
                      //$scope.message = "User created with uid: " + firebaseUser.uid;                    		                            
                      localStorage['user'] = firebaseUser.email;
                      $state.go('tabs.home');
                      location.reload();
                  }).catch(function(error) {		    
                      var alertPopup = $ionicPopup.alert({
                         title: 'Alerta',
                         template: error.message
                      });                                			                            
              });
          }      
      }

      $scope.semLogin = function() {             
          localStorage.removeItem('user');          
          firebase.auth().signOut();
          $state.go('tabs.home');
      }      
}])
  
.controller("Signup",  ["$scope", "Auth",'$state','$ionicPopup',
  function($scope, Auth,$state , $ionicPopup) {	
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
        $confirmpassword_str = $scope.userForm.confirmpassword.$modelValue;
     
        if ($email_str === undefined || $email_str === "" || $email_str === null) {
            var alertPopup = $ionicPopup.alert({
               title: 'Alerta',
               template: 'Email Inválido'
            });                      
        } 
        else if ($password_str === undefined || $password_str === "" || $password_str === null) {
            var alertPopup = $ionicPopup.alert({
               title: 'Alerta',
               template: 'Preecha o campo senha.'
            });                      
        }
        else if ($confirmpassword_str != $password_str) {
            var alertPopup = $ionicPopup.alert({
               title: 'Alerta',
               template: 'O campos senha e confirmar senha devem ser iguais.'
            });                      
        } else {
            // Create a new user
            Auth.$createUserWithEmailAndPassword($email_str, $password_str)
              .then(function(firebaseUser) {
                var alertPopup = $ionicPopup.alert({
                  title: 'Alerta',
                  template: 'Usuário criado com sucesso!'
                });          
                $state.go('login');
                $scope.message = "User created with uid: " + firebaseUser.uid;
              }).catch(function(error) {
                var alertPopup = $ionicPopup.alert({
                   title: 'Alerta',
                   template: error.message
                });                 
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

.controller('MapController',  ["$scope", '$ionicLoading', '$http', "BusStopJson", "$ionicPopup", 
  function($scope, $ionicLoading, $http, BusStopJson, $ionicPopup) {                                          
            var AllMarkersArray = [];
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
            map.AllMarkersArray = [];
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
          
            $.each( BusStopJson.busStopList, function() {                
                var myLatlng = new google.maps.LatLng(this.COORDINATEY, this.COORDINATEX);
                
                var marker = new google.maps.Marker({
                      position: myLatlng,                      
                      icon: 'img/icon-bus-stop.png',
                      title: JSON.stringify(this)
                });                              
                
                AllMarkersArray.push(marker);              
            });                                        
  
            $("#show-pin").change(function() {
            //map.AllMarkersArray = [];  
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
                                icon: 'img/icon-bus-stop.png',
                                title: JSON.stringify(this)
                          });                              
                          
                          map.AllMarkersArray.push(marker);

                          marker.addListener('click', function() {                                              
                              for (var i=0;i<allInfoWindows.length;i++) 
                                  allInfoWindows[i].close();
                              
                              infowindow.open(map, marker);
                          });                                      
                    });                                           
                } else {
                      for (var i = 0; i < map.AllMarkersArray.length; i++ ) 
                        map.AllMarkersArray[i].setMap(null);
                      
                       // map.AllMarkersArray.length = 0;
                }
            });                        
           
            var originAddress = (document.getElementById('txtOrigin'));
            var destinationAddress = (document.getElementById('txtDestination'));
            var originLatLong = [];
            var destLatLong = [];
            

            var originAutocomplete = new google.maps.places.Autocomplete(originAddress);
            originAutocomplete.bindTo('bounds', map);

            originAutocomplete.addListener('place_changed', function() {              
              originLatLong[0] = originAutocomplete.getPlace().geometry.location.lat();
              originLatLong[1] = originAutocomplete.getPlace().geometry.location.lng();              
            })

            var destinationAutocomplete = new google.maps.places.Autocomplete(destinationAddress);
            destinationAutocomplete.bindTo('bounds', map);

            destinationAutocomplete.addListener('place_changed', function() {              
              destLatLong[0] = destinationAutocomplete.getPlace().geometry.location.lat();
              destLatLong[1] = destinationAutocomplete.getPlace().geometry.location.lng();              
            })

            $scope.PinnedLinhas = [];

            $('#txtOrigin').keypress(function (e) {              
              if (e.which == 13) {
                $("#txtOrigin").blur();
                $('form#calcRouteForm').submit();                
              }
            });

            $('#txtDestination').keypress(function (e) {              
              if (e.which == 13) {
                $("#txtDestination").blur();
                $('form#calcRouteForm').submit();                
              }
            });
            $( "#calcRouteForm" ).submit(function( event ) {  
                  map.AllMarkersArray = [];                
                  if (($('#txtOrigin').val() === undefined || $('#txtOrigin').val() === "" || $('#txtOrigin').val() === null) || ($('#txtDestination').val() === undefined || $('#txtDestination').val() === "" || $('#txtDestination').val() === null)) {
                      var alertPopup = $ionicPopup.alert({
                         title: 'Alerta',
                         template: 'Os campos de origem e destino devem estar preenchidos'
                      });  
                  } 
                  else if ((originLatLong === undefined || originLatLong.length <= 0 || originLatLong === null) || (destLatLong === undefined || destLatLong.length <= 0 || destLatLong === null)) {
                      var alertPopup = $ionicPopup.alert({
                         title: 'Alerta',
                         template: 'Selecione um endereço válido'
                      });  
                  } else {
                      $("#show-pin").attr('checked', false);
                      map.AllMarkersArray = AllMarkersArray;

                      //pega o ponto mais próximo da origem
                      var nearestBusStopOrigin = JSON.parse(find_closest_marker(originLatLong[0], originLatLong[1], AllMarkersArray));
                      
                      for (var i = 0; i < map.AllMarkersArray.length; i++ ) 
                            map.AllMarkersArray[i].setMap(null);

                      map.AllMarkersArray.length = 0;

                      // Pega todos os pontos de onibus, que tem as linhas que o ponto de origem possui.
                      $.each(BusStopJson.busStopList, function() {
                          var busStops = this;
                          $.each(this.LINHAS, function() {
                              var linhaMapa = this.LINHA;
                              $.each(nearestBusStopOrigin.LINHAS, function() {                             
                                if(this.LINHA == linhaMapa){
                                    $scope.PinnedLinhas.push(busStops);
                                }
                              })
                          })
                      })                                                    
                      // Pina no mapa todos os pontos de onibus, que tem as linhas que o ponto de origem possui.
                      $.each( $scope.PinnedLinhas, function() {                
                              var myLatlng = new google.maps.LatLng(this.COORDINATEY, this.COORDINATEX);                                                  
                              var marker = new google.maps.Marker({
                                    position: myLatlng,
                                    map: map,
                                    title: JSON.stringify(this)
                              });                                                                                  

                              map.AllMarkersArray.push(marker);
                      })
                      // pega o ponto mais próximo do destino.
                      var nearestBusStopDest = JSON.parse(find_closest_marker(destLatLong[0], destLatLong[1], map.AllMarkersArray));
                      $scope.linhaEscolhida = "";
                      // compara o ponto mais próximo da origem e destino, para definir qual a linha ideal.
                      $.each(nearestBusStopOrigin.LINHAS, function() {                             
                          var nearestLinhaOrigin = this.LINHA;
                          $.each(nearestBusStopDest.LINHAS, function() {
                              if(nearestLinhaOrigin == this.LINHA){
                                $scope.linhaEscolhida = this.LINHA;
                                $("#buscaOnibus").show();
                                $("#buscaOnibus").children('h1').html('Melhor Linha: ' + this.LINHA);
                                return false;
                              }
                          })
                      })
                      // limpa os pontos
                      for (var i = 0; i < map.AllMarkersArray.length; i++ ) 
                            map.AllMarkersArray[i].setMap(null);

                      map.AllMarkersArray.length = 0;
                      // monta o caminho da linha ideal
                      $scope.PinnedLinhas = [];
                      $.each(BusStopJson.busStopList, function() {
                          var busStops = this;

                          $.each(this.LINHAS, function() {                
                              if(this.LINHA == $scope.linhaEscolhida){
                                  $scope.PinnedLinhas.push(busStops);
                              }
                          })
                      })
                      // pina o caminho da linha ideal
                      $.each( $scope.PinnedLinhas, function() {                
                              var myLatlng = new google.maps.LatLng(this.COORDINATEY, this.COORDINATEX);                                                  
                              var marker = new google.maps.Marker({
                                    position: myLatlng,
                                    map: map,
                                    title: JSON.stringify(this),                                  
                                    icon: 'img/icon-route.png'
                              });                                                                                  

                              map.AllMarkersArray.push(marker);
                      })                  

                      // salva a origem e destino no localStorage do histórico do usuário
                      var email = localStorage.getItem("user");                    
                      if( (document.getElementById('txtOrigin').value != null || document.getElementById('txtOrigin').value != undefined )  && (document.getElementById('txtDestination').value != null || document.getElementById('txtDestination').value != undefined )){
                           var StorageHistorico = [];
                            
                           if(email != null || email != undefined || email != '' ){
                                StorageHistorico = JSON.parse(localStorage.getItem(email + "_historico"));      
                           }          

                         
                          if(StorageHistorico == null || StorageHistorico == undefined){
                            StorageHistorico = [];
                          }
                          var historico = {
                              origem:document.getElementById('txtOrigin').value,
                              destino:document.getElementById('txtDestination').value,
                              coordOrigem: {
                                x: originLatLong[0],
                                y: originLatLong[1]
                              },
                              coordDestino: {
                                x: destLatLong[0],
                                y: destLatLong[1]
                              }
                          };
                    
                          StorageHistorico.push(historico);
                          localStorage.setItem(email + "_historico", JSON.stringify(StorageHistorico));

                      }
                      event.preventDefault();
                  }
            });     
            
            $(".showPopupOrig").click(function() {                  
                if ($('#txtOrigin').val() === undefined || $('#txtOrigin').val() === "" || $('#txtOrigin').val() === null){
                  var alertPopup = $ionicPopup.alert({
                         title: 'Alerta',
                         template: 'O campo de origem deve estar preenchido para adicionar um favorito'
                  });  
                } 
                else if (originLatLong === undefined || originLatLong.length <= 0 || originLatLong === null) {
                      var alertPopup = $ionicPopup.alert({
                         title: 'Alerta',
                         template: 'Selecione um endereço válido'
                      });                    
                } else {
                   $scope.data = {}
                   // An elaborate, custom popup
                   var myPopup = $ionicPopup.show({               
                   template: '<input type="text" ng-model="data.apelido" placeholder="Apelido para Rota">',
                   title: 'Adicionar nova rota favorita',                   
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
                      }
                    ]
                  });                 
                  
                  
                  myPopup.then(function(res) {
                      if (res) {
                        var Storagefavoritos = [];
                        var email = localStorage.getItem("user");
                        if(email != null || email != undefined || email != '' ){
                          Storagefavoritos = JSON.parse(localStorage.getItem(email + "_favoritos"));      
                        }
                        if(Storagefavoritos == null || Storagefavoritos == undefined){
                          Storagefavoritos = [];
                        }
                        
                        var favorito = {
                              apelido:$scope.data.apelido,
                              endereco:document.getElementById('txtOrigin').value,                              
                              coordEndereco: {
                                x: originLatLong[0],
                                y: originLatLong[1]
                              }
                        };
                        
                        Storagefavoritos.push(favorito);

                        if(email != null || email != undefined || email != '' ){
                          localStorage.setItem(email + "_favoritos", JSON.stringify(Storagefavoritos));
                        }
                        
                        var alertPopup = $ionicPopup.alert({
                          title: 'Sucesso!',
                          template: 'O endereço foi salvo como favorito!'
                        });                          
                      }
                  });
                }
            })
            
            $(".showPopupDest" ).click(function(event) {               
               if ($('#txtDestination').val() === undefined || $('#txtDestination').val() === "" || $('#txtDestination').val() === null){
                  var alertPopup = $ionicPopup.alert({
                         title: 'Alerta',
                         template: 'O campo de destino deve estar preenchido'
                  });  
                } 
                else if (destLatLong === undefined || destLatLong.length <= 0 || destLatLong === null) {
                      var alertPopup = $ionicPopup.alert({
                         title: 'Alerta',
                         template: 'Selecione um endereço válido'
                      });                    
                } else {
                   $scope.data = {}
                   // An elaborate, custom popup
                   var myPopup = $ionicPopup.show({               
                   template: '<input type="text" ng-model="data.apelido" placeholder="Apelido para Rota">',
                   title: 'Adicionar nova rota favorita',                   
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
                     }
                    ]
                  });                 
                  
                  
                  myPopup.then(function(res) {
                      if (res) {
                        var Storagefavoritos = [];
                        var email = localStorage.getItem("user");
                        if(email != null || email != undefined || email != '' ){
                          Storagefavoritos = JSON.parse(localStorage.getItem(email + "_favoritos"));      
                        }
                        if(Storagefavoritos == null || Storagefavoritos == undefined){
                          Storagefavoritos = [];
                        }
                        
                        var favorito = {
                              apelido:$scope.data.apelido,
                              endereco:document.getElementById('txtDestination').value,                              
                              coordEndereco: {
                                x: destLatLong[0],
                                y: destLatLong[1]
                              }
                        };
                        
                        Storagefavoritos.push(favorito);

                        if(email != null || email != undefined || email != '' ){
                          localStorage.setItem(email + "_favoritos", JSON.stringify(Storagefavoritos));
                        }
                        
                        var alertPopup = $ionicPopup.alert({
                          title: 'Sucesso!',
                          template: 'O endereço foi salvo como favorito!'
                        });    
                      }
                  });
                }
            })
            
            
                 
            // definição da função que acha o marker mais próximo
            function rad(x) {return x*Math.PI/180;}
            function find_closest_marker( lat, lng, markerArray ) {                
                var R = 6371; // radius of earth in km
                var distances = [];
                var closest = -1;
                for( i=0;i<markerArray.length; i++ ) {
                    var mlat = markerArray[i].position.lat();
                    var mlng = markerArray[i].position.lng();
                    var dLat  = rad(mlat - lat);
                    var dLong = rad(mlng - lng);
                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    var d = R * c;
                    distances[i] = d;
                    if ( closest == -1 || d < distances[closest] ) {
                        closest = i;
                    }
                }

                return markerArray[closest].title;
            }
  }
])

.controller('BusStopController', ["$scope", '$ionicLoading', '$http', "BusStopJson", 
  function($scope, $ionicLoading, $http, BusStopJson) {    
        $scope.BusStopList = BusStopJson.busStopList;    

        var allInfoWindows = [];
        $scope.showMapBusStop = false;

        $scope.showMap = function(busStop) {            
            $('#busStopMap').show();
            $scope.showMapBusStop = true;

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
            $scope.showMapBusStop = false;
            $('#busStopMap').hide();
        }      
    
        $scope.search = {
          name: true,
          value: true,
          category: true
        };

        $scope.customFilter = function (item) {
          if (!$scope.search.$) {// your input field is empty
              return true;
          }

          var searchVal = $scope.search.$;
          searchVal = searchVal.replace(/([()[{*+.$^\\|?])/g, '\\$1'); //special char
          var regex = new RegExp('' + searchVal, 'i');        
          
          if (regex.test(item["ADDRESS"]) ) {
              return true; 
          }            
          
          return false;
        }
  }
])

.controller('LinesController', ["$scope", '$ionicLoading', '$http', "BusStopJson", 
  function($scope, $ionicLoading, $http, BusStopJson) {    

        $scope.showMapLines = false;

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
            $('#linesMap').show();
            $scope.showMapLines = true;

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
            $scope.showMapLines = false;
            $('#linesMap').hide();
        }

        $scope.search = {
          name: true,
          value: true,
          category: true
        };

        $scope.customFilter = function (item) {
          if (!$scope.search.$) {// your input field is empty
              return true;
          }

          var searchVal = $scope.search.$;
          searchVal = searchVal.replace(/([()[{*+.$^\\|?])/g, '\\$1'); //special char
          var regex = new RegExp('' + searchVal, 'i');        

          console.log("LINHA " + item);
          if (regex.test("LINHA " + item) ) {
              return true; 
          }            
          
          return false;
        }
  }
])

.controller('FavoritesController', ["$scope", '$ionicLoading', '$ionicPopup', '$http', "BusStopJson", 
  function($scope, $ionicLoading, $ionicPopup, $http, BusStopJson) {                                                                                           
      $scope.PinnedLinhas = [];
      var AllMarkersArray = [];

      $.each( BusStopJson.busStopList, function() {                
            var myLatlng = new google.maps.LatLng(this.COORDINATEY, this.COORDINATEX);
            
            var marker = new google.maps.Marker({
                  position: myLatlng,                      
                  icon: 'img/icon-bus-stop.png',
                  title: JSON.stringify(this)
            });                              
            
            AllMarkersArray.push(marker);              
      });   

      var templateElemento = '<div class="item item-avatar item-button-right" style="cursor:pointer">'
                           +      '<img src="img/bus-map-icon-star.jpg" class="click-show-favorites">'
                           +      '<p class="click-show-favorites">#apelido#</p>'
                           +      '<span class="click-show-favorites">#endereco#</span>'                           
                           +      '<input type="hidden" value="#coordEndereco#">'
                           +      '<button data-index="#index#" class="button button-icon button-list-fav icon ion-close-circled button-assertive button-clear click-excluir-fav"></button>'                           
                           + '</div>';      
            
      var ElementoListaFavoritos = angular.element( document.querySelector( '#listaFavoritos' ) );

      var email = localStorage.getItem("user");
      if(email != null || email != undefined || email != '' ){
          var Storagefavoritos = JSON.parse(localStorage.getItem(email + "_favoritos"));      
      }
      

      for (i in Storagefavoritos)
      {
        var elemento = templateElemento.replace("#index#",i)
        .replace("#apelido#",Storagefavoritos[i].apelido)
        .replace("#endereco#",Storagefavoritos[i].endereco)
        .replace("#coordEndereco#",Storagefavoritos[i].coordEndereco.x + '#' + Storagefavoritos[i].coordEndereco.y);
        ElementoListaFavoritos.append(elemento);
      }
      
      $('.click-excluir-fav').click(function () {             
          var confirmPopup = $ionicPopup.confirm({
             title: 'Excluir',
             template: 'Você tem certeza que deseja excluir o endereço?'
           });

           confirmPopup.then(function(res) {
             if(res) {
                $this = $(this);        
                var index = $this.attr('data-index');
                var ElementoListaFavoritos = angular.element( document.querySelector( '#listaFavoritos' ) );

                var email = localStorage.getItem("user");
                if(email != null || email != undefined || email != '' ){
                  var Storagefavoritos = JSON.parse(localStorage.getItem(email + "_favoritos"));      
                }
                
                Storagefavoritos.splice(index,1);
                if(email != null || email != undefined || email != '' ){
                   localStorage.setItem(email + "_favoritos", JSON.stringify(Storagefavoritos));
                }
                location.reload();
             } else {
               //console.log('You are not sure');
             }
           });      
       })

        $('.click-show-favorites').click(function () {
              $('#favoritesMap').show();
              $('#buttonBackFavorites').show();
              $('#listFavorites').hide();
              $this = $(this);      
              
              var coordOrigem = [];
              
              navigator.geolocation.getCurrentPosition(function(pos) {
                coordOrigem.push(pos.coords.latitude);
                coordOrigem.push(pos.coords.longitude);
              });

              if(coordOrigem.length == 0){
                  coordOrigem.push("-23.9804479");
                  coordOrigem.push("-46.3109819"); 
              }

              var coordDestino = ($this.parent().children('input')[0].value).split('#');
                                            
              var markersArray = [];
              var myLatlng = new google.maps.LatLng(-23.9804479, -46.3109819);                 

              var mapOptions = {
                  center: new google.maps.LatLng(coordDestino[0], coordDestino[1]),
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
              var map = new google.maps.Map(document.getElementById("favoritesMap"), mapOptions);
       
              directionsDisplay.setMap(map);

              var myLocation = new google.maps.Marker({
                      position: myLatlng,
                      map: map,                
                      title: "Você",
                      icon: 'img/icon-you-here.png'
              });

              $scope.map = map;                            
              
              map.AllMarkersArray = AllMarkersArray;

              //pega o ponto mais próximo da origem
              var nearestBusStopOrigin = JSON.parse(find_closest_marker(coordOrigem[0], coordOrigem[1], AllMarkersArray));
              
              for (var i = 0; i < map.AllMarkersArray.length; i++ ) 
                    map.AllMarkersArray[i].setMap(null);

              map.AllMarkersArray.length = 0;

              // Pega todos os pontos de onibus, que tem as linhas que o ponto de origem possui.
              $.each(BusStopJson.busStopList, function() {
                  var busStops = this;
                  $.each(this.LINHAS, function() {
                      var linhaMapa = this.LINHA;
                      $.each(nearestBusStopOrigin.LINHAS, function() {                             
                        if(this.LINHA == linhaMapa){
                            $scope.PinnedLinhas.push(busStops);
                        }
                      })
                  })
              })                                                    
              // Pina no mapa todos os pontos de onibus, que tem as linhas que o ponto de origem possui.
              $.each( $scope.PinnedLinhas, function() {                
                      var myLatlng = new google.maps.LatLng(this.COORDINATEY, this.COORDINATEX);                                                  
                      var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            title: JSON.stringify(this)
                      });                                                                                  

                      map.AllMarkersArray.push(marker);
              })
              // pega o ponto mais próximo do destino.
              var nearestBusStopDest = JSON.parse(find_closest_marker(coordDestino[0], coordDestino[1], map.AllMarkersArray));
              $scope.linhaEscolhida = "";
              // compara o ponto mais próximo da origem e destino, para definir qual a linha ideal.
              $.each(nearestBusStopOrigin.LINHAS, function() {                             
                  var nearestLinhaOrigin = this.LINHA;
                  $.each(nearestBusStopDest.LINHAS, function() {
                      if(nearestLinhaOrigin == this.LINHA){
                        $scope.linhaEscolhida = this.LINHA;
                        $("#buscaOnibusFavorites").show();
                        $("#buscaOnibusFavorites").children('h1').html('Melhor Linha: ' + this.LINHA);
                        return false;
                      }
                  })
              })
              // limpa os pontos
              for (var i = 0; i < map.AllMarkersArray.length; i++ ) 
                    map.AllMarkersArray[i].setMap(null);

              map.AllMarkersArray.length = 0;
              // monta o caminho da linha ideal
              $scope.PinnedLinhas = [];
              $.each(BusStopJson.busStopList, function() {
                  var busStops = this;

                  $.each(this.LINHAS, function() {                
                      if(this.LINHA == $scope.linhaEscolhida){
                          $scope.PinnedLinhas.push(busStops);
                      }
                  })
              })
              // pina o caminho da linha ideal
              $.each( $scope.PinnedLinhas, function() {                
                      var myLatlng = new google.maps.LatLng(this.COORDINATEY, this.COORDINATEX);                                                  
                      var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            title: JSON.stringify(this),
                            icon: 'img/icon-route.png'
                      });                                                                                  

                      map.AllMarkersArray.push(marker);
              })                                                        
        });
        $scope.hideMap = function() {
              $('#favoritesMap').hide();
              $('#buttonBackFavorites').hide();
              $('#listFavorites').show();
              $("#buscaOnibusFavorites").hide();
        }       

        // definição da função que acha o marker mais próximo
        function rad(x) {return x*Math.PI/180;}
        function find_closest_marker( lat, lng, markerArray ) {                
            var R = 6371; // radius of earth in km
            var distances = [];
            var closest = -1;
            for( i=0;i<markerArray.length; i++ ) {
                var mlat = markerArray[i].position.lat();
                var mlng = markerArray[i].position.lng();
                var dLat  = rad(mlat - lat);
                var dLong = rad(mlng - lng);
                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c;
                distances[i] = d;
                if ( closest == -1 || d < distances[closest] ) {
                    closest = i;
                }
            }

            return markerArray[closest].title;
        }  
  }  
  
   
])

.controller('HistoricController', ["$scope", '$ionicLoading', '$http', "BusStopJson", 
    function($scope, $ionicLoading, $http, BusStopJson) {    
          $scope.PinnedLinhas = [];
          var AllMarkersArray = [];
        
          $.each( BusStopJson.busStopList, function() {                
                var myLatlng = new google.maps.LatLng(this.COORDINATEY, this.COORDINATEX);
                
                var marker = new google.maps.Marker({
                      position: myLatlng,                      
                      icon: 'img/icon-bus-stop.png',
                      title: JSON.stringify(this)
                });                              
                
                AllMarkersArray.push(marker);              
          });   
          
          var templateElemento = '<div class="item item-avatar item-button-right">'
                               + '  <img src="img/bus-map-icon-historic.jpg">'
                               + '  <span>#origem#</span><br />'
                               + '  <input type="hidden" value="#coordOrigem#">'
                               + '  <span class="span-list">#destino#</span>'   
                               + '  <input type="hidden" value="#coordDestino#">'
                               + '  <button class="button button-positive button-list click-show-historic"> <i class="icon ion-android-refresh"></i></button>'
                               + '</div>'
          var ElementoListaHistorico = angular.element( document.querySelector( '#listaHistorico' ) );

          var email = localStorage.getItem("user");
          var StorageHistorico = "";      
          if(email != null || email != undefined || email != '' ){
              StorageHistorico = JSON.parse(localStorage.getItem(email + "_historico"));      
          }          

          for (i in StorageHistorico)
          {
            var elemento = templateElemento
            .replace("#origem#",StorageHistorico[i].origem)
            .replace("#destino#",StorageHistorico[i].destino)
            .replace("#coordOrigem#",StorageHistorico[i].coordOrigem.x + '#' + StorageHistorico[i].coordOrigem.y )
            .replace("#coordDestino#",StorageHistorico[i].coordDestino.x + '#' + StorageHistorico[i].coordDestino.y);
            ElementoListaHistorico.append(elemento);
          }

          $('.click-show-historic').click(function () {
                $('#historicMap').show();
                $('#buttonBackHistoric').show();
                $('#listHistoric').hide();
                $this = $(this);      
                            
                var coordOrigem = ($this.parent().children('input')[0].value).split('#');
                var coordDestino = ($this.parent().children('input')[1].value).split('#');
                                                  
                var markersArray = [];
                var myLatlng = new google.maps.LatLng(-23.9804479, -46.3109819);                 

                var mapOptions = {
                    center: new google.maps.LatLng(coordDestino[0], coordDestino[1]),
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
                var map = new google.maps.Map(document.getElementById("historicMap"), mapOptions);
         
                directionsDisplay.setMap(map);

                var myLocation = new google.maps.Marker({
                        position: myLatlng,
                        map: map,                
                        title: "Você",
                        icon: 'img/icon-you-here.png'
                });

                $scope.map = map;                            
                
                map.AllMarkersArray = AllMarkersArray;

                //pega o ponto mais próximo da origem
                var nearestBusStopOrigin = JSON.parse(find_closest_marker(coordOrigem[0], coordOrigem[1], AllMarkersArray));
                
                for (var i = 0; i < map.AllMarkersArray.length; i++ ) 
                      map.AllMarkersArray[i].setMap(null);

                map.AllMarkersArray.length = 0;

                // Pega todos os pontos de onibus, que tem as linhas que o ponto de origem possui.
                $.each(BusStopJson.busStopList, function() {
                    var busStops = this;
                    $.each(this.LINHAS, function() {
                        var linhaMapa = this.LINHA;
                        $.each(nearestBusStopOrigin.LINHAS, function() {                             
                          if(this.LINHA == linhaMapa){
                              $scope.PinnedLinhas.push(busStops);
                          }
                        })
                    })
                })                                                    
                // Pina no mapa todos os pontos de onibus, que tem as linhas que o ponto de origem possui.
                $.each( $scope.PinnedLinhas, function() {                
                        var myLatlng = new google.maps.LatLng(this.COORDINATEY, this.COORDINATEX);                                                  
                        var marker = new google.maps.Marker({
                              position: myLatlng,
                              map: map,
                              title: JSON.stringify(this)
                        });                                                                                  

                        map.AllMarkersArray.push(marker);
                })
                // pega o ponto mais próximo do destino.
                var nearestBusStopDest = JSON.parse(find_closest_marker(coordDestino[0], coordDestino[1], map.AllMarkersArray));
                $scope.linhaEscolhida = "";
                // compara o ponto mais próximo da origem e destino, para definir qual a linha ideal.
                $.each(nearestBusStopOrigin.LINHAS, function() {                             
                    var nearestLinhaOrigin = this.LINHA;
                    $.each(nearestBusStopDest.LINHAS, function() {
                        if(nearestLinhaOrigin == this.LINHA){
                          $scope.linhaEscolhida = this.LINHA;
                          $("#buscaOnibusHistoric").show();
                          $("#buscaOnibusHistoric").children('h1').html('Melhor Linha: ' + this.LINHA);
                          return false;
                        }
                    })
                })
                // limpa os pontos
                for (var i = 0; i < map.AllMarkersArray.length; i++ ) 
                      map.AllMarkersArray[i].setMap(null);

                map.AllMarkersArray.length = 0;
                // monta o caminho da linha ideal
                $scope.PinnedLinhas = [];
                $.each(BusStopJson.busStopList, function() {
                    var busStops = this;

                    $.each(this.LINHAS, function() {                
                        if(this.LINHA == $scope.linhaEscolhida){
                            $scope.PinnedLinhas.push(busStops);
                        }
                    })
                })
                // pina o caminho da linha ideal
                $.each( $scope.PinnedLinhas, function() {                
                        var myLatlng = new google.maps.LatLng(this.COORDINATEY, this.COORDINATEX);                                                  
                        var marker = new google.maps.Marker({
                              position: myLatlng,
                              map: map,
                              title: JSON.stringify(this),
                              icon: 'img/icon-route.png'
                        });                                                                                  

                        map.AllMarkersArray.push(marker);
                })                                                  
          });

          $scope.hideMap = function() {
                $('#historicMap').hide();
                $('#buttonBackHistoric').hide();
                $('#listHistoric').show();
                $("#buscaOnibusHistoric").hide();
          }                      
    }
])

.filter('customSearch',function($scope) {
  return function(item, type) {  
    return true;
  }
});