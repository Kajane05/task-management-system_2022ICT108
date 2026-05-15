import axios from 'axios'

// In dev, Vite proxies /api → http://localhost:8000
// In production (served by Express), same origin
const BASE = '/api/task'

const api = axios.create({ baseURL: BASE })

export const getTasks    = ()        => api.get('/').then(r => r.data)
export const createTask  = (data)    => api.post('/create', data).then(r => r.data)
export const updateTask  = (id, data)=> api.put(`/update/${id}`, data).then(r => r.data)
export const deleteTask  = (id)      => api.delete(`/delete/${id}`).then(r => r.data)
