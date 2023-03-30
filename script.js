//When the page is loaded, the below functions are called.
$(document).ready(function () {
    //Grabs the destination button by ID form the HTML and then creates a function to specify what happens when the destination button is clicked
    $("#destination-button").on("click", function () {
      //creates a global variable for the value of the text inputted into the destination value form element
      var destinationTerm = $("#destination-value").val();
      //upon clicking the destination button, the destination value form elelment will go blank
      $("#destination-value").val("");
      //calls the weatherForcast and passes the destinationTerm variable as an argument for the fiveDayWeather
      fiveDayWeather(destinationTerm);
      //calls the singleDayWeather and passes the destinationTerm variable as an argument for the singleDayWeather
      singleDayWeather(destinationTerm);
    });
  
    //This code retrieves data from the web browser's localStorage object and parses it as a JSON object. It assigns the resulting object to the variable citiesArray. If localStorage.getItem("citiesArray") returns null or undefined, the code assigns an empty array to citiesArray using the logical OR operator (||).
    var citiesArray = JSON.parse(localStorage.getItem("citiesArray")) || [];
  
    //makes a row for each element in citiesArray array(destinationTerms)
    for (var i = 0; i < citiesArray.length; i++) {
      rowsAdded(citiesArray[i]);
    }
    //This code checks if the length of the citiesArray array is greater than 0. If the citiesArray array has at least one element, it will call the singleDayWeather function with the last element of the citiesArray array as an argument.
    //Because arrays are indexed, the first elelment in the array will be numbered 0, so in order to target the last elelment in the array, you must subtract 1 from the total length of the array.
    if (citiesArray.length > 0) {
      singleDayWeather(citiesArray[citiesArray.length - 1]);
    }
    
    //The new list item element is given a CSS class of list-group-item using the jQuery addClass() method. Then, the text parameter is added to the content of the list item using the jQuery text() method.
    //puts the destinationed cities underneath the previous destinationed city 
    function rowsAdded(text) {
      var cityList = $("<li>").addClass("list-group-item").text(text);
      $(".citiesArray").append(cityList);
    }
  
    //This code sets up a jQuery event listener for the click event on all li elements that are descendants of an element with the CSS class citiesArray. When an li element is clicked, the function passed as the third argument to .on() is executed.
    //Inside the function, the text content of the clicked li element is passed as an argument to two functions: singleDayWeather() and fiveDayWeather(). It's likely that these functions are designed to process weather data in some way, such as displaying it on a website or making a decision based on the data.
    $(".citiesArray").on("click", "li", function () {
      singleDayWeather($(this).text());
      fiveDayWeather($(this).text());
    });
  
    // function fiveDayWeather(destinationTerm) 
    function fiveDayWeather(destinationTerm) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + destinationTerm + "&appid=9f112416334ce37769e5c8683b218a0d&units=imperial",
            
        }).then(function (data) {
            console.log(data);
            
            //Creates an h4 element and div with the bootstrap class row in the div with the id of forecast 
            //The .html method is used to set the h4 and div within the html
            $("#five-weather").html("<h4 class=\"m-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
            
            //loop to create a new card for 5 days pull data image from destination
            for (var i = 0; i < data.list.length; i++) {
                
                //Essentially saying if the name of the city exists then do the following
                //checking if the timestamp corresponds to a time of 3:00 PM (15:00 in military time), and if it does, it will execute the code within the conditional statement
                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    
                    var cityTemperature = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
                    var cityHumidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var cityFiveColumn = $("<div>").addClass("col-md-2.5");
                    var cityNameFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var cityFiveImage = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                    var cityCards = $("<div>").addClass("card bg-primary text-white");
                    var cityCardBody = $("<div>").addClass("card-body p-2");
                    
                    //merge together and put on page
                    cityFiveColumn.append(cityCards.append(cityCardBody.append(cityNameFive, cityFiveImage, cityTemperature, cityHumidity)));
                    //append card to column, body to card, and other elements to body
                    $("#five-weather .row").append(cityFiveColumn);
                }
            }
        });
    }
    
    //This function makes an AJAX call to the OpenWeatherMap API to retrieve the current weather data for the location specified by the destinationTerm parameter.
    //type: "GET" specifies that this request should use the HTTP GET method. url specifies the URL of the OpenWeatherMap API endpoint, which includes the destinationTerm parameter passed to the function and an API key.
      function singleDayWeather(destinationTerm) {
    
        $.ajax({
          type: "GET",
          url: "https://api.openweathermap.org/data/2.5/weather?q=" + destinationTerm + "&appid=9f112416334ce37769e5c8683b218a0d",
    
    //the code then checks if the destinationTerm value already exists in the citiesArray array. 
    //If it does not exist, the code then adds the destinationTerm to the citiesArray array, saves the updated citiesArray array to local storage using localStorage.setItem(), and calls the createRow() function to create a new row in the HTML table to display the destination term. 
        }).then(function (data) {
          //if index of destination value does not exist
          if (citiesArray.indexOf(destinationTerm) === -1) {
            //push destinationValue to citiesArray array
            citiesArray.push(destinationTerm);
            //places item pushed into local storage
            localStorage.setItem("citiesArray", JSON.stringify(citiesArray));
            rowsAdded(destinationTerm);
          }
          // clears out old content
          $("#currentDay").empty();
    
    //An h3 elelment is created with the bootstrap card-title class. The .text method sets the text assigned to the h3 elelemnt. 
    //the data.name property contains the name of the specific city. 
    //the new Date().toLocaleDateString() method returns the current date in a localized date string format
          var cityName = $("<h4>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        
      //An img element is created. The .attr method is used to specify the source of the image with its specific url from the API
      //The weather property of the data object is an array of objects, and the [0] index is used to access the first object in the array.
          var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
    
    //Creates a div elelement with the bootstrap class card
          var card = $("<div>").addClass("card");
        
      //creates a div with the bootstrap class card-body
          var cityText = $("<div>").addClass("card-body");
    
          var lon = data.coord.lon;
          var lat = data.coord.lat;
      //creates a paragraph element with the bootstrap class card-text. And uses the .text method to assign the p element text content. The data object contains the weather information for the specific locvation. The wind property of the data object specifies the wind conditions of the specific location. The speed property of the wind object contains the wind speed for that specific location. 
      var temperatureDegrees = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " K");
      var humidityLevel = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
      var windSpeed = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
    
    //retrieves information about the UV Index for a specific location, using the latitude and longitude coordinates previously retrieved from the API.
          $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=9f112416334ce37769e5c8683b218a0d&lat=" + lat + "&lon=" + lon,
    
    //The then() method is used to handle the response returned by the API. The response is stored in a variable called response.
          }).then(function (response) {
            console.log(response);
    
            var indexResp = response.value;
    //The code then creates a few variables and HTML elements to display the UV Index information on the page.
            var index = $("<p>").addClass("card-text").text("UV Index: ");
            var indexButton = $("<span>").addClass("btn btn-sm").text(indexResp);
    
    //The btn-success bootstrap class makes the button green
    //The btn-warning bootstrap class makes the button yellow
    //The btn-danger bootstrap class makes the button red
            if (indexResp < 3) {
              indexButton.addClass("btn-success");
            } else if (indexResp < 7) {
              indexButton.addClass("btn-warning");
            } else {
              indexButton.addClass("btn-danger");
            }
    //appends the index element, which was previously created, to the cardBody element.
    //selects the card body element for today's weather, specifically an element with the ID "currentDay" and the class "card-body". It then appends the index element to this selected element, and then appends the btn element to the index element.
            cityText.append(index);
            $("#currentDay .card-body").append(index.append(indexButton));
    
          });
    
      //Essentially merges each elelment created in the weather function to display the elelements in the div with the currentDay ID
      //The image gets appended to the title
      //The title, temp, humidity, and wind variables which contain the specific elelments get appended to the cityText elelment which is a div
      //The cityText div gets appended to the card div
    
          cityName.append(img);
          cityText.append(cityName, temperatureDegrees, humidityLevel, windSpeed);
          card.append(cityText);
          $("#currentDay").append(card);
          console.log(data);
        });
      }
});
