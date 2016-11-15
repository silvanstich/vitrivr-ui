videojs.options.flash.swf = "video-js.swf";
var shotStartTime = 0;
var topLevels = {};
var centers = {};

function setUpCategories(){
	var ks = Object.keys(categoryConfig);
	var sliderBox = $(".weight-slider-box").first();

	for (var i = 0, len = ks.length; i < len; i++) {
  		var key = ks[i];
  		ScoreWeights[key] = categoryConfig[key]['defaultValue'] || 0;
  		sliderBox.append('<div class="weight-slider"><label for="' +
  			key + '-weight">' +
  			(categoryConfig[key]['displayName'] || key) + ':</label><div id="' +
  			key + '-weight" ></div></div>');

  		noUiSlider.create($('#' + key + '-weight').get(0), {
			start : 100 * ScoreWeights[key],
			step : 1,
			range : {
				'min' : 0,
				'max' : 100
			},
			format : wNumb({
				decimals : 0
			})
		});

		$('#' + key + '-weight').get(0).noUiSlider.on('change', buildSliderCallback(key));
	}
}

function buildSliderCallback(key){

	return function(_, __, val){
		if(val > ScoreWeights[key]){
			readSliders();
			var sum = sumWeights();
			if(sum > 100){
				var scale = (100 - val) / (sum - ScoreWeights[key]);
				var ks = Object.keys(categoryConfig);
				for (var i = 0, len = ks.length; i < len; i++) {
  					var k = ks[i];
  					if(k != key){
  						$('#' + k + '-weight').get(0).noUiSlider.set(ScoreWeights[k] * scale);
  					}
  				}
			}
		}
		updateScores(true);
	};

}

function remove_element(arr, val) {
    var i = arr.indexOf(val);
         return i>-1 ? arr.splice(i, 1) : [];
  };


function updateSliders() {

	readSliders();

	normalizeScoreWeights();

	updateScores(true);

}

function readSliders() {

	var ks = Object.keys(categoryConfig);
	for (var i = 0, len = ks.length; i < len; i++) {
  		var key = ks[i];
  		ScoreWeights[key] = $('#' + key + '-weight').get(0).noUiSlider.get();
  	}

}

function getFeatureNamesForExplorative(){
	var query = {
		queryType: 'getFeatureNames'
	}
	oboe({
		url : cineastHost, //see config.js
		method : 'POST',
		body : "query=" + JSON.stringify(query),
		headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
	}).done(function(data){
		console.log('request done.')
		var response = data.array[0].response;
		for(var i = 0; i < response.length; i++){
			var text = response[i].text;
			var id = response[i].id;
			var topLevel = response[i].topLevel;
			topLevels[id] = topLevel;
			centers[id] = {x: response[i].x, y: response[i].y};
			var $option = $('<option/>', {id: id, text: text, value: id});
			$('#selectFeature').append($option);
		}
		  var select = $('select').material_select();
	}).fail(function(data){
		console.log("FAIL");
		console.log(data);
	});
}

$(function() {
	/*  sliders  */
	noUiSlider.create($('#draw-radius').get(0), {
		start : 50,
		step : 1,
		range : {
			'min' : 1,
			'max' : 100
		},
		format : wNumb({
			decimals : 0
		})
	});

	$('#draw-radius').get(0).noUiSlider.on('change', function(e) {
		var width = e[0];
		for (el in shotInputs) {
			shotInputs[el].color.setLineWidth(width);
		}

	});

	setUpCategories();
	getFeatureNamesForExplorative();

	/*  color picker  */
	$("#colorInput").spectrum({
		showPaletteOnly : true,
		togglePaletteOnly : true,
		togglePaletteMoreText : 'more',
		togglePaletteLessText : 'less',
		color : '#000',
		palette : [["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"], ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#0101ff", "#90f", "#f0f"], ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"], ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"], ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"],
 [
 "#b78a85",
 "#7f534b",
 "#997657",
 "#7d7060",
 "#694e2a",
 "#747e43",
 "#b3c65e",
 "#66aa83",
 ],["#88d4e9",
 "#5d6c8b",
 "#4a1ecf",
 "#b890bd",
 "#431012"
		]],
		hideAfterPaletteSelect: true, //possibly remove this again
		change : function(color) {
			for (el in shotInputs) {
				shotInputs[el].color.setColor(color);
			}
		}
	});

	/*  context menu  */
	context.init({
		compress : true
	});


	/*  buttons  */
	$("#btnAddCanvas").click(function(e) {
		e.preventDefault();
		newShotInput();
	});

	$("#multiple-input").click(function(event) {
		var enteredTags = multiple.value;
		tags["concepts"] = [];
		console.log(tags["concepts"]);
		console.log(enteredTags);
		for (var i = 0; i < enteredTags.length; i++) {
			tags.concepts.push(enteredTags[i].id);
			console.log(tags["concepts"]);
		}
  });

	$('#btnShowSidebar').click(function() {
		if ($('#sidebar').hasClass('open') && $('#sidebarextension').hasClass('open')) {
			$('#sidebarextension').removeClass('open');
			$('#btnShowSidebar').removeClass('open');

		}
		$('#sidebar').toggleClass('open');
		$('body').toggleClass('push-toright');
	});

	$('#btnShowTopbar').click(function() {
		$('body').toggleClass('push-tobottom');
		$('#btnShowTopbar').toggleClass('topOpen');
		$('#btnShowSidebar').toggleClass('topOpen');
		$('#sidebarextension').toggleClass('topOpen');
		$('#topbar').toggleClass('open');
	});

	$('#colorsketchbutton').on('click', function(event) {
		$('.motionsketch').hide();
		$('.objectsketch').hide();
		$('#query-container-pane').show();
		$('#search-button').show();
		$('#btnAddCanvas').show();
		$('#color-tool-pane').show();
		$('#motion-tool-pane').hide();
		$('.explore').hide();
		$('#results').show();
		$('#sequence-segmentation-button').show();
		$('#sidebarextension').removeClass('open');
		$('#btnShowSidebar').removeClass('open');
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
	});

	$('#motionsketchbutton').on('click', function(event) {
		$('.motionsketch').show();
		$('.objectsketch').show();
		$('#query-container-pane').show();
		$('#search-button').show();
		$('#btnAddCanvas').show();
		$('#color-tool-pane').hide();
		$('#motion-tool-pane').show();
		$('.explore').hide();
		$('#results').show();
		$('#sequence-segmentation-button').show();
		$('#sidebarextension').removeClass('open');
		$('#btnShowSidebar').removeClass('open');
		$(this).siblings().removeClass('active');
		$(this).addClass('active');

	});



	$('#filterbutton').on('click', function(event) {
		$('.motionsketch').show();
		$('.objectsketch').show();
		$('.audiosketch').hide();
		$('#color-tool-pane').hide();
		$('#sidebarextension').addClass('open');
		$('#btnShowSidebar').addClass('open');
		$('#concept-selection').hide();
		$('#filter-selection').show();
		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
	});

	$('#search-button').click(function(){
		search();
//		$('#btnShowSidebar').click();
	});

	$('#sequence-segmentation-button').click(sequenceSegmentation);

	$('#rf-button').click(function(){
		search(-1, rf_positive, rf_negative);
	});

	$('#replay-at-position-button').click(function(){
		videojs('videoPlayer').currentTime(shotStartTime);
		videojs('videoPlayer').play();
	});

	$('#new-filter-button').click(function() {
		if(!$('#new_filter').get(0).validity.patternMismatch){
			var filterName = $('#new_filter').val();
			addResultSetFilter('v' + filterName);
			$('#new_filter').val('');
		}

	});

	$('#fgbgswitch-button').click(function(){
		this.textContent = (this.textContent == "Foreground") ? "Background" : "Foreground";
		this.className = (this.className == "waves-effect waves-light btn btn-small red") ? "waves-effect waves-light btn btn-small green" : "waves-effect waves-light btn btn-small red";
		for(var key in shotInputs){
			shotInputs[key].motion.switchFgBg();
		}
	});

	$('#explorebutton').click(function(){
		$('.motionsketch').hide();
		$('.objectsketch').hide();
		$('#color-tool-pane').hide();
		$('#motion-tool-pane').hide();
		$('#query-container-pane').hide();
		$('#btnAddCanvas').hide();
		$('#search-button').hide();
		$('.explore').show();
		$('#results').hide();
		$('#sequence-segmentation-button').hide();
		$('#sidebarextension').removeClass('open');
		$('#btnShowSidebar').removeClass('open');
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
	});

	/*  add first canvas  */
	newShotInput();

	/* video player */
	videojs('videoPlayer').on('loadeddata', function() {
		videojs('videoPlayer').currentTime(shotStartTime);
		videojs('videoPlayer').play();
	});

	$('#btnShowSidebar').click();
	setTimeout(function(){$('#btnShowTopbar').click();}, 500);

});
