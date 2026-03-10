import { useState, useEffect, useCallback } from 'react';
import { getDeadlines, createDeadline, updateDeadline, deleteDeadline as apiDeleteDeadline } from '../services/deadline.service';

export function useDeadlines() {
    const [deadlines, setDeadlines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [upcomingAlert, setUpcomingAlert] = useState(null);

    const fetchDeadlines = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getDeadlines();
            if (res.success) {
                setDeadlines(res.data);

                // Check for alerts (due within 48h)
                const soon = res.data.find(d => {
                    const diff = new Date(d.dueDate) - new Date();
                    return diff > 0 && diff < (48 * 60 * 60 * 1000);
                });

                if (soon) {
                    setUpcomingAlert({
                        id: soon._id,
                        title: soon.title,
                        dueDate: soon.dueDate
                    });
                }
            }
        } catch (err) {
            setError('Failed to fetch deadlines');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDeadlines();
    }, [fetchDeadlines]);

    return {
        deadlines,
        isLoading,
        error,
        upcomingAlert,
        refresh: fetchDeadlines,
        createDeadline,
        updateDeadline,
        deleteDeadline: apiDeleteDeadline
    };
}
