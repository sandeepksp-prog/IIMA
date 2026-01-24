import { useState, useEffect, useRef } from 'react';

export default function useActivityDetection(timeoutMs = 60000) {
    const [isOnline, setIsOnline] = useState(false); // Default to offline/idle
    const timeoutRef = useRef(null);

    const goOnline = () => {
        setIsOnline(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Go offline after timeoutMs of inactivity
        timeoutRef.current = setTimeout(() => {
            setIsOnline(false);
        }, timeoutMs);
    };

    useEffect(() => {
        // Initial wake up
        goOnline();

        const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

        const handleActivity = () => {
            // Optimization: Don't state update if already online and timer is just refreshing
            // But we need to refresh the timer either way
            goOnline();
        };

        // Throttle slightly to avoid excessive calls on mousemove
        let throttleTimer;
        const throttledHandler = () => {
            if (!throttleTimer) {
                throttleTimer = setTimeout(() => {
                    handleActivity();
                    throttleTimer = null;
                }, 500);
            }
        };

        events.forEach(event => window.addEventListener(event, throttledHandler));

        return () => {
            events.forEach(event => window.removeEventListener(event, throttledHandler));
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [timeoutMs]);

    return isOnline;
}
