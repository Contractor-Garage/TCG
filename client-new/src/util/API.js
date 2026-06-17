import axios from 'axios'

const localHost =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3005'
const config = { withCredentials: true }

export const API = {
  getAllLocations: () =>
    axios
      .get(localHost + '/api/locations', config)
      .then((res) => res.data)
      .catch((error) => {
        console.error('API getAllLocations:', error)
        throw error
      }),

  getLocationBySlug: (slug) =>
    axios
      .get(localHost + `/api/location/${slug}`, config)
      .then((res) => res.data)
      .catch((error) => {
        console.error('API getLocationBySlug:', error)
        throw error
      }),

  getPreviewLocation: (id) =>
    axios
      .get(localHost + `/api/location/preview/${id}`, config)
      .then((res) => res.data)
      .catch((error) => {
        console.error('API getPreviewLocation:', error)
        throw error
      }),

  submitContactForm: (formData) =>
    axios
      .post(localHost + '/api/contact', formData, config)
      .then((res) => res.data)
      .catch((error) => {
        console.error('API submitContactForm:', error)
        throw error
      }),
}
