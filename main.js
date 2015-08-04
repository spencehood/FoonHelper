$(document).ready( function() {
	songFilterer.init();
});

//var songs = data.songs;
var songs = [];
var notmissing = data.singers;
var localApiData;

var songFilterer = {

	init:function() {

		var self = this;

		// this.songs = [];
		// this.notmissing = data.singers;
		// this.localApiData;

		$.get("https://api.myjson.com/bins/19lrg", this.handleDataLoaded);

		setTimeout(function() {
			console.log(localApiData);

			self.eventBinder();
		}, 700);

		setTimeout(function() {
			self.songFilter();
		}, 800);
		
	},

	handleDataLoaded: function(apidata, textStatus, jqXHR) {

		for (var i = 0; i < apidata.singers.length; i++) { // Eventually only call this when the 'edit singer' form is loaded
			var singer = apidata.singers[i];
			$('#chooseSinger').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
		}
		for (var i = 0; i < apidata.songs.length; i++) { // Eventually only call this when the 'edit song' form is loaded
			var song = apidata.songs[i];
			$('#chooseSong').append('<option>' + song.title + '</option>');
		}
		localApiData = apidata;

		for (var i = 0; i < localApiData.singers.length; i++) { // Populating dropdowns in forms with singers pulled from db
			var singer = localApiData.singers[i];
			var lastInitial = singer.lastname.charAt(0) + '.';
			$('#singerform ul').append('<li><input type="checkbox" value="' + singer.firstname + ' ' + singer.lastname + '">'
				+ singer.firstname + ' ' + lastInitial + '</input></li>');
			$('#addSoloist').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
			$('#addUnderstudy').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
			$('#addDuetist').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
			$('#addDuetUnderstudy').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
			$('#addBeatboxer').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
			$('#addBeatboxUnderstudy').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');

			$('#editSoloist').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
			$('#editUnderstudy').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
			$('#editDuetist').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
			$('#editDuetUnderstudy').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
			$('#editBeatboxer').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
			$('#editBeatboxUnderstudy').append('<option>' + singer.firstname + ' ' + singer.lastname + '</option>');
		}
		for (var i = 0; i < localApiData.songs.length; i++) {
			var song = localApiData.songs[i];
			songs.push(song);
		}

	},

	eventBinder: function() {

		var self = this;

		$('#singerform input:checkbox').on('change', $.proxy(this.songFilter, this));

		$('#factorform input:checkbox').on('change', $.proxy(this.songFilter, this));

		$('#addSongLaunch').on('click', function() {
			$('#add-song').toggleClass('none');
			$('#edit-song').addClass('none');
			$('#add-singer').addClass('none');
			$('#edit-singer').addClass('none');
		});

		$('#editSongLaunch').on('click', function() {
			$('#add-song').addClass('none');
			$('#edit-song').toggleClass('none');
			$('#add-singer').addClass('none');
			$('#edit-singer').addClass('none');
		});

		$('#addSingerLaunch').on('click', function() {
			$('#add-song').addClass('none');
			$('#edit-song').addClass('none');
			$('#add-singer').toggleClass('none');
			$('#edit-singer').addClass('none');
		});

		$('#editSingerLaunch').on('click', function() {
			$('#add-song').addClass('none');
			$('#edit-song').addClass('none');
			$('#add-singer').addClass('none');
			$('#edit-singer').toggleClass('none');
		});

		$('#addSongBtn').on('click', function() {
			var songProps = {}
			// add to songProps as we move along these assignments
			var title = $('#addSongTitle').val();
			var arranger = $('#addArranger').val();
			var key = $('#addKey').val();
			var firstchord = $('#addFirstChord').val();
			var soloist, soloistVal = $('#addSoloist').val();
				if (soloistVal != 'Soloist') { soloist = soloistVal; }
			var understudy;
				if ($('#addUnderstudy').val() == 'Understudy') { understudy = null; } else { understudy = $('#addUnderstudy').val(); }
			var duetist;
				if ($('#addDuetist').val() == '2nd Soloist') { duetist = null; } else { duetist = $('#addDuetist').val(); }
			var duetunderstudy;
				if ($('#addDuetUnderstudy').val() == '2nd Soloist Understudy') { duetunderstudy = null; } else { duetunderstudy = $('#addDuetUnderstudy').val(); }
			var beatboxer;
				if ($('#addBeatboxer').val() == 'Beatbox') { beatboxer = null; } else { beatboxer = $('#addBeatboxer').val(); }
			var beatboxunderstudy;
				if ($('#addBeatboxUnderstudy').val() == 'Backup Beatbox') { beatboxunderstudy = null; } else { beatboxunderstudy = $('#addBeatboxUnderstudy').val(); }
			var isappropriate = true;
			//$('#addInappropriate').is(':checked') ? var isappropriate = false : var isappropriate = true;
			if ($('#addInappropriate').is(':checked')) { isappropriate = false; }
			var isgroup = false; if ($('#addGroup').is(':checked')) { isgroup = true; }
			var isxmas = false; if ($('#addXmas').is(':checked')) { isxmas = true; }

			self.addSongToApi(title, arranger, key, firstchord, soloist, understudy, duetist, duetunderstudy, beatboxer, beatboxunderstudy, isappropriate, isgroup, isxmas);
		});

		$('#chooseSong').on('change', $.proxy(this.populateSongForm, this));

		$('#editSongBtn').on('click', function() {
			var title = $('#chooseSong').val();
			$.proxy(this.editSongInApi(title), this);
		});

		$('#deleteSongBtn').on('click', $.proxy(this.removeSongFromApi, this));

		$('#addSingerBtn').on('click', function() {
			var firstname = $('#addFirstName').val();
			var lastname = $('#addLastName').val();
			var vocalpart = $('#addVocalPart').val();
			$.proxy(self.addSingerToApi(firstname, lastname, vocalpart), self)
		});

		$('#chooseSinger').on('change', $.proxy(this.populateSingerForm, this));

		$('#editSingerBtn').on('click', function() {
			var fullname = $('#chooseSinger').val();
			$.proxy(self.editSingerInApi(fullname), this);
		});

		$('#deleteSingerBtn').on('click', $.proxy(this.removeSingerFromApi, this));

		$('.formtext').focus( $.proxy(this.labelFloat, this) );
		$('.formtext').focusout( $.proxy(this.labelSink, this) );

	},

	labelFloat: function(e) {

		var inputId = e.target.id;
		$('#' + inputId + ' + label').animate({top: '-8px' }, { duration: 400, complete: function() {
			$('#' + inputId + ' + label').css('color', 'black');
		}});

	},

	labelSink: function(e) {
		// use event.current target to find id here
		var inputId = e.target.id;
		if ($('#' + inputId).val() == '') {
			$('#' + inputId + ' + label').animate({top: '15px' }, { duration: 400 });
		} else { }
		$('#' + inputId + ' + label').css('color', 'grey');

	},

	songFilter:function() {

		//var self = this;
		//if ($('input.sensitive').closest('div'))

		var possible = [];
		var impossible = [];


		var missing = {}; // Object that will contain all missing members
		$('#singerform input:checked').each(function() {
			value = $(this).val();
			missing[value] = true; // Add every checked member to 'missing'
		});

		this.vocalPartCheck();

		var sensitive = false;
		if ($('#sensitive').is(':checked')) {
			sensitive = true;
		}

		for (var i = 0; i < songs.length; i++) { // Looping through every song in data.js

			var currentSong = songs[i];
			currentSong.understudyflag = false;
			currentSong.bbflag = false;

			// if (sensitive == true && !song.isappropriate) {
			// 	continue;
			// }

			if (currentSong.beatboxer && missing[currentSong.beatboxer] && missing[currentSong.beatboxunderstudy]) {
				currentSong.bbflag = true;
			}
			if (sensitive && !currentSong.isappropriate) {
				console.log(currentSong.title);
				continue;
			}
			if (currentSong.isgroup) { // If it's a group song
				possible.push(currentSong);
				// console.warn('thinks it is a group song');
				continue; // will immediately move to the next iteration of the loop, be careful if there's extra functionality at the bottom here
			} 
			else if (!currentSong.soloist) { // If soloist is null
				// console.warn('thinks soloist is null');
				// break;
			}
			else if (currentSong.soloist && !missing[currentSong.soloist]) { // If we aren't missing the soloist
				possible.push(currentSong);
				// console.warn('thinks we have the soloist');
			} 
			else if (currentSong.understudy && !missing[currentSong.understudy]) { // If we have the understudy
				currentSong.understudyflag = true;
				possible.push(currentSong);
				// console.warn('thinks we have the understudy');
			}
		}

		this.resultsRender(possible);
		//console.log('Final possible', possible);
	},

	resultsRender: function(possible) {
		//console.log('render called');
		var self = this;
		var song;
		var html = [];
		for (var i = 0; i < possible.length; i++) {
			song = possible[i];
			
			// if (song.title.length > 10) {
			// 	var shortTitle = song.title.substring(0, 10) + '...';
			// 	console.log(shortTitle);
			// }

			// if (shortTitle) {
			// 	var $song = $('<div class="result"><h1>' + shortTitle + '</h1>' + song.key + '</div>');
			// } else {
				var $song = $('<div class="result"><h1>' + song.title + '</h1> ' + song.key + '</div>');
			// }
			
			if (song.understudyflag) {
				$song.addClass('us');
				$song.append(' - (' + song.understudy + ')');
			}
			if (song.bbflag) {
				$song.addClass('bb');
			}
			html.push($song);

		}

		$('#results').html(html);

		$('.result').on('click', function() {
			var label = $(this).text();
			var newlabel = label.replace(/[^\s]+$/, ''); // Turn the song card text into a string and pop off the key at the end to get just the title
			newlabel = $.trim(newlabel);
			var thisSong = self.getSongByTitle(newlabel);
			$('.songInfo').html(
				'<h3>' + thisSong.title + '</h3><table>' +
				'<tr><td>Arranged by: </td><td>' + thisSong.arranger + '</td></tr>' + 
				'<tr><td>Key: </td><td>' + thisSong.key + '</td></tr>' +
				'<tr><td>First chord: </td><td>' + thisSong.firstchord + '</td></tr>' +
				'<tr><td>Group song: </td><td>' + thisSong.isgroup + '</td></tr>' + 
				'<tr><td>Soloist: </td><td>' + thisSong.soloist + '</td></tr>' + 
				'<tr><td>Understudy: </td><td>' + thisSong.understudy + '</td></tr>' +
				'<tr><td>2nd soloist: </td><td>' + thisSong.duetist + '</td></tr>' +
				'<tr><td>Beatbox: </td><td>' + thisSong.beatboxer + '</td></tr>' +
				'<tr><td>Backup beatbox: </td><td>' + thisSong.beatboxunderstudy + '</td></tr>' +
				'<tr><td>Appropriate for all audiences: </td><td>' + thisSong.isappropriate + '</td></tr></table>'
			).removeClass('none');
		});
	},

	vocalPartCheck: function() {

		var t1 = 0; var t2 = 0; var br = 0; var bs = 0;

		$('#singerform input:not(:checked)').each(function() {
			value = $(this).val();
			for (var i = 0; i < self.notmissing.length; i++) { // Go through all unchecked members (members that WILL be at the show)
				thisSinger = self.notmissing[i];
				if (thisSinger.firstname + ' ' + thisSinger.lastname == value) { // Add to variables based on how many of each vocal part we have
					if (thisSinger.vocalpart == 'Tenor I') { t1 += 1; }
					else if (thisSinger.vocalpart == 'Tenor II') { t2 += 1; }
					else if (thisSinger.vocalpart == 'Baritone') { br += 1; }
					else if (thisSinger.vocalpart == 'Bass') { bs += 1; }
				}
			}
		});

		console.log(t1, t2, br, bs);
		if (!t1 || t2 == 0 || br == 0 || bs == 0) {
			alert('Must have at least one singer from each vocal part');
			$('.result').css('background', 'lightgrey');
		}
	},

	getData: function() {

		return $.get("https://api.myjson.com/bins/19lrg", function(apidata, textStatus, jqXHR) {
			console.warn('Success!', apidata);
			var newestdata = apidata;
			var self = this;
		});
		// console.log('still in getdata,', data);
	},

	getSongByTitle: function(title) {
		for (var i = 0; i < localApiData.songs.length; i++) {
			var song = localApiData.songs[i];
			if (title == song.title) {
				return song;
			}
		}
	},

	getSingerByName: function(fullname) {
		for (var i = 0; i < localApiData.singers.length; i++) {
			var singer = localApiData.singers[i];
			if (fullname == singer.firstname + ' ' + singer.lastname) {
				return singer;
			}
		}
	},

	addSongToApi: function(title, arranger, key, firstchord, soloist, understudy, duetist, duetunderstudy, beatboxer, beatboxunderstudy, isappropriate, isgroup, isxmas) {


		// this.getData().success( function() {

			//}0);

		$.get("https://api.myjson.com/bins/19lrg", function(apidata, textStatus, jqXHR) { // Fetching api data from myjson site
			console.warn('Data retrieved:', apidata);
			console.log(soloist);
			apidata.songs.push( // Adding in the new singer object
				{"title": title, "arranger": arranger, "key": key, "firstchord": firstchord, "soloist": soloist, "understudy": understudy,
				"duetist": duetist, "duetunderstudy": duetunderstudy, "beatboxer": beatboxer, "beatboxunderstudy": beatboxunderstudy,
				"isappropriate": isappropriate, "isgroup": isgroup, "isxmas": isxmas}
			);

			var jsonString = JSON.stringify(apidata);
			$.ajax({
			    url: "https://api.myjson.com/bins/19lrg",
			    type: "PUT",
			    data: jsonString,
			    contentType: "application/json; charset=utf-8",
			    dataType: "json",
			    success: function(data, textStatus, jqXHR){
			    	alert('Update complete. Refresh the page to see new data.');
			    }
			});

		});

	},

	populateSongForm: function() {
		var song = this.getSongByTitle($('#chooseSong').val());
		$('#editSongTitle').val(song.title);
		$('#editArranger').val(song.arranger);
		$('#editKey').val(song.key);
		$('#editFirstChord').val(song.firstchord);
		$('#editSoloist').val(song.soloist);
		$('#editUnderstudy').val(song.understudy);
		$('#editDuetist').val(song.duetist);
		$('#editDuetUnderstudy').val(song.duetunderstudy);
		$('#editBeatboxer').val(song.beatboxer);
		$('#editBeatboxUnderstudy').val(song.beatboxunderstudy);
		if (song.isappropriate == false) { $('#editInappropriate').attr('checked', true); } else { $('#editInappropriate').attr('checked', false); }
		if (song.isgroup) { $('#editGroup').attr('checked', true); } else { $('#editGroup').attr('checked', false); }
		if (song.isxmas) { $('#editXmas').attr('checked', true); } else { $('#editXmas').attr('checked', false); }
	},

	editSongInApi: function(title) {
		console.log(localApiData);
		for (var i = 0; i < localApiData.songs.length; i++) {
			var song = localApiData.songs[i];
			if (song.title == title) {
				song.title = $('#editSongTitle').val();
				song.arranger = $('#editArranger').val();
				song.key = $('#editKey').val();
				song.firstchord = $('#editFirstChord').val();
				song.soloist = $('#editSoloist').val();
				song.understudy = $('#editUnderstudy').val();
				song.duetist = $('#editDuetist').val();
				song.duetunderstudy = $('#editDuetUnderstudy').val();
				song.beatboxer = $('#editBeatboxer').val();
				song.beatboxunderstudy = $('#editBeatboxUnderstudy').val();
				song.isappropriate = !$('#editInappropriate').val();
				song.isgroup = $('#editGroup').val();
				song.isxmas = $('#editXmas').val();
			}
		}
		console.log(localApiData);

		// var jsonString = JSON.stringify(localApiData);
		// $.ajax({
		//     url: "https://api.myjson.com/bins/19lrg",
		//     type: "PUT",
		//     data: jsonString,
		//     contentType: "application/json; charset=utf-8",
		//     dataType: "json",
		//     success: function(data, textStatus, jqXHR){
		//     	console.log('Update complete.');
		//     	alert('Update complete. Refresh the page to see new data.');
		//     }
		// });

	},

	removeSongFromApi: function() {

		var confirm = window.confirm('Are you sure you want to delete this song?\nPress "ok" or "cancel"');
		if (confirm) {

			var chosenSong = $('#chooseSong').val();
			var self = this;

			$.get("https://api.myjson.com/bins/19lrg", function(apidata, textStatus, jqXHR) { // Fetching api data from myjson site
				var counter = -1;
				for (var i = 0; i < apidata.songs.length; i++) { // Eventually only call this when the 'edit song' form is loaded
					
					var song = apidata.songs[i];
					counter++;
					if (song.title == chosenSong) {
						console.log(counter);
						apidata.songs.splice(counter, 1);
						console.log(apidata.songs);
					}

				}

				var jsonString = JSON.stringify(apidata);
				$.ajax({
				    url: "https://api.myjson.com/bins/19lrg",
				    type: "PUT",
				    data: jsonString,
				    contentType: "application/json; charset=utf-8",
				    dataType: "json",
				    success: function(data, textStatus, jqXHR){
				    	console.log('Update complete.');
				    	alert('Update complete. Refresh the page to see new data.');
				    }
				});


			});

		} else { return; }

	},

	addSingerToApi: function(firstname, lastname, vocalpart) {

		$.get("https://api.myjson.com/bins/19lrg", function(apidata, textStatus, jqXHR) { // Fetching api data from myjson site
			console.warn('Data retrieved:', apidata);

			apidata.singers.push( // Adding in the new singer object
				{"firstname": firstname, "lastname": lastname, "vocalpart": vocalpart}
			);

			var jsonString = JSON.stringify(apidata);
			$.ajax({
			    url: "https://api.myjson.com/bins/19lrg",
			    type: "PUT",
			    data: jsonString,
			    contentType: "application/json; charset=utf-8",
			    dataType: "json",
			    success: function(data, textStatus, jqXHR){
			    	console.log('Update complete.');
			    	// alert('Update complete. Refresh the page to see new data.');
			    }
			});

			setTimeout(function() {
				location.reload(); // Refresh page to reflect new changes
			}, 1500);

		});

	},

	populateSingerForm: function() {
		var singer = this.getSingerByName($('#chooseSinger').val());
		$('#editFirstName').val(singer.firstname);
		$('#editLastName').val(singer.lastname);
		$('#editVocalPart').val(singer.vocalpart);
	},

	editSingerInApi: function(fullname) {

		for (var i = 0; i < localApiData.singers.length; i++) {
			var singer = localApiData.singers[i];
			if (fullname == singer.firstname + ' ' + singer.lastname) {
				singer.firstname = $('#editFirstName').val();
				singer.lastname = $('#editLastName').val();
				singer.vocalpart = $('#editVocalPart').val();
			}
		}
		console.log(localApiData);

		var jsonString = JSON.stringify(localApiData);
		$.ajax({
		    url: "https://api.myjson.com/bins/19lrg",
		    type: "PUT",
		    data: jsonString,
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    success: function(data, textStatus, jqXHR){
		    	console.log('Update complete.');
		    	alert('Update complete. Refresh the page to see new data.');
		    }
		});

	},

	removeSingerFromApi: function() {

		var confirm = window.confirm('Are you sure you want to delete this singer?\nPress "ok" or "cancel"');
		if (confirm) {

			var chosenSinger = $('#chooseSinger').val();
			var self = this;

			$.get("https://api.myjson.com/bins/19lrg", function(apidata, textStatus, jqXHR) { // Fetching api data from myjson site
				var counter = -1;
				for (var i = 0; i < apidata.singers.length; i++) { // Eventually only call this when the 'edit singer' form is loaded
					
					var singer = apidata.singers[i];
					counter++;
					if (singer.firstname + ' ' + singer.lastname == chosenSinger) {
						console.log(counter);
						apidata.singers.splice(counter, 1);
						console.log(apidata.singers);
					}

				}

				var jsonString = JSON.stringify(apidata);
				$.ajax({
				    url: "https://api.myjson.com/bins/19lrg",
				    type: "PUT",
				    data: jsonString,
				    contentType: "application/json; charset=utf-8",
				    dataType: "json",
				    success: function(data, textStatus, jqXHR){
				    	console.log('Update complete.');
				    	// alert('Update complete. Refresh the page to see new data.');
				    }
				});

			});

			setTimeout(function() {
				location.reload(); // Refresh page to reflect new changes
			}, 1500);

		} else { return; }

	}

}







		// $.ajax({
		// 	type: 'GET',
		// 	url: 'https://api.myjson.com/bins/19lrg',
		// 	data: { sAMAccountName: firstname + "." + lastname },
		// 	dataType: 'json',
		// 	success: function(data) {
		// 	   console.log(data);
		// 	},
		// 	error: function(e) {
		// 	   console.error(data);
		// 	}
		// });
		
		
		// $.ajax({
		//     url: "https://api.myjson.com/bins/19lrg",
		//     type: "PUT",
		//     data: '{"singers": {"firstname": "Spence", "lastname": "Hood", "vocalpart": "Tenor I" }}',
		//     contentType: "application/json; charset=utf-8",
		//     dataType: "json",
		//     success: function(data, textStatus, jqXHR){
		//     	console.log(data);
		//     }
		// });

	//  $.ajax({
		// 	type: 'GET',
		// 	url: 'https://api.myjson.com/bins/19lrg',
		// 	data: { sAMAccountName: firstname + "." + lastname },
		// 	dataType: 'json',
		// 	success: function(data) {
		// 	   console.log(data);
		// 	},
		// 	error: function(e) {
		// 	   console.error(data);
		// 	}
		// });

		// $.ajax({
		// 	type: 'POST',
		// 	url: 'https://api.myjson.com/bins/19lrg',
		// 	data: '{ "firstname": "Bugs", "lastname": "Bunny", "vocalpart": "Bass" }',
		// 	contentType: "application/json; charset=utf-8",
		// 	dataType: 'json',
		// 	success: function(data) {
		// 	   console.log(data);
		// 	},
		// 	error: function(e) {
		// 	   console.error(data);
		// 	}
		// });
			 
// 	});

// });
