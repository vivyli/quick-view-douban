// ==UserScript==
// @name           quick-view-douban
// @namespace      http://vivyli.com
// @description    see douban book movie music in every webpage by selecting text
// @include 	   *
// ==/UserScript==


var apikey = '0c088077ba8a630f241981672f9f292d';

var txtSelection ;
var intialized = false;
var imgLookup;
var isBookClicked = false;
var isMovieClicked = false;
var isMusicClicked = false;
var q = null;

document.addEventListener('mousedown', clean, false);
document.addEventListener('mouseup', showIcon, false);

function clean(event)
{
	var divDic = getId('divDic');
	var divLookup = getId('divLookup');
	
	if(divDic)
	{
		if(!clickedInsideID(event.target,'divDic'))
			divDic.parentNode.removeChild(divDic);
	}	
	
	if(divLookup)
		divLookup.parentNode.removeChild(divLookup);
}

function showIcon(event)
{
	if (!intialized)
	{
		images();
		css();
		intialized = true;
	}
	var divDic = getId('divDic');
	var divLookup = getId('divLookup');

	if (!clickedInsideID(event.target, 'divDic'))
		txtSelection = getSelection(event);
	else
		return;
	if (txtSelection == '')
	{
		return;
	}else
	{
		q = txtSelection;
	}
	divLookup = createElement('div', {id: 'divLookup', style: 'top:'+(event.clientY+window.pageYOffset+10)+'px; left:'+(event.clientX + window.pageXOffset + 10) + 'px;'});
	divLookup.appendChild(imgLookup.cloneNode(false));
	divLookup.addEventListener('mouseover', showDouban, false);
	document.body.appendChild(divLookup);	
}

function showDouban(event)
{
	var divResult = null;
	var divDic = getId('divDic');
	var divLookup = getId('divLookup');
	var top = divLookup.style.top;
	var left = divLookup.style.left;

	divDic = createElement('div', {id:'divDic'});
	divDic.style.top = top;
	divDic.style.left = left;
	document.body.appendChild(divDic);
	
	var bookDiv = createElement('div', {id: 'bookDiv', title: 'book'}, null, null);
	var bookClickDiv = createElement('div', {id: 'bookClickDiv'},'mouseup showDoubanBook false', '+豆瓣读书');
	bookDiv.appendChild(bookClickDiv);
	divDic.appendChild(bookDiv);

	var movieDiv = createElement('div', {id: 'movieDiv', title: 'movie'}, null, null);
	var movieClickDiv = createElement('div', {id: 'movieClickDiv'},'mouseup showDoubanMovie false', '+豆瓣电影');
	movieDiv.appendChild(movieClickDiv);
	divDic.appendChild(movieDiv);

	var musicDiv = createElement('div', {id: 'musicDiv', title: 'music'}, null, null);
	var musicClickDiv = createElement('div', {id: 'musicClickDiv'},'mouseup showDoubanMusic false', '+豆瓣音乐');
	musicDiv.appendChild(musicClickDiv);
	divDic.appendChild(musicDiv);

}
function showDoubanBook(event)
{
	if (isBookClicked == false)
	{
		getId('bookClickDiv').innerHTML = '-豆瓣读书 loading...';
		isBookClicked = true;
		showBookInfo();
	}
	else if(isBookClicked == true)
	{
		getId('bookClickDiv').innerHTML = '+豆瓣读书';
		cleanBook();
		//getId('bookDiv')
		isBookClicked = false;
	}
}
function cleanBook()
{
	var bookInfo = getId('bookInfo');
	var morebooks = getId('morebooks');
	if (bookInfo != null)
		bookInfo.parentNode.removeChild(bookInfo);
	if (morebooks != null)
		morebooks.parentNode.removeChild(morebooks);
}
function showBookInfo()
{
	var bookurl = 'http://api.douban.com/book/subjects?q=' + q +'&apikey=' + apikey;
	var moreurl = 'http://book.douban.com/subject_search?search_text=' + q + '&cat=1001';
	GM_xmlhttpRequest({
		method: 'GET',
		url: bookurl,
		onload: function(resp)
		{
			var book = parseBook(resp.responseText);
			var bookInfo = createElement('div', {id : 'bookInfo'}, null, book);
			getId('bookDiv').appendChild(bookInfo);
			var more = createElement('div', {id:'more'}, null, null);
			getId('bookDiv').appendChild(more);
			more.appendChild(createElement('a', {id: 'morebooks',href: moreurl, target:'_blank'}, null, '--更多书籍--'));
			getId('bookClickDiv').innerHTML = '-豆瓣读书';
		}
	});
}
function parseBook(text)
{
	return parse(text, 'Book');
}
// Douban Movie
function showDoubanMovie(event)
{
	if (isMovieClicked == false)
	{
		getId('movieClickDiv').innerHTML = '-豆瓣电影 loading...';
		isMovieClicked = true;
		showMovieInfo();
	}
	else if(isMovieClicked == true)
	{
		getId('movieClickDiv').innerHTML = '+豆瓣电影';
		cleanMovie();
		//getId('bookDiv')
		isMovieClicked = false;
	}
}
function cleanMovie()
{
	var movieInfo = getId('movieInfo');
	var moremovies = getId('moremovies');
	if (movieInfo != null)
		movieInfo.parentNode.removeChild(movieInfo);
	if (moremovies != null)
		moremovies.parentNode.removeChild(moremovies);
}
function showMovieInfo()
{
	//alert(q);
	var movieurl = 'http://api.douban.com/movie/subjects?q=' + q +'&apikey=' + apikey;
	var moreurl = 'http://movie.douban.com/subject_search?search_text=' + q + '&cat=1002';
	GM_xmlhttpRequest({
		method: 'GET',
		url: movieurl,
		onload: function(resp)
		{
			var movie = parseMovie(resp.responseText);
			var movieInfo = createElement('div', {id : 'movieInfo'}, null, movie);
			getId('movieDiv').appendChild(movieInfo);
			var more = createElement('div', {id:'more'}, null, null);
			getId('movieDiv').appendChild(more);
			more.appendChild(createElement('a', {id: 'moremovies',href: moreurl, target:'_blank'}, null, '--更多电影--'));
			getId('movieClickDiv').innerHTML = '-豆瓣电影';
		}
	});
}
function parseMovie(text)
{
	return parse(text, 'Movie');
}
//Douban Music
function showDoubanMusic(event)
{
	if (isMusicClicked == false)
	{
		getId('musicClickDiv').innerHTML = '-豆瓣音乐 loading...';
		isMusicClicked = true;
		showMusicInfo();
	}
	else if(isMusicClicked == true)
	{
		getId('musicClickDiv').innerHTML = '+豆瓣音乐';
		cleanMusic();
		//getId('bookDiv')
		isMusicClicked = false;
	}
}
function cleanMusic()
{
	var musicInfo = getId('musicInfo');
	var moremusics = getId('moremusics');
	if (musicInfo != null)
		musicInfo.parentNode.removeChild(musicInfo);
	if (moremusics != null)
		moremusics.parentNode.removeChild(moremusics);
}
function showMusicInfo()
{
	var musicurl = 'http://api.douban.com/music/subjects?q=' + q +'&apikey=' + apikey;
	var moreurl = 'http://music.douban.com/subject_search?search_text=' + q + '&cat=1003';
	GM_xmlhttpRequest({
		method: 'GET',
		url: musicurl,
		onload: function(resp)
		{
			var music = parseMusic(resp.responseText);
			var musicInfo = createElement('div', {id : 'musicInfo'}, null, music);
			getId('musicDiv').appendChild(musicInfo);
			var more = createElement('div', {id:'more'}, null, null);
			getId('musicDiv').appendChild(more);
			more.appendChild(createElement('a', {id: 'moremusics',href: moreurl, target:'_blank'}, null, '--更多音乐--'));
			getId('musicClickDiv').innerHTML = '-豆瓣音乐';
		}
	});
}
function parseMusic(text)
{
	return parse(text, 'Music');
}
function parse(text, category)
{
	var cat = category;
	if (category == 'Book')
		cat = '书籍';
	else if (category == 'Music')
		cat = '音乐';
	else if (category == 'Movie')
		cat = '电影';
	var res = '';

	var parser = new DOMParser();
	var dom = parser.parseFromString(text, "text/xml");
	var entities = dom.getElementsByTagName("entry");

	if (entities.length > 0)
	{
		
		var entry = entities[0];

		var id = entry.getElementsByTagName("id")[0].textContent;
		var title = entry.getElementsByTagName("title")[0].textContent;
		var rate = entry.getElementsByTagName('gd:rating')[0].getAttribute('average');
		var total = entry.getElementsByTagName('gd:rating')[0].getAttribute('numRaters');
		
		var attrs = entry.getElementsByTagName('db:attribute');
		if (category == 'Book')
		{
			var author = '';
			var price = '';
			var publisher = '';
			var pubdate = '';
			for (var i = 0; i < attrs.length; i++) 
			{
				var name = attrs[i].getAttribute('name').toString();

				 if (name == "author")
				 {
				 	if (author == '')
				 		author = attrs[i].textContent;
				 	else author += ', ' + attrs[i].textContent;
				 }
				else if (name == 'price')
				{
					price = attrs[i].textContent;
				}
				else if (name == 'publisher')
				{
					publisher = attrs[i].textContent;
				}
				else if (name == 'pubdate')
				{
					pubdate = attrs[i].textContent;
				}

			}
			res = cat + ': ' + title + '<br/>' + 
			'作者: ' + author + '<br/>' + 
			'价格: ' + price + '<br/>' +
			'发行: ' + publisher + '<br/>' +
			'时间: ' + pubdate + '<br/>' +
			'评分: ' + rate + '(共' + total + ' 条评价)';
		
		}
		else if (category == 'Music')
		{
			var singer = '';
			var pubdate = '';
			var publisher = '';

			for (var i = 0; i < attrs.length; i++) 
			{
				var name = attrs[i].getAttribute('name');
				if (name == 'singer')
				{
					if (singer == '')
						singer = attrs[i].textContent;
					else singer += ', '  + attrs[i].textContent;
				}
				else if (name == 'pubdate')
				{
					pubdate = attrs[i].textContent;
				}
				else if (name == 'publisher')
				{
					publisher = attrs[i].textContent;
				}
				
			}
			res = cat + ': ' + title + '<br/>' + 
			'歌手: ' + singer + '<br/>' +
			'时间: ' + pubdate + '<br/>' +
			'发行: ' + publisher + '<br/>' +
			'评分: ' + rate + '(共' + total + ' 条评价)';
			
		}
		else if (category == 'Movie')
		{
			var country = '';
			var director = '';
			var pubdate = '';
			var lang = '';
			var cast = '';
			for (var i = 0; i < attrs.length; i++) 
			{
				var name = attrs[i].getAttribute('name');
				if (name == 'country')
				{
					if (country == '')
						country = attrs[i].textContent;
					else country += ', ' + attrs[i].textContent;
				}
				else if (name == 'director')
				{
					if (director == '')
						director = attrs[i].textContent;
					else director += ', ' + attrs[i].textContent;
				}
				else if (name == 'pubdate')
				{
					pubdate = attrs[i].textContent;
				}
				else if (name == 'language')
				{
					if (lang == '')
						lang = attrs[i].textContent;
					else lang += ', ' + attrs[i].textContent;
				}
				else if (name == 'cast')
				{
					if (cast == '')
						cast = attrs[i].textContent;
					else cast += ', ' + attrs[i].textContent;
				}

			}
			res = cat + ': ' + title + '<br/>' + 
			'导演: ' + director + '<br/>' +
			'主演: ' + cast + '<br/>' +
			'国家: ' + country + '<br/>' +
			'时间: ' + pubdate + '<br/>' +
			'评分: ' + rate + '(共' + total + ' 条评价)';
		}
		
		return res;
	}
	return '对不起，找不到相关的' + cat;
}
function getSelection(event)
{
	var txt = null;

	if (event && event.target.nodeName == 'TextArea')
	{
		txt = event.target.value.substr(event.target.selectionStart, event.target.selectionEnd - event.target.selectionStart);
	}
	else if (window.getSelection)
	{
		txt = window.getSelection();
	}
	else if (document.getSelection)
	{
		txt = window.getSelection();
	}
	else if (document.selection)
	{
		txt = document.selection.createRange().text;
	}
	return txt.toString();

}
function getId(id, parent){
	if(!parent)
		return document.getElementById(id);
	return parent.getElementById(id);	
}
function createElement(type, attrArray, evtListener, html)
{
	var node = document.createElement(type);

	for (var attr in attrArray) if (attrArray.hasOwnProperty(attr)){
		node.setAttribute(attr, attrArray[attr]);
	}

	if(evtListener){
		var a = evtListener.split(' ');
		node.addEventListener(a[0], eval(a[1]), eval(a[2]));
	} 
 
	if(html) 
		node.innerHTML = html;

	return node;
}
function getTag(name, parent){
	if(!parent)
		return document.getElementsByTagName(name);
	return parent.getElementsByTagName(name);
}
function clickedInsideID(target, id) {

	if (target.getAttribute('id')==id)
		return getId(id);
	
	if (target.parentNode) {
		while (target = target.parentNode) {
			try{
				if (target.getAttribute('id')==id)
					return getId(id);
			}catch(e){
			}
		}
	}
	
	return null;
}
function css(){

	var style = createElement('style',{id:'douban-view', type:"text/css"},null,""+	
	
		'#divLookup { background-color:#FFFFFF; color:#000000; position:absolute; padding:3px; z-index:999999999; -moz-border-radius:3px; }'+
		'#divDic { background-color:#000000; color:#FFFFFF; filter: Alpha(opacity=10);opacity:0.7;  position:absolute; min-width:250px; min-height:50px; max-width:100%; padding:5px; font-size:small; text-align:left; z-index:999999999; -moz-border-radius:3px; }' +
		'#more{ text-align: right;}' + 
		'#morebooks{color: #FFAA00}' + 
		'#moremusics{color: #FFAA00}' +
		'#moremovies{color: #FFAA00}'
 	);
	getTag('head')[0].appendChild(style);
}

function images()
{
	imgLookup = createElement('img',{border:0});
	imgLookup.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAADHmlDQ1BJQ0MgUHJvZmlsZQAAeAGFVN9r01AU/tplnbDhizpnEQk+aJFuZFN0Q5y2a1e6zVrqNrchSJumbVyaxiTtfrAH2YtvOsV38Qc++QcM2YNve5INxhRh+KyIIkz2IrOemzRNJ1MDufe73/nuOSfn5F6g+XFa0xQvDxRVU0/FwvzE5BTf8gFeHEMr/GhNi4YWSiZHQA/Tsnnvs/MOHsZsdO5v36v+Y9WalQwR8BwgvpQ1xCLhWaBpXNR0E+DWie+dMTXCzUxzWKcECR9nOG9jgeGMjSOWZjQ1QJoJwgfFQjpLuEA4mGng8w3YzoEU5CcmqZIuizyrRVIv5WRFsgz28B9zg/JfsKiU6Zut5xCNbZoZTtF8it4fOX1wjOYA1cE/Xxi9QbidcFg246M1fkLNJK4RJr3n7nRpmO1lmpdZKRIlHCS8YlSuM2xp5gsDiZrm0+30UJKwnzS/NDNZ8+PtUJUE6zHF9fZLRvS6vdfbkZMH4zU+pynWf0D+vff1corleZLw67QejdX0W5I6Vtvb5M2mI8PEd1E/A0hCgo4cZCjgkUIMYZpjxKr4TBYZIkqk0ml0VHmyONY7KJOW7RxHeMlfDrheFvVbsrj24Pue3SXXjrwVhcW3o9hR7bWB6bqyE5obf3VhpaNu4Te55ZsbbasLCFH+iuWxSF5lyk+CUdd1NuaQU5f8dQvPMpTuJXYSWAy6rPBe+CpsCk+FF8KXv9TIzt6tEcuAcSw+q55TzcbsJdJM0utkuL+K9ULGGPmQMUNanb4kTZyKOfLaUAsnBneC6+biXC/XB567zF3h+rkIrS5yI47CF/VFfCHwvjO+Pl+3b4hhp9u+02TrozFa67vTkbqisXqUj9sn9j2OqhMZsrG+sX5WCCu0omNqSrN0TwADJW1Ol/MFk+8RhAt8iK4tiY+rYleQTysKb5kMXpcMSa9I2S6wO4/tA7ZT1l3maV9zOfMqcOkb/cPrLjdVBl4ZwNFzLhegM3XkCbB8XizrFdsfPJ63gJE722OtPW1huos+VqvbdC5bHgG7D6vVn8+q1d3n5H8LeKP8BqkjCtbCoV8yAAACAUlEQVQ4EZVTz0sbQRh9+0tTbf0RFRWprawGEbQgDa5NcpP2Iu3BlmqN/4v/gCBePIiIKBEvHooULAEvEUSxtqJio1ZLwepajJqou0k2cWY3WbNJhTjLzM735r038307y0S1WNK3PIvAzhJCV+fIp5UXl8Hd7MIn6SO4hteOwflvX6DElHy0Oodyg393oWgqOLtUNajGo3mLM4knoWPwl0pYxzzkSO/auzPX753vy78w6h8D1fJp1tafbezLB1CjKsCk0ax3EhB4HnFNMxdMg7OrEED625fdeFZZTwi5LhHlEnMrn3FxfZFrQJE6ex16ne8xuTQNlRQo2+SDswdHZydY2Pj6fwOe4yCH/xGC3yRkTl48bYUgmIfWlyyRRnKrfGwHLehNTAXLGGkkQR6Sv1glYvd4L9PzrogUPQ2fYmHTD0ns0EkcxxpkItYSCQTlINYOvxtYarScQI1FMRXw4U1bFw7kQwRTu9mEQgx4vBhfnEAimbAYpLawYHhUWAS3w2WCjpomPK+ozxFTgmnAMiwKeEHvO0c/oZGd0rHkkLD++4cZUzzdmJ6RPpIh4HX3QawWDZzkS0GGNfxrS6oRuj6HEqefFoioEQzND+tzvsT2RL+S04EZHXjIQLWsp8XzEI2F625+Bd7b2Ys4+RuX91YtV9TCzApKi0ohNTox4OrHLRsAtvjqiOggAAAAAElFTkSuQmCC';
}
