// Get Google sheet data using Papa Parse example by Frank Bültge - www.frankbueltge.de
// Code published here: https://github.com/frrrrank/Google-Sheet-Stuff
// Instructions can be found here: https://frankbueltge.de/en/google-sheets-as-database-or-tiny-cms/

// Publish your sheet to the web and use the URL you get from the sharing option on the top/right of the sheet and add /pub?output=csv at the end of the URL      
	 var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/13lP-96izM95kbpBlY9Wx1XfcyPNF9Lsc26ApQN-95Qo/pub?output=csv';

     var qsRegex;
     var buttonFilter;
     var $quicksearch = $('#quicksearch');
     var $container = $('#database')
     var timeout;

     function init() {
       Papa.parse(public_spreadsheet_url, {
         download: true,
         header: true,
         complete: showInfo
       })
     }
     window.addEventListener('DOMContentLoaded', init)

     function showInfo(results) {
       var data = results.data
       var result = [];
       var count = 1;
       // data comes through as a simple array since simpleSheet is turned on
       // alert("Successfully processed " + data.length + " rows!");
       // console.log(data);
		
	   // loop to get the data from JSON and write it to the div's with the id's database and quicksearch 
       $.each(data, function(i, v) {
         // Parses the resulting JSON into the individual squares for each row
         $container.append('<div id="element-item"><div class="category">' + v.Filter_category + '</div><img src="' + v.Pic_Link + '"><div class="name">' + v.Title + '</div><div class="boldsubhed">' + v.Location + '</div><div class="boldsubhed">' + v.City + '</div><div class="description">' + v.Date + '</div><div class="readmore"><a href="' + v.Website + ' " target="_blank">Website</a></div></div>');
         // Gets all unique filtercategory values and puts them into an array
         if ($.inArray(v.Filter_category, result) == -1) {
           result.push(v.Filter_category);
           // Creates the filter buttons
           $('#filter').append('<button id="' + v.Filter_category + '" class="btn btn-default" data-value="choice' + count++ + '">' + v.Filter_category + '</button>')
         }
       });
       // search function
       $quicksearch.keyup(debounce(function() {
         qsRegex = new RegExp($quicksearch.val(), 'gi');
         $container.isotope();
       }));
       //  wait until images are loaded 
       $container.imagesLoaded(function() {
         // Sorts them into responsive square layout using isotope.js
         $container.isotope({
           itemSelector: '#element-item',
           layoutMode: 'masonry',
           // so that isotope will filter both search and filter results
           filter: function() {
             var $this = $(this);
             var searchResult = qsRegex ? $this.text().match(qsRegex) : true;
             var buttonResult = buttonFilter ? $this.is(buttonFilter) : true;
             return searchResult && buttonResult;
           }
         });
       });
       // debounce so filtering doesn't happen every millisecond
       function debounce(fn, threshold) {
         return function debounced() {
           if (timeout) {
             clearTimeout(timeout);
           }

           function delayed() {
             fn();
             timeout = null;
           }
           timeout = setTimeout(delayed, threshold || 100);
         }
       }
       // Adds a click function to all buttons in the group
       $('.btn-group').each(function(i, buttonGroup) {
         var $buttonGroup = $(buttonGroup);
         var allbuttonids = $("button").attr('id');
         $buttonGroup.on('click', 'button', function() {
           // Changes to .is-checked class when clicked
           $buttonGroup.find('.is-checked').removeClass('is-checked');
           $(this).addClass('is-checked');
           // Gets all values that matches the clicked button's data value
           buttonFilter = $(this).attr('data-value');
           textFilter = $(this).text();

           function getitems() {
             var name = $(this).find('.category').text();
             if (textFilter != "Show All") {
               return name.match(textFilter);
             } else {
               return "*";
             }
           }
           buttonFilter = getitems || buttonFilter;
           $container.isotope();
         });
       });
     }
