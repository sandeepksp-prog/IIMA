export const API_BASE = 'http://localhost:8000';

export async function fetchHealth() {
    try {
        const res = await fetch(`${API_BASE}/health`);
        if (!res.ok) throw new Error("Health check failed");
        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        return { status: "Offline", error: error.message };
    }
}

export async function generateResponse(query) {
    try {
        const res = await fetch(`${API_BASE}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        if (!res.ok) throw new Error("Generation failed");
        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        return { response: "Error connecting to Brain.", metadata: {} };
    }
}
