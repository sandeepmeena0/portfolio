const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useApi = () => {
    
    const getToken = () => localStorage.getItem('adminToken');

    const getHeaders = (auth = false) => {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (auth) {
            headers['Authorization'] = `Bearer ${getToken()}`;
        }
        return headers;
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API_URL}/projects`);
            return await res.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            return { success: false, data: [] };
        }
    };

    const submitContact = async (data) => {
        try {
            const res = await fetch(`${API_URL}/contacts`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (error) {
            console.error('Error submitting contact form:', error);
            return { success: false, message: 'Network error' };
        }
    };

    const trackPageView = async (path) => {
        try {
            await fetch(`${API_URL}/analytics/pageview`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    path,
                    referrer: document.referrer,
                    userAgent: navigator.userAgent
                })
            });
        } catch (error) {
            // Silently fail for analytics
        }
    };

    // Admin methods
    const login = async (username, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error' };
        }
    };

    const verifyAuth = async () => {
        if (!getToken()) return { success: false };
        try {
            const res = await fetch(`${API_URL}/auth/verify`, {
                method: 'GET',
                headers: getHeaders(true)
            });
            return await res.json();
        } catch (error) {
            return { success: false };
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
    };

    const getAnalyticsSummary = async () => {
        try {
            const res = await fetch(`${API_URL}/analytics/summary`, {
                method: 'GET',
                headers: getHeaders(true)
            });
            return await res.json();
        } catch (error) {
            console.error('Analytics error:', error);
            return { success: false };
        }
    };

    const getContacts = async () => {
        try {
            const res = await fetch(`${API_URL}/contacts`, {
                method: 'GET',
                headers: getHeaders(true)
            });
            return await res.json();
        } catch (error) {
            console.error('Error fetching contacts:', error);
            return { success: false, data: [] };
        }
    };

    const markContactRead = async (id) => {
        try {
            const res = await fetch(`${API_URL}/contacts/${id}/read`, {
                method: 'PATCH',
                headers: getHeaders(true)
            });
            return await res.json();
        } catch (error) {
            console.error('Error updating contact:', error);
            return { success: false };
        }
    };

    const deleteContact = async (id) => {
        try {
            const res = await fetch(`${API_URL}/contacts/${id}`, {
                method: 'DELETE',
                headers: getHeaders(true)
            });
            return await res.json();
        } catch (error) {
            console.error('Error deleting contact:', error);
            return { success: false };
        }
    };

    const addProject = async (projectData) => {
        try {
            const res = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                headers: getHeaders(true),
                body: JSON.stringify(projectData)
            });
            return await res.json();
        } catch (error) {
            console.error('Error adding project:', error);
            return { success: false };
        }
    };

    const updateProject = async (id, projectData) => {
        try {
            const res = await fetch(`${API_URL}/projects/${id}`, {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify(projectData)
            });
            return await res.json();
        } catch (error) {
            console.error('Error updating project:', error);
            return { success: false };
        }
    };

    const deleteProject = async (id) => {
        try {
            const res = await fetch(`${API_URL}/projects/${id}`, {
                method: 'DELETE',
                headers: getHeaders(true)
            });
            return await res.json();
        } catch (error) {
            console.error('Error deleting project:', error);
            return { success: false };
        }
    };

    const getSettings = async () => {
        try {
            const res = await fetch(`${API_URL}/settings`);
            return await res.json();
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    };

    const updateSettings = async (data) => {
        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (error) {
            console.error('Error updating settings:', error);
            return { success: false };
        }
    };

    const getVisitorLogs = async (page = 1, limit = 50) => {
        try {
            const res = await fetch(`${API_URL}/analytics/logs?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: getHeaders(true)
            });
            return await res.json();
        } catch (error) {
            console.error('Error fetching visitor logs:', error);
            return { success: false, data: [] };
        }
    };

    const clearVisitorLogs = async () => {
        try {
            const res = await fetch(`${API_URL}/analytics/logs`, {
                method: 'DELETE',
                headers: getHeaders(true)
            });
            return await res.json();
        } catch (error) {
            console.error('Error clearing logs:', error);
            return { success: false };
        }
    };

    return {
        fetchProjects,
        submitContact,
        trackPageView,
        login,
        verifyAuth,
        logout,
        getAnalyticsSummary,
        getContacts,
        markContactRead,
        deleteContact,
        addProject,
        updateProject,
        deleteProject,
        getSettings,
        updateSettings,
        getVisitorLogs,
        clearVisitorLogs
    };
};
