import api from "./api"; 

export const categoryApi = {
    getAll: () => api.get("/categories"),
    
    getCategoryDetails: (id) => {
        const endpoints = {
            1: "/civil_liability",
            2: "/casco",
            3: "/assistance"
        };  
        
        const path = endpoints[id] || "/civil_liability";
        return api.get(path);
    },

  
    getCivilLiability: () => api.get("/civil_liability"),
    getCasco: () => api.get("/casco_config"),
    getAgeGroups: () => api.get("/age_groups"),
    getAssistanceEurope: () => api.get("/assistance_europe_rates"),
};

export const authApi = {
  register: (userData) => api.post("/register", userData),
  login: (credentials) => api.post("/login", credentials),
};