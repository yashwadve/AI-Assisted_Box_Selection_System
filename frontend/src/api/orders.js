import apiClient from './client'

export const listOrders = () => apiClient.get('/orders/')
export const getOrder = (id) => apiClient.get(`/orders/${id}/`)
export const createOrder = (items) => apiClient.post('/orders/', { items })