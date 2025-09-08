import axios from "axios";

const URL = import.meta.env.VITE_API_BASE_URL;

export const buildQueryParams = (filters: Record<string, any>) =>
    new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                acc[key] = String(value);
            }
            return acc;
        }, {} as Record<string, string>)
    ).toString();

// Função genérica de requisição
export const request = async <T>(method: string, endpoint: string, data?: any) => {
    try {
        const res = await axios({ method, url: `${URL}${endpoint}`, data });
        return res.status === 200 || res.status === 201 ? res.data : null;
    } catch (error) {
        console.error(`Erro ao executar ${method.toUpperCase()} ${endpoint}:`, error);
        return null;
    }
};