import { useState, useEffect } from 'react';
import api from '../services/api';
// Import existing mock data as fallback
import { analyticsMasterData } from '../data/analyticsMasterData';

export const useAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingMock, setUsingMock] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/analytics/dashboard');
                setData(response.data);
                setUsingMock(false);
            } catch (err) {
                console.warn("Backend unavailable, falling back to Mock Data.", err);
                // Fallback logic: Map mock data to expected API shape if necessary
                // For now, we assume the component handles the shape, or we return the master data directly
                // logic map says dashboard API matches keys: global_kpis, heatmap_data

                // MAPPING MOCK TO API SHAPE
                const mockPayload = {
                    global_kpis: {
                        accuracy: analyticsMasterData.globalkpis.accuracy,
                        total_attempts: analyticsMasterData.globalkpis.questions_solved, // mapped from questions_solved
                        mastery_score: analyticsMasterData.globalkpis.topic_mastery,
                        streak: analyticsMasterData.globalkpis.streak
                    },
                    heatmap_data: analyticsMasterData.heatmap
                };

                setData(mockPayload);
                setUsingMock(true);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error, usingMock };
};

export const useForensics = (granularity = 'topic') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usingMock, setUsingMock] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/analytics/forensics?granularity=${granularity}`);
                setData(response.data);
                setUsingMock(false);
            } catch (err) {
                console.warn("Backend unavailable, falling back to Mock Data for Forensics.", err);

                // MOCK MAPPING
                // The MockAnalysisEngine currently generates data internally or uses a hardcoded list.
                // We will return a structure that mimics what the component expects or what we defined in the API.
                // The API returns { scatter_plot: [], raw_data: [] }

                // We'll create a dummy scatter set based on the MockAnalysisEngine's internal logic 
                // just to satisfy the hook contract.
                const mockScatter = [
                    { x: 150, y: 75, r: 10, label: "Algebra", z: 10 },
                    { x: 100, y: 45, r: 8, label: "Geometry", z: 5 },
                    { x: 200, y: 90, r: 12, label: "Arithmetic", z: 15 },
                    { x: 50, y: 30, r: 5, label: "Number System", z: 2 }
                ];

                setData({
                    scatter_plot: mockScatter,
                    raw_data: [] // The component might need this, we'll see
                });
                setUsingMock(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [granularity]);

    return { data, loading, usingMock };
};
