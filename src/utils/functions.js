// Converter Functions
/**
 * Coverts Kelvin to Fahrenheit.
 * @param {Number} k - Kelvin Value
 * @returns {Number} Fahrenheit Value
 */
export const KelvinToFahrenheit = (k) => {
  return `${((k - 273.15) * 1.8) + 32} F`
}

/**
 * Coverts Kelvin to Celsius.
 * @param {Number} k - Kelvin Value
 * @returns  {Number} Celsius Value
 */
export const KelvinToCelsius = (k) => {
  return `${(k - 273.15).toFixed(1)} C`
}

// Storage Functions
/**
 * Saves Data to Local Storage.
 * @param {String} key
 * @param {*} value
 * @returns
 */
export const setToLocalStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * @function myFunction
 * Returns Data from Local Storage.
 * @param {String} key
 * @returns
 */
export const getFromLocalStorage = key => {
  console.log('window.localStorage.getItem(key)', window.localStorage.getItem(key))
  return JSON.parse(window.localStorage.getItem(key))
}
