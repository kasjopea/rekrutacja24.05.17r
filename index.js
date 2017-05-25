const app = require('./src/app')
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('JSONPlaceholder listening on http://localhost:' + port)
})


//ZADANIE REKRUTACYJNE
var root = 'http://jsonplaceholder.typicode.com',
	userList1 = "",
	userAlbum = [],
	id = [];

//Warunek na użytkowników-> wynikiem jest tablica z użytkownikami spełniającymi warunek
function userClause(data){
	for (i in data) {
  		if (data[i].address.zipcode.match(/^\d{5}-\d{4}$/)){
  			userList1 = userList1 + data[i].id + ",";
  		}
  	}
  	userList1 = userList1.toString();
  	userList1 = userList1.split(",");
  	let length = userList1.length-1;
  	userList1.splice (length, 1);
  	return userList1;
}

//Warunek na tytuł zdjęcia-> zwraca tablicę z numerami użytkowników spełniających ten warunek oraz warunek wcześniejszy
function photoClause(data,userAlbum){
	for (i in userAlbum){
  		for (j in userAlbum[i].photo[j]){
  			for (k in data){
  				if (data[k].albumId == userAlbum[i].photo[j]){
  					if (data[k].title.match(/voluptate/)){
  						id = id + userAlbum[i].userId +",";
  						break;
  					}
  				}
	  		}
	  		break;
  		}
  	}
	id=id.toString();
  	id = id.split(",");
  	let length = id.length-1;
  	id.splice (length, 1);
  	return id;
}


$.ajax({
	url: root + '/users',
	method: 'GET'
	}).then(function(data){
	userList1 = userClause(data);//lista numerów użytkowników spełniających warunek z funkcji userClause
  	if (userList1.length>0){
  		$.ajax({
  		url: root + '/albums',
  		method: 'GET'
  		}).then(function(data){	
  		for (j in userList1){
  			var albums = ""; //tablica z numerami albumów dla pojedynczego użytkownika
  			var albumId = {}; //obiekt przechowujący numer uzytkownika i tablicę z numerami jego albumów
  			for (i in data){
  				if (userList1[j] == data[i].userId){
  					albums = albums + data[i].id + ",";
  				}
  			}
  			albums = albums.toString();
  			albums = albums.split(',');
  			albumId = {
  			"userId": userList1[j],
  			"photo" : albums
  			};
  			userAlbum.push(albumId);//tablica złożona z obiektów składającyh się z numeru uzytkownika i tablicy z jego albumami
  		}
  		if (userAlbum[0] != undefined){
  			$.ajax({
  			url: root + '/photos',
  			method: 'GET'
  			}).then(function(data){	
  				id = photoClause(data, userAlbum);//tablica z numerami uzytkowinków spełnijących photoClause
  				if (id[0] != undefined){
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
  						var a = window.document.createElement('a');
						a.href = window.URL.createObjectURL(new Blob([contain], {type: 'text/json'}));
						a.download = 'users.json';
						document.body.appendChild(a)
						a.click();
						document.body.removeChild(a)
  					});
  				};		
  			});
  		};
  		});
 	};
});
