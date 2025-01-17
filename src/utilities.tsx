import * as React from 'react'

// Utility to get react state from localStorage if exists
// From https://www.robinwieruch.de/local-storage-react/
const useLocalStorage = (storageKey, fallbackState, compareTypes = true): any => {
  const storedItem = localStorage.getItem(storageKey)
  let initValue = storedItem ? JSON.parse(storedItem) : fallbackState

  // If fallbackState is not null, then: if it has a type, check localStorage value has same type / or if type is object (and arrays are objects), check they have the same signature
  if (fallbackState && compareTypes) {
    if (typeof initValue !== typeof fallbackState || (typeof initValue === 'object' && fallbackState !== null && !objectsHaveSameKeys(fallbackState, initValue))) {
      // console.log(`Setting ${storageKey} value to fallbackState`)
      initValue = fallbackState
    }
  }
  const [value, setValue] = React.useState(initValue)

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value))
  }, [value, storageKey])

  return [value, setValue]
}

// Check if object vars have same attribs and props, or are both (or all) arrays
// From https://stackoverflow.com/questions/14368596/how-can-i-check-that-two-objects-have-the-same-set-of-property-names
function objectsHaveSameKeys(...objects): boolean {
  const areAllArrays = objects.every((arr) => Array.isArray(arr))
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), [])
  const union = new Set(allKeys)
  return areAllArrays || objects.every((object) => union.size === Object.keys(object).length)
}

/* GSD */
const GSD_STEPS = [0, 0.15, 0.3, 0.5, 1, 2, 5, 15, 30]
function GSDFromIndex(gsdIndex: number): string {
  const gsdMeters = GSD_STEPS[gsdIndex]
  return gsdMeters < 1 ? `${Math.floor(gsdMeters * 100)}cm` : `${gsdMeters}m`
}

function parseJwt(token): any {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}

function log(...logArgs): void {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.log(...logArgs)
  }
}

const unique = (value, index, self): boolean => self.indexOf(value) === index

export { useLocalStorage, GSD_STEPS, GSDFromIndex, parseJwt, log }
