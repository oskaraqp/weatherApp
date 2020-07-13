import { STORAGE_SEARCHES, WEATHER_API_KEY } from '../constants'

import React, { createContext, useMemo, useState, useContext, useEffect } from 'react'

import { useQuery } from 'react-query'

// Helpers to convert some values and store our data locally
import { KelvinToCelsius, setToLocalStorage, getFromLocalStorage } from '../utils/functions'

const WeatherContext = createContext()

const initialStorageData = getFromLocalStorage(STORAGE_SEARCHES) || []

export function WeatherProvider (props) {
  const [currentCity, setCurrentCity] = useState()

  // We use a callback to make modifications to our cities and based ont he operations we remove or add items, last 5 items searched successfully are stored
  const searchedCitiesReducer = React.useCallback((previousState, action) => {
    const city = action.data.toLowerCase()
    let resultsToStore = Array.from(previousState)
    switch (action.type) {
      case 'remove':
        if (previousState.includes(city)) {
          resultsToStore.splice(previousState.indexOf(city), 1)
        }
        setToLocalStorage(STORAGE_SEARCHES, resultsToStore)
        return resultsToStore
      case 'add':
        if (previousState.includes(city)) {
          console.log('includes')
          resultsToStore.splice(previousState.indexOf(city), 1)
        }
        resultsToStore.unshift(city)
        resultsToStore = resultsToStore.slice(0, 5)
        setToLocalStorage(STORAGE_SEARCHES, resultsToStore)
        return resultsToStore
      default:
        return previousState
    }
  }, [])

  const [searchedCities, modifySearchedCities] = React.useReducer(searchedCitiesReducer, initialStorageData)

  const weatherFetch = async (city) => {
    if (city) {
      const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`) //eslint-disable-line
      const data = await response.json()
      if (data.main) {
        modifySearchedCities({ data: city, type: 'add' })
        // modify our data for the city before send it
        return {
          ...data,
          main: {
            ...data.main,
            temp: KelvinToCelsius(data.main.temp),
            pressure: `${data.main.pressure} hPa`,
            humidity: `${data.main.humidity} %`,
            temp_max: KelvinToCelsius(data.main.temp_max),
            temp_min: KelvinToCelsius(data.main.temp_min)
          }
        }
      } else {
        // If the data is corrupt we send and error - more work is needed to catch this one
        throw new Error('No data')
      }
    } else {
      return {}
    }
  }
  const { isLoading, isError, data: cityData, error } = useQuery(currentCity, weatherFetch, {
    refetchOnWindowFocus: false,
    initialData: {},
    initialStale: true
  })
  // function used to get data for a city - exposed to the comsumers of this provider
  const getCityWeather = (city) => {
    setCurrentCity(city.toLowerCase())
  }
  // function used to delete  a city from our stored values - exposed to the comsumers of this provider
  const deleteCity = (city) => {
    modifySearchedCities({ data: city, type: 'remove' })
  }
  const value = useMemo(() => {
    return ({
      cityData,
      isLoading,
      isError,
      error,
      searchedCities,
      getCityWeather,
      deleteCity

    })
  }, [isLoading, isError, cityData, searchedCities])
  return <WeatherContext.Provider value={value} {...props}></WeatherContext.Provider>
}
export function useWeather () {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error('No provider')
  }
  return context
}
