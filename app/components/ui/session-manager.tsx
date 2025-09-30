"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useGlobalForm } from "@/app/context/global-form-context";

interface SessionManagerContextType {
  isOnline: boolean;
  lastSync: Date | null;
  sessionHealth: "healthy" | "warning" | "error";
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (enabled: boolean) => void;
  forceSync: () => Promise<void>;
  getSessionStats: () => {
    sessionAge: number;
    dataSize: number;
    stepProgress: number;
  };
}

const SessionManagerContext = createContext<SessionManagerContextType | null>(null);

interface SessionManagerProviderProps {
  children: React.ReactNode;
  autoSaveInterval?: number; // in seconds
  maxSessionAge?: number; // in hours
}

export function SessionManagerProvider({
  children,
  autoSaveInterval = 30,
  maxSessionAge = 24,
}: SessionManagerProviderProps) {
  const { state, saveSession, loadSession, clearSession } = useGlobalForm();
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [sessionHealth, setSessionHealth] = useState<"healthy" | "warning" | "error">(
    "healthy"
  );
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Force sync function
  const forceSync = useCallback(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        saveSession();
        setLastSync(new Date());
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }, [saveSession]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(async () => {
      try {
        await forceSync();
        setSessionHealth("healthy");
      } catch (error) {
        console.warn("Auto-save failed:", error);
        setSessionHealth("warning");
      }
    }, autoSaveInterval * 1000);

    return () => clearInterval(interval);
  }, [autoSaveEnabled, autoSaveInterval, forceSync]);

  // Session health monitoring
  useEffect(() => {
    const checkSessionHealth = () => {
      try {
        const sessionAge = Date.now() - state.lastUpdated;
        const maxAge = maxSessionAge * 60 * 60 * 1000; // Convert to ms

        if (sessionAge > maxAge) {
          setSessionHealth("error");
        } else if (sessionAge > maxAge * 0.8) {
          setSessionHealth("warning");
        } else {
          setSessionHealth("healthy");
        }

        // Check storage quota
        if ("storage" in navigator && "estimate" in navigator.storage) {
          navigator.storage.estimate().then((estimate) => {
            const usage = estimate.usage || 0;
            const quota = estimate.quota || 1;
            const usagePercentage = usage / quota;

            if (usagePercentage > 0.9) {
              setSessionHealth("error");
            } else if (usagePercentage > 0.8) {
              setSessionHealth("warning");
            }
          });
        }
      } catch (error) {
        setSessionHealth("error");
      }
    };

    const healthInterval = setInterval(checkSessionHealth, 60000); // Check every minute
    checkSessionHealth(); // Initial check

    return () => clearInterval(healthInterval);
  }, [state.lastUpdated, maxSessionAge]);

  // Get session statistics
  const getSessionStats = useCallback(() => {
    const sessionAge = Date.now() - state.lastUpdated;

    // Calculate approximate data size
    const dataString = JSON.stringify(state);
    const dataSize = new Blob([dataString]).size;

    // Calculate progress based on completed fields
    let completedFields = 0;
    let totalFields = 0;

    // Count property info fields
    const propertyFields = Object.values(state.propertyInfo);
    totalFields += propertyFields.length;
    completedFields += propertyFields.filter(
      (field) => field !== null && field !== "" && field !== 0
    ).length;

    // Count rental info fields
    const rentalFields = Object.values(state.rentalInfo);
    totalFields += rentalFields.length;
    completedFields += rentalFields.filter(
      (field) => field !== null && field !== "" && field !== false
    ).length;

    // Count user profile fields
    const userFields = Object.values(state.userProfile);
    totalFields += userFields.length;
    completedFields += userFields.filter(
      (field) => field !== null && field !== "" && field !== false
    ).length;

    const stepProgress = Math.round((completedFields / totalFields) * 100);

    return {
      sessionAge: Math.floor(sessionAge / 60000), // in minutes
      dataSize: Math.round(dataSize / 1024), // in KB
      stepProgress,
    };
  }, [state]);

  // Handle page visibility changes (auto-save when user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && autoSaveEnabled) {
        forceSync().catch(console.warn);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [autoSaveEnabled, forceSync]);

  const contextValue: SessionManagerContextType = {
    isOnline,
    lastSync,
    sessionHealth,
    autoSaveEnabled,
    setAutoSaveEnabled,
    forceSync,
    getSessionStats,
  };

  return (
    <SessionManagerContext.Provider value={contextValue}>
      {children}
    </SessionManagerContext.Provider>
  );
}

export const useSessionManager = (): SessionManagerContextType => {
  const context = useContext(SessionManagerContext);
  if (!context) {
    throw new Error("useSessionManager must be used within a SessionManagerProvider");
  }
  return context;
};

// Session health indicator component
export function SessionHealthIndicator({ className = "" }: { className?: string }) {
  const { sessionHealth, isOnline, lastSync, getSessionStats } = useSessionManager();
  const [stats, setStats] = useState(getSessionStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getSessionStats());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [getSessionStats]);

  const getHealthColor = () => {
    if (!isOnline) return "text-red-600";
    switch (sessionHealth) {
      case "healthy":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getHealthMessage = () => {
    if (!isOnline)
      return "Hors ligne - les données seront synchronisées à la reconnexion";
    switch (sessionHealth) {
      case "healthy":
        return "Session saine";
      case "warning":
        return "Session expirée bientôt";
      case "error":
        return "Session expirée ou erreur de stockage";
      default:
        return "État inconnu";
    }
  };

  return (
    <div className={`text-xs flex items-center justify-between ${className}`}>
      <div className={`flex items-center gap-1 ${getHealthColor()}`}>
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline && sessionHealth === "healthy"
              ? "bg-green-500 animate-pulse"
              : isOnline && sessionHealth === "warning"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        />
        <span>{getHealthMessage()}</span>
      </div>

      <div className="text-gray-500">
        {stats.dataSize}KB • {stats.stepProgress}% complété
      </div>
    </div>
  );
}
