/*global fetch goodreadsApiKey DOMParser*/

function searchBook(){
    // get the search term from the input
    const keyword = document.getElementById("keyword").value;
    console.log(keyword);
    
    // make a GET request to GoodReads API to get book info
    const endpoint = "https://www.goodreads.com/search/index.xml";
    const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
    const url = corsAnywhere + endpoint + "?" + "key=" + goodreadsApiKey + "&q=" + keyword;
    
    fetch(url)
    .then(function(res){
        //console.log(res);
        return res.text();
    }).then(function(res){
        const parser = new DOMParser();
        const parsedRes = parser.parseFromString(res, "text/xml");
        // console.log(parsedRes);
        const parsedJsonRes = xmlToJson(parsedRes);
        // const title = parsedRes.getElementsByTagName("title");
        // console.log(title);
        // console.log(parsedJsonRes);
        displayResult(parsedJsonRes)
    });
}

function displayResult(parsedObj){
     // generate a list to diplay results from API
   // console.log("display", parsedObj);
    const works = parsedObj.GoodreadsResponse.search.results.work;
    var liGroup = "";
    
    works.forEach(function(work){
        const author = work.best_book.author.name["#text"];
        const title = work.best_book.title["#text"];
        const imgUrl = work.best_book.image_url["#text"];
        console.log(author, title, imgUrl);
        
        const li = "<li>" + title + "by" + author + "</li>";
        liGroup += li;
    });
    document.getElementById("list").innerHTML = liGroup;
}

// source: https://davidwalsh.name/convert-xml-json
// Changes XML to JSON
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}