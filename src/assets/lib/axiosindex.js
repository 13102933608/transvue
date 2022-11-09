import axios from 'axios'
export function postmethods (options = {}) {
  return axios.post('editpwd', options)
}
export function getmethods (params = {}) {
  return axios.get('editpwd', {params})
}
