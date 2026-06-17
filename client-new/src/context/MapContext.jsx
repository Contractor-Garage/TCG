import { createContext, useContext, useReducer } from 'react'

const initialState = {
  center: [39.087692, -97.611850],
  zoom: 5,
}

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_MAP':
      return { center: action.payload.center, zoom: action.payload.zoom }
    default:
      return state
  }
}

const MapContext = createContext(initialState)

export function MapProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <MapContext.Provider value={[state, dispatch]}>
      {children}
    </MapContext.Provider>
  )
}

export function useMapContext() {
  return useContext(MapContext)
}
