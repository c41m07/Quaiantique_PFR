// Je centralise ici les appels HTTP vers l'API Symfony en appliquant automatiquement l'URL de base et les en-têtes.
const API_BASE_URL = (window.API_BASE_URL || '').replace(/\/$/, '');

const normalizePath = (path = '') => path.startsWith('/') ? path : `/${path}`;

async function apifetch(path, option = {}){
    const url = `${API_BASE_URL}${normalizePath(path)}`;

    const defaultOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const finalOption = {
        ...defaultOption,
        ...option,
        headers: {
            ...defaultOption.headers,
            ...(option.headers || {})
        }
    };

    if (finalOption.body && finalOption.headers['Content-Type']?.includes('application/json') && typeof finalOption.body !== 'string') {
        finalOption.body = JSON.stringify(finalOption.body);
    }

    const response = await fetch(url, finalOption);
    if (!response.ok) {
        const errorPayload = await response.text().catch(() => response.statusText);
        throw new Error(`API error: ${response.status} ${errorPayload}`);
    }

    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
        return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
}

window.apifetch = apifetch;