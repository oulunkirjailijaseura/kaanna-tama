import { Loader2 } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

interface CreditsMonitorProps {
  fetchTrigger: boolean;
}

const CreditsMonitor: React.FC<CreditsMonitorProps> = ({ fetchTrigger }) => {
  const [currentCost, setCurrentCosts] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (fetchTrigger) {
      setRequestCount((prevCount) => prevCount + 1);
    }
  }, [fetchTrigger]);

  const fetchCredits = useCallback(async () => {
    try {
      const response = await fetch("/api/credits");
      const data = await response.json();

      if (response.ok) {
        setCurrentCosts(data.costs); // Expect 'costs' instead of 'hard_limit_usd'
        setError(null); // Clear any previous errors
      } else {
        setError(data.error || "Failed to fetch credits");
        setCurrentCosts(null); // Clear previous hard limit on error
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setCurrentCosts(null); // Clear previous hard limit on error
    }
  }, []);

  useEffect(() => {
    if (requestCount > 0 && requestCount % 10 === 0) {
      fetchCredits();
    }
  }, [requestCount, fetchCredits]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <p className="flex flex-row text-gray-500 items-center">
      Rahaa käytetty:{" $"}
      {currentCost !== null ? (
        currentCost.toFixed(2)
      ) : (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
    </p>
  );
};

export default CreditsMonitor;
