import { GOOGLE_MAPS_API_KEY } from '../constants'

import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Modal from '@material-ui/core/Modal'

import DeleteIcon from '@material-ui/icons/Delete'

import clsx from 'clsx'

import GoogleMapReact from 'google-map-react'

import { WaterPercent, WeatherWindy } from 'mdi-material-ui'

// Package used to debug react-query
// import { ReactQueryDevtools } from 'react-query-devtools'

import { useWeather } from '../context/WeatherContext'

import { Marker } from './Marker'

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 10,
    padding: 10,
    display: 'flex',
    alignItems: 'center'
  },
  paper_searched_cities: {
    display: 'flex',
    flexDirection: 'column'
  },
  paper_result: {
    display: 'flex',
    flexDirection: 'column'
  },
  buttonContainer: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
    display: 'flex',
    flexGrow: 1,
    width: '80%'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  searchButtonRoot: {
    margin: 10,
    fontWeight: 700
  },
  buttonLabel: {
    textTransform: 'capitalize',
    fontWeight: 700
  },
  mapViewPosition: {
    height: '100vh',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  cityName: {
    flexGrow: 1,
    color: '#613ab7'
  }
}))
const Weather = (props) => {
  const classes = useStyles()

  const { cityData, isLoading, searchedCities, getCityWeather, deleteCity } = useWeather()

  const [cityValue, setCityValue] = React.useState('')
  const [coords, setCoords] = React.useState({ lng: 0, lat: 0, show: false })

  const inputEl = React.useRef(null)

  // we configure our input to interact with google places - autocomplete
  React.useEffect(() => {
    // eslint-disable-next-line
    const autocomplete = new google.maps.places.Autocomplete(inputEl.current, {
      types: ['(cities)']
    })

    function onChangePlace () {
      const place = autocomplete.getPlace()

      // Only if we get a name we perform a search using the value retornud by google places
      if (place.name) {
        setCityValue(place.name)
      }
    }

    autocomplete.addListener('place_changed', onChangePlace)

    return function cleanup () {
      autocomplete.unbindAll()
    }
  }, [])

  // When we get a new value for a city we show the map if this is no visible yet, set the coords for our marker and center teh map to this location
  useEffect(() => {
    if (cityData.coord) {
      setCoords({ lng: cityData.coord.lon, lat: cityData.coord.lat, show: true })
    }
  }, [cityData])

  // sends the value to search which could be one from our input or from the value returned by google places
  const _handleSubmit = (event) => {
    event.preventDefault()
    getCityWeather(cityValue)
  }
  const _handleCityChange = (event) => {
    setCityValue(event.target.value)
  }
  // When the input gets focus, previous values need to be erased to prevent bugs
  const _handleCityFocus = (event) => {
    inputEl.current.value = ''
  }
  // Called by the buttons generated from our stored values - Calls data again (it could be on the cache)
  const _handleCityClicked = (value) => {
    getCityWeather(value)
  }
  // Called by the buttons generated from our stored values - Deletes the city selected
  const _handleDeleteCityClicked = (value) => {
    deleteCity(value)
  }
  const _onMapChange = (mapProps) => {
    // console.log('_onMapChange', mapProps)
  }
  return (
    <>
      <Grid
        container
        spacing={0}
        alignItems='flex-start'
        justify='flex-start'
        direction='column'
      >
        <div>
          <div className={classes.mapViewPosition}>
            {coords.show &&
              <GoogleMapReact
                bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
                center={{ lat: coords.lat, lng: coords.lng }}
                zoom={11}
                onChange={_onMapChange}
                debounced={false}
                distanceToMouse={() => {}}
              >
                <Marker lat={coords.lat} lng={coords.lng} />
                <Marker lat={coords.lat} lng={coords.lng} />
                <Marker lat={coords.lat} lng={coords.lng} />
              </GoogleMapReact>}
          </div>
        </div>
        <Grid container item xs={12} sm={6} lg={5} style={{ position: 'relative' }}>
          <form onSubmit={_handleSubmit} style={{ width: '100%' }}>
            <Paper elevation={3} component='div' className={classes.paper}>
              <TextField
                id='city' label='City' className={classes.input}
                InputProps={{
                  onChange: _handleCityChange,
                  onFocus: _handleCityFocus
                }}
                InputLabelProps={{
                  shrink: true
                }}
                required
                inputRef={inputEl}
              />
              <Button
                type='submit'
                size='small'
                variant='outlined'
                color='primary'
                classes={{ root: classes.searchButtonRoot }}
                disableElevation
              >
                Search
              </Button>
            </Paper>
          </form>
        </Grid>
        <Grid container direction='row' item xs={12} sm={6} lg={5} style={{ position: 'relative' }}>
          {(searchedCities.length > 0) &&
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3} component='div'
                classes={{ root: clsx(classes.paper, classes.paper_searched_cities) }}
              >
                <Typography variant='h6' component='div'>
                  Lastest Searches
                </Typography>
                {searchedCities.map(value =>
                  <div key={Math.random()} className={classes.buttonContainer}>
                    <ButtonGroup color='primary' variant='contained' fullWidth>
                      <Button
                        type='submit'
                        size='small'
                        classes={{ label: classes.buttonLabel }}
                        onClick={() => _handleCityClicked(value)}
                        disableElevation
                        fullWidth
                      >
                        {value}
                      </Button>
                      <Button
                        size='small'
                        onClick={() => _handleDeleteCityClicked(value)}
                        style={{ width: '20%' }}
                      >
                        <DeleteIcon />
                      </Button>
                    </ButtonGroup>
                  </div>
                )}
              </Paper>
            </Grid>}
          {cityData.main &&
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3} component='div'
                classes={{ root: clsx(classes.paper, classes.paper_result) }}
              >
                <Grid container direction='row'>
                  <Typography variant='h4' component='div' classes={{ root: classes.cityName }}>
                    {cityData.name}
                  </Typography>
                </Grid>
                <Grid container direction='row'>
                  <Grid item xs={6}>
                    <Typography variant='h2' component='div'>
                      {cityData.main.temp}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='subtitle2' component='div'>
                      Max Temp. : {cityData.main.temp_max}
                    </Typography>
                    <Typography variant='subtitle2' component='div'>
                       Min Temp. : {cityData.main.temp_min}
                    </Typography>
                  </Grid>
                  <Grid container direction='row' item xs={6}>
                    <Grid alignItems='flex-start' container item xs={12}>
                      <Typography variant='subtitle2' component='span'>
                      Pressure :
                      </Typography>
                      <WeatherWindy />
                      <Typography variant='subtitle2' component='span'>
                        {cityData.main.pressure}
                      </Typography>
                    </Grid>
                    <Grid alignItems='flex-start' container item xs={12}>
                      <Typography variant='subtitle2' component='span'>
                      Humidity :
                      </Typography>
                      <WaterPercent />
                      <Typography variant='subtitle2' component='span'>
                        {cityData.main.humidity}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>}
        </Grid>
        {/* }
        <ReactQueryDevtools initialIsOpen={false} />
        */}
        <Modal
          open={isLoading}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <Typography variant='h2' component='div'>
          Loading Content
          </Typography>
        </Modal>
      </Grid>
    </>
  )
}
export default Weather
