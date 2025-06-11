

import { database, ref, increment as firebaseIncrement, get as firebaseGet } from './firebase';
import { StatisticsData } from '../App/types';
import { STATISTICS_FIREBASE_PATH } from '../App/constants';

/**
 * Increments a statistic counter in Firebase Realtime Database.
 * @param pathSuffix The specific path under /app_statistics/ to increment (e.g., 'app_loads/total').
 */
export async function incrementStatistic(pathSuffix: string): Promise<void> {
  try {
    const statRef = ref(database, `${STATISTICS_FIREBASE_PATH}/${pathSuffix}`);
    await firebaseIncrement(statRef, 1);
    // console.log(`Statistic incremented: ${STATISTICS_FIREBASE_PATH}/${pathSuffix}`);
  } catch (error) {
    console.error(`Failed to increment statistic at ${STATISTICS_FIREBASE_PATH}/${pathSuffix}:`, error);
    // Optionally, log this error to a more persistent system or notify admins.
  }
}

/**
 * Fetches all statistics data from Firebase Realtime Database.
 * @returns A Promise that resolves to the StatisticsData object or null if an error occurs or no data exists.
 */
export async function fetchStatistics(): Promise<StatisticsData | null> {
  try {
    const statsRef = ref(database, STATISTICS_FIREBASE_PATH);
    const snapshot = await firebaseGet(statsRef);
    if (snapshot.exists()) {
      return snapshot.val() as StatisticsData;
    }
    return null; // No data exists at the path
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    return null; // Return null or throw, depending on desired error handling
  }
}

// If real-time listening is needed later, it can be added here.
// For now, StatisticsPanel will fetch on mount/visibility.