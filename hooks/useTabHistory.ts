
import { useState, useCallback, useEffect } from 'react';

export const useTabHistory = (
    activeTabId: string | null,
    setActiveTabId: (id: string | null) => void
) => {
    const [tabHistory, setTabHistory] = useState<string[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);

    const updateTabHistoryOnActivation = useCallback((newActiveTabId: string) => {
        setTabHistory(prevHistory => {
            // Slice history up to current index + 1 (to discard forward history if any)
            const newHistoryBase = prevHistory.slice(0, currentHistoryIndex + 1);
            // If the new active tab is not already the last one in this base, add it
            if (newHistoryBase[newHistoryBase.length - 1] !== newActiveTabId) {
                newHistoryBase.push(newActiveTabId);
            }
            return newHistoryBase;
        });
        // Update current index to the end of the new history
        setCurrentHistoryIndex(prevIndex => {
             // Re-calculate based on the potentially updated tabHistory length
            const updatedHistory = tabHistory.slice(0, prevIndex + 1);
             if (updatedHistory[updatedHistory.length - 1] !== newActiveTabId) {
                 return updatedHistory.length; // This should point to the new tab we just pushed
             }
             const foundIndex = updatedHistory.indexOf(newActiveTabId);
             return foundIndex !== -1 ? foundIndex : prevIndex;
        });
    }, [currentHistoryIndex, tabHistory]);


    const cleanTabHistoryOnClose = useCallback((closedTabId: string, newActiveTabId: string | null) => {
        setTabHistory(prevHistory => {
            const filteredHistory = prevHistory.filter(id => id !== closedTabId);
            if (newActiveTabId) {
                const newIndex = filteredHistory.indexOf(newActiveTabId);
                setCurrentHistoryIndex(newIndex !== -1 ? newIndex : filteredHistory.length - 1);
            } else {
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
    }, [currentHistoryIndex, tabHistory, setActiveTabId, setCurrentHistoryIndex]);

    const navigateTabHistoryForward = useCallback(() => {
        if (currentHistoryIndex < tabHistory.length - 1) {
            const newIndex = currentHistoryIndex + 1;
            setActiveTabId(tabHistory[newIndex]);
            setCurrentHistoryIndex(newIndex);
        }
    }, [currentHistoryIndex, tabHistory, setActiveTabId, setCurrentHistoryIndex]);
    
    // Effect to initialize or adjust history when activeTabId is externally set (e.g. initial load, direct selection)
    useEffect(() => {
        if (activeTabId) {
            // Only update history if it's a "new" navigation not handled by back/forward
            if (tabHistory[currentHistoryIndex] !== activeTabId) {
                 updateTabHistoryOnActivation(activeTabId);
            }
        } else if (tabHistory.length === 0 && currentHistoryIndex === -1) {
            // Initial state, no active tab yet
        }
    }, [activeTabId]); // Removed updateTabHistoryOnActivation from deps to avoid loop with its own updates


    return {
        tabHistory,
        currentHistoryIndex,
        updateTabHistoryOnActivation,
        navigateTabHistoryBack,
        navigateTabHistoryForward,
        cleanTabHistoryOnClose,
    };
};
