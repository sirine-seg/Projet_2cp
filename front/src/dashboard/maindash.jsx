"use client";

import { useEffect, useState } from "react";
import "../index.css"

import CategoryBarChart from "../dashboard/barchart.jsx";
import PieChartWithLegend from "../dashboard/piechart.jsx";
import LineChartCard from "../dashboard/linechart.jsx";
import BarChartCard from "../dashboard/mixedbarchart.jsx"; // ✅ Make sure this path matches your project structure
import TechnicianInterventionChart from "../dashboard/multiplebarchart.jsx";
import InterventionProgressCard from  "../dashboard/percentagechart.jsx";
import InfoCard from '../components/InfoCard.jsx';
import PieChartBase from "../dashboard/piechart.jsx";
export default function DashboardPage() {
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [mixedBarChartData, setMixedBarChartData] = useState([]);
  const [multipleBarChartData, setMultipleBarChartData] = useState([]);
  const [percentageChartData, setPercentageBarChartData] = useState([]);

  // Fetching data
  useEffect(() => {
    fetch("/data/delays.json")
      .then((res) => res.json())
      .then(setBarChartData);
  }, []);

  // Fetching data for Pie Chart
  useEffect(() => {
    fetch("/data/piechrt.json")
      .then((res) => res.json())
      .then(setPieChartData);
  }, []);

  useEffect(() => {
    fetch("/data/linechart.json")
      .then((res) => res.json())
      .then(setLineChartData);
  }, []);

  useEffect(() => {
    fetch("/data/mixedbar.json")
      .then((res) => res.json())
      .then( setMixedBarChartData);
  }, []);

  useEffect(() => {
    fetch("/data/multiplebar.json")
      .then((res) => res.json())
      .then(setMultipleBarChartData );
  }, []);

  useEffect(() => {
    fetch("/data/mini.json")
      .then((res) => res.json())
      .then(setPercentageBarChartData);
  }, []);


  const pieColorMap = {
    "En service": "#0B57D0",
    "En maintenance": "#4F87D9",
    "En panne": "#B1CFF3",
    "Autres": "#D6E6FA",
  };
  const lineColorMap = {
    Preventives: "#facc15", // yellow
    Curatives: "#2563eb",   // blue
  };
  
  return (
    <div className="dashboard-grid  max-w-full p-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <InfoCard
        label="Nombre des interventions"
        value={100}
        bgColorClass="bg-blue-200"
        textColorClass="text-black"
      />
      <InfoCard
        label="Nombre des équipements"
        value={765}
        bgColorClass="bg-yellow-200"
        textColorClass="text-black"
      />
      <InfoCard
        label="Nombre des utilisateurs"
        value={60}
        bgColorClass="bg-blue-200"
        textColorClass="text-black"
      />
      <InfoCard
        label="Nombre des techniciens"
        value={20}
        bgColorClass="bg-yellow-200"
        textColorClass="text-black"
      />
      {/* Add more components if needed */}
    </div>
 
  
   <div className="flex flex-row justify-between  flex-wrap sm:flex-wrap lg:flex-nowrap">
    
      <LineChartCard
        title="School Visitors"
        description="Jan - Apr 2024"
        data={lineChartData}
        colorMap={lineColorMap}
        xAxisKey="month"
        
      />
   
      <InterventionProgressCard data={percentageChartData} />
   
    </div>

    <div className="flex flex-row justify-between  flex-wrap sm:flex-wrap lg:flex-nowrap">
    <BarChartCard
        title="Browser Usage"
        description="January - June 2024"
        data={mixedBarChartData}
        dataKey="value"
        labelKey="label"
        barColor="#F09C0A"
        barSize={25}
      />
    
    
      <PieChartWithLegend
        title="Suivi des Équipements"
        description=""
        data={pieChartData}
        value="value"
        nameKey="name"
        colorMap={pieColorMap}
      />
   
    </div>

    <div className="mb-6">
  <TechnicianInterventionChart
    title="Répartition des interventions par technicien"
    data={multipleBarChartData}
  />
</div>

<div className="mb-6">
  <CategoryBarChart
    title="Délais moyens de résolution des tâches par catégorie d'équipement"
    description="Mise à jour ce mois-ci"
    data={barChartData}
  />
</div>
    

<PieChartBase
  title="Suivi des Équipements"
  description=""
  data={pieChartData}
  donut={true}
  showCenterText={false}
  colorMap={pieColorMap}
/>

    {/* ... and so on for other chart components */}
    
   
   
    
  </div>
  );
}
