const app = require('./src/app')
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('JSONPlaceholder listening on http://localhost:' + port)
})

var root = 'http://jsonplaceholder.typicode.com';
var idNumber = "";
var userAlbum = [];
var id = [];


$.ajax({
  url: root + '/users',
  method: 'GET'
}).then(function(data){
	for (i in data) {
  	if (data[i].address.zipcode.match(/^\d{5}-\d{4}$/)){
  		idNumber = idNumber + data[i].id + ",";
  		}
  	}
  	idNumber=idNumber.toString();
  	idNumber = idNumber.split(",");
  	let length = idNumber.length-1;
  	idNumber.splice (length, 1);
  	console.log(idNumber);
  	if (!(idNumber[0] == null | idNumber[0] == undefined)){
  		$.ajax({
  	url: root + '/albums',
  	method: 'GET'
  	}).then(function(data){	
  		for (j in idNumber){
  			var albums = "";
  			var albumId = {};
  		for (i in data){
  			if (idNumber[j] == data[i].userId){
  					albums = albums + data[i].id + ",";
  			}
  		}
  			albums = albums.toString();
  			albums = albums.split(',');
  			albumId = {
  			"userId": idNumber[j],
  			"photo": albums
  			};
  			userAlbum.push(albumId);
  		}
  		if (!(userAlbum[0] == null | userAlbum[0] == undefined)){
  			$.ajax({
  			url: root + '/photos',
  			method: 'GET'
  			}).then(function(data){	
  				
  					for (i in userAlbum){
  						for (j in userAlbum[i].photo[j]){
  							for (k in data){
  								if(data[k].albumId == userAlbum[i].photo[j]){
  									if(data[k].title.match(/voluptate/)){
  										id = id + userAlbum[i].userId +",";
  										break;
  									}

  								}
	  						}
	  						break;
  						}
  					}//koniec for i in userAlbum

  					
  					id=id.toString();
  					id = id.split(",");
  					let length = id.length-1;
  					id.splice (length, 1);

  					if (!(id[0] == null | id[0] == undefined)){
  					$.ajax({
  					url: root + '/users',
  					method: 'GET'
  					}).then(function(data){
  						var contain = [];
  						for (i in id){
  							for (j in data){
  								if (id[i]==data[j].id){
  									contain[i] = data[j];
  								}
  							}
  						}
  						contain = JSON.stringify(contain, null, 4);
  						console.log(contain);
  						var a = window.document.createElement('a');
						a.href = window.URL.createObjectURL(new Blob([contain], {type: 'text/json'}));
						a.download = 'users.json';

						// Append anchor to body.
						document.body.appendChild(a)
						a.click();

						// Remove anchor from body
						document.body.removeChild(a)
  					});

  			};
  					
  					
  		});//function data photos
  	};//konied if userAlbum nie puste
  	});//fucntion data abums
  };//if idNumber
});//koniec ifa z users
