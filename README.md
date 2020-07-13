# Weather Application
Google Maps & Places, Material UI, React.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3010](http://localhost:3010) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

**Note: Important! it is needed an .env file on the root of the project containig the keys used by Google Maps and openweathermap**

The structure of the file is like this:

REACT_APP_WEATHER_API_KEY={yourkey}

REACT_APP_GOOGLE_MAPS_API_KEY={yourkey} 

Google requires rilling configuration needs to set in order to get the autocomplete to work on the input and remove overlay on the map

### `Services Used`

[https://openweathermap.org](https://openweathermap.org)
[https://cloud.google.com/maps-platform/places/](https://cloud.google.com/maps-platform/places/)

### `Google Autocomplete`

As user types cities are suggested, this data commes from google places, if there's no connection the search still can be made with the data value currently on the input, Search button needs to be clicked to perform the call to Open Weather

### `Material Design`

[https://material-ui.com/](Material Design) was used to make the website responsive