import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000',
})

export const authAPI = {
    register: async (credentials) => {
        try {
            const response = await API.post('/register', credentials);
            return response.data
        } catch (error) {
            throw error.response?.data?.detail || "Registration failed";
        }
    },
    LogIn: async (credentials) => {
        try {
            const response = await API.post("/login", credentials)
            return response.data
        } catch (error) {
            throw error.response?.data?.detail || "login failed";   
        }
    },
    deleteUser: async (user_id) => {
        try {
            const response = await API.delete(`/users/${user_id}`)
            return response.data
        } catch (error) {
            throw error.response?.data?.detail || "failed to delete the user";
        }
    }
}
export const workspacesAPI = {
    getWorkspaces: async (user_id) => {
      try {
        const response = await API.get(`/workspaces/${user_id}`)
        return response.data
      } catch (error) {
        throw error.response?.data?.detail || "Could not load workspaces"; 
      }  
    },
    addWorkspace: async (data) => {
        try {
            const response = await API.post("/workspaces", data)
            return response.data
        } catch (error) {
            throw error.response?.data?.detail || "failed to create the workspace";
        }
        
    },
    removeWorkspace: async (workspace_id) => {
        try {
            const response = await API.delete(`/workspaces/${workspace_id}`)
            return response.data
        } catch (error) {
            throw error.response?.data?.detail || "failed to delete the workspace";
        }
        
    } 
}

export const tasksAPI = {
    addTask: async (data) => {
        try {
            const response = await API.post("/tasks", data)
            return response.data
        } catch (error) {
            throw error.response?.data?.detail || "failed to add the task";
        }
    },
    gettasks: async (workspace_id) => {
        try {
            const response = await API.get(`/workspaces/${workspace_id}/tasks`)
            return response.data
        } catch (error) {
            throw error.response?.data?.detail || "failed to get the tasks"
        }
    },
    updateTask: async (data, task_id) => {
        try {
            const response = await API.put(`/tasks/${task_id}`, data)
            return response.data
        } catch (error) {
            throw error.response?.data?.detail || "failed to update the task"
        }
    },
    deleteTask: async (task_id) => {
        try {
            const response = await API.delete(`/tasks/${task_id}`)
            return response.data
        } catch (error) {
            throw error.response?.data?.detail || "failed to delete the task"
        }
    }
}