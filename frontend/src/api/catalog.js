import apiClient from './client'

export const listProducts = () => apiClient.get('/products/')
export const listBoxes = () => apiClient.get('/boxes/')