import { GOOGLE_MAPS_API_KEY } from './constants'

import React from 'react'
import Weather from './components/Weather'

// Context Provider for our application
import { WeatherProvider } from './context/WeatherContext'

// Used to add scripts to the header
import AppendHead from 'react-append-head'

require('dotenv').config()

function App () {
  const [renderWeather, setRenderWeather] = React.useState(false)

  // This function recursively checks if the google file has been loaded and parsed correctly
  const checkGoogle = () => {
    if (window.google) {
      console.log('Google Found')
      setRenderWeather(true)
    } else {
      console.log('Google No Found')
      setTimeout(checkGoogle, 1000)
    }
  }
  const _googleLoaded = () => {
    // Call our function helper
    checkGoogle()
  }
  return (
    <div className='App'>
      <div>
        <AppendHead onLoad={_googleLoaded}>
          <script type='text/javascript' src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`} async={false} />
        </AppendHead>
        <WeatherProvider>
          {renderWeather && <Weather />}
        </WeatherProvider>
      </div>
    </div>
  )
}

export default App
