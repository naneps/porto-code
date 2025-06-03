
import { useState, useCallback, useEffect } from 'react';

export const useTabHistory = (
    activeTabId: string | null,
    setActiveTabId: (id: string | null) => void
) => {
    const [tabHistory, setTabHistory] = useState<string[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);

    const updateTabHistoryOnActivation = useCallback((newActiveTabId: string | null) => {
        if (newActiveTabId === null) { // If no tab is active, reset history or set to a neutral state
            // Option 1: Clear history if desired when no tab is active
            // setTabHistory([]);
            // setCurrentHistoryIndex(-1);
            // Option 2: Keep history but mark index as invalid (already done by setting activeTabId to null elsewhere)
            // This function typically is called when a tab *becomes* active.
            return;
        }

        setTabHistory(prevHistory => {
            // Truncate history if we've gone back and are now opening a new tab "branch"
            const newHistoryBase = prevHistory.slice(0, currentHistoryIndex + 1);
            // Only add if it's a new tab or a different tab than the current one in history
            if (newHistoryBase[newHistoryBase.length - 1] !== newActiveTabId) {
                newHistoryBase.push(newActiveTabId);
            }
            // Update current index after history is potentially modified
            setCurrentHistoryIndex(newHistoryBase.length - 1);
            return newHistoryBase;
        });
    }, [currentHistoryIndex]);


    const cleanTabHistoryOnClose = useCallback((closedTabId: string, newActiveTabId: string | null) => {
        setTabHistory(prevHistory => {
            const filteredHistory = prevHistory.filter(id => id !== closedTabId);
            if (newActiveTabId) {
                const newIndex = filteredHistory.indexOf(newActiveTabId);
                // If the new active tab is in history, point to it. Otherwise, it's like a new activation.
                setCurrentHistoryIndex(newIndex !== -1 ? newIndex : filteredHistory.length - 1);
            } else {
                // If no new active tab (all tabs closed), reset history index
                setCurrentHistoryIndex(filteredHistory.length > 0 ? filteredHistory.length - 1 : -1);
            }
            return filteredHistory;
        });
    }, []);


    const navigateTabHistoryBack = useCallback(() => {
        if (currentHistoryIndex > 0) {
            const newIndex = currentHistoryIndex - 1;
            setActiveTabId(tabHistory[newIndex]);
            setCurrentHistoryIndex(newIndex);
        }
    }, [currentHistoryIndex, tabHistory, setActiveTabId]);

    const navigateTabHistoryForward = useCallback(() => {
        if (currentHistoryIndex < tabHistory.length - 1) {
            const newIndex = currentHistoryIndex + 1;
            setActiveTabId(tabHistory[newIndex]);
            setCurrentHistoryIndex(newIndex);
        }
    }, [currentHistoryIndex, tabHistory, setActiveTabId]);
    
    // This effect ensures that if activeTabId is changed externally (e.g., by closing the last tab),
    // the history index is appropriately managed.
    useEffect(() => {
        if (activeTabId) {
            // If the active tab isn't the current one in history (e.g., after a close operation selected a previous tab)
            // or if the history is empty and a tab becomes active.
            if (tabHistory[currentHistoryIndex] !== activeTabId) {
                 updateTabHistoryOnActivation(activeTabId);
            }
        } else {
            // If activeTabId becomes null (no tabs open), ensure history index is reset if history is also empty.
            if (tabHistory.length === 0) { // Ensure this condition is met
                 setCurrentHistoryIndex(-1);
            }
        }
    }, [activeTabId, tabHistory, currentHistoryIndex, updateTabHistoryOnActivation]);


    return {
        tabHistory,
        currentHistoryIndex,
        updateTabHistoryOnActivation,
        navigateTabHistoryBack,
        navigateTabHistoryForward,
        cleanTabHistoryOnClose,
    };
};