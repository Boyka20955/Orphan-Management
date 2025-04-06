import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"; // Updated path
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"; // Updated path
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"; // Updated path
import { Child, HealthRecord } from "../types"; // Updated path
import { format } from "date-fns";

const Reports = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childrenResponse = await axios.get('/api/children'); // Adjust the endpoint as necessary
        setChildren(childrenResponse.data);

        const healthRecordsResponse = await axios.get('/api/health-records');
        setHealthRecords(healthRecordsResponse.data);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Render your reports using the fetched data */}
    </div>
  );
};

export default Reports;