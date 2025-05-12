"use client";

import { useEffect, useState } from "react";
import "../index.css";

import Header from "../components/Header";
import CategoryBarChart from "../dashboard/barchart.jsx";
import PieChartWithLegend from "../dashboard/piechart.jsx";
import LineChartCard from "../dashboard/linechart.jsx";
import TechnicianInterventionChart from "../dashboard/multiplebarchart.jsx";
import InterventionProgressCard from "../dashboard/percentagechart.jsx";
import InfoCard from "../components/InfoCard.jsx";
import Button from "../components/Button";
import exportDashboardToPDF from "../components/exportDashboardPdf";
import exportDashboardToExcel from "../components/exportDashboardExcel";

import upload from "../assets/upload.svg";
import excelExport from "../assets/excelExport.svg";


// Utility function to transform technician intervention data
const transformTechnicianData = (apiData) => {
  return apiData.map((item) => ({
    technician: item.technician.split(": ")[1], // Extract just the email
    Terminee: Math.round(item.status_percentages.terminée),
    EnCours: Math.round(item.status_percentages["en cours"]),
    Annulee: Math.round(item.status_percentages.annulée),
  }));
};

export default function DashboardPage() {
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [mixedBarChartData, setMixedBarChartData] = useState([]);
  const [multipleBarChartData, setMultipleBarChartData] = useState([]);
  const [percentageChartData, setPercentageBarChartData] = useState([]);
  const [stats, setStats] = useState({ interventions: 0, equipements: 0 });
  const [resolutionTimeData, setResolutionTimeData] = useState([]);
  const [technicianChartData, setTechnicianChartData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [interventionsByMonth, setInterventionsByMonth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfExportLoading, setPdfExportLoading] = useState(false);
  const [excelExportLoading, setExcelExportLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/data/delays.json").then((res) => res.json()),
      fetch("/data/piechrt.json").then((res) => res.json()),
      fetch("/data/linechart.json").then((res) => res.json()),
      fetch("/data/mixedbar.json").then((res) => res.json()),
      fetch("/data/multiplebar.json").then((res) => res.json()),
      fetch("https://esi-track-deployement.onrender.com/api/stats/interventions/count/").then(
        (res) => res.json()
      ),
      fetch("https://esi-track-deployement.onrender.com/api/stats/equipements/count/").then((res) =>
        res.json()
      ),
      fetch(
        "https://esi-track-deployement.onrender.com/api/stats/interventions/average-resolution-time/"
      ).then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      }),
      fetch(
        "https://esi-track-deployement.onrender.com/api/stats/technicians/intervention-status-percentage/"
      ).then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      }),
      fetch(
        "https://esi-track-deployement.onrender.com/api/stats/equipements/percentage-by-etat/"
      ).then((res) => res.json()),
      fetch(
        "https://esi-track-deployement.onrender.com/api/stats/interventions/percentage-by-status/"
      ).then((res) => res.json()),
      fetch("https://esi-track-deployement.onrender.com/api/stats/interventions/by-month/").then(
        (res) => res.json()
      ),
    ])
      .then(
        ([
          delaysData,
          pieData,
          lineData,
          mixedBarData,
          multipleBar,
          interventionsCount,
          equipmentsCount,
          resolutionTimeRawData,
          technicianRawData,
          equipmentRawData,
          statusPercentageRawData,
          interventionsByMonthRawData,
        ]) => {
          setBarChartData(delaysData);
          setPieChartData(pieData);
          setLineChartData(lineData);
          setMixedBarChartData(mixedBarData);
          setMultipleBarChartData(multipleBar);

          const formattedStatusData = statusPercentageRawData.map((item) => ({
            label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            value: Math.round(item.percentage),
          }));
          setPercentageBarChartData(formattedStatusData);

          setStats({
            interventions: interventionsCount.intervention_count || 0,
            equipements: equipmentsCount.equipment_count || 0,
          });
          setResolutionTimeData(
            formatResolutionTimeData(resolutionTimeRawData)
          );
          setTechnicianChartData(transformTechnicianData(technicianRawData));
          setEquipmentData(formatEquipmentData(equipmentRawData));
          setInterventionsByMonth(
            interventionsByMonthRawData.map((item) => ({
              month: item.month,
              Preventives: item.preventive_count,
              Curatives: item.currative_count,
            }))
          );
          setLoading(false);
        }
      )
      .catch((error) => {
        console.error("Erreur lors du chargement des données :", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const formatResolutionTimeData = (rawData) => {
    return rawData.map((item) => {
      const days = item["avgTime (days)"];
      const isInHours = days < 1;
      const value = isInHours ? Math.round(days * 24) : Math.round(days);
      const displayTime = isInHours ? `${value}h` : `${value}j`;
      return {
        category: item.category,
        avgTime: value,
        displayTime,
        originalDays: days,
      };
    });
  };

  const formatEquipmentData = (rawData) => {
    const hasAutres = rawData.some((item) => item.name === "Autres");
    if (!hasAutres) {
      rawData.push({ name: "Autres", value: 0 });
    }
    return rawData;
  };

  const pieColorMap = {
    "En service": "#20599E",
    "En maintenance": "#5883B6",
    "En panne": "#8FACCF",
    Autres: "#C7D5E7",
  };
  const lineColorMap = {
    Preventives: "#F09C0A",
    Curatives: "#20599E",
  };

  if (error) {
    return <div>Error loading dashboard data: {error.message}</div>;
  }

  // Prepare dashboard data for export
  const getDashboardData = () => ({
    stats,
    resolutionTimeData,
    technicianData: technicianChartData,
    equipmentData,
    interventionsByMonth,
    percentageChartData
  });

  const handleExportPDF = async () => {
    try {
      setPdfExportLoading(true);
      await exportDashboardToPDF(getDashboardData());
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setPdfExportLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExcelExportLoading(true);
      await exportDashboardToExcel(getDashboardData());
    } catch (error) {
      console.error("Error exporting Excel:", error);
    } finally {
      setExcelExportLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen font-poppins">
      <Header bleu />
      <div className="export-controls p-4 flex justify-end space-x-4">
        <div className="flex items-center justify-center space-x-4 px-20">
          <div
            onClick={handleExportPDF}
            className={`cursor-pointer flex items-center space-x-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-md ${pdfExportLoading ? 'opacity-50' : ''}`}
            title="Exporter en PDF"
            disabled={pdfExportLoading}
          >
            {pdfExportLoading ? (
              <span className="animate-spin inline-block h-5 w-5 border-t-2 border-b-2 border-blue-600 rounded-full mr-2"></span>
            ) : (
              <img
                src={upload}
                alt="export pdf"
                className="h-[20px] w-[20px] shrink-0"
              />
            )}
            <span className="text-sm">Import PDF</span>
          </div>

          <div
            onClick={handleExportExcel}
            className={`cursor-pointer flex items-center space-x-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-md ${excelExportLoading ? 'opacity-50' : ''}`}
            title="Exporter en Excel"
            disabled={excelExportLoading}
          >
            {excelExportLoading ? (
              <span className="animate-spin inline-block h-5 w-5 border-t-2 border-b-2 border-green-600 rounded-full mr-2"></span>
            ) : (
              <img
                src={excelExport}
                alt="export excel"
                className="h-[20px] w-[20px] shrink-0 "
              />
            )}
            <span className="text-sm">Import Excel</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid max-w-full px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 pb-4 sm:pb-6">
          <InfoCard
            label="Nombre des interventions"
            value={stats.interventions}
            bgColorClass="bg-[#B4C6DA]"
            textColorClass="text-black"
          />
          <InfoCard
            label="Nombre des équipements"
            value={stats.equipements}
            bgColorClass="bg-[#F3DAAE]"
            textColorClass="text-black"
          />
        </div>

        <div className="flex flex-row justify-between flex-wrap sm:flex-wrap lg:flex-nowrap gap-4 sm:gap-6">
          <LineChartCard
            title="Interventions par mois"
            data={interventionsByMonth}
            colorMap={lineColorMap}
            xAxisKey="month"
          />
          <InterventionProgressCard data={percentageChartData} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 w-full py-6">
          <div className="flex-1">
            <PieChartWithLegend
              title="Suivi des Équipements"
              description=""
              data={equipmentData}
              value="value"
              nameKey="name"
              colorMap={pieColorMap}
            />
          </div>

          <div className="flex-1">
            <TechnicianInterventionChart
              title="Répartition des interventions par technicien"
              data={technicianChartData}
            />
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <CategoryBarChart
            title="Délais moyens de résolution des tâches par catégorie d'équipement"
            description="Mise à jour ce mois-ci"
            data={resolutionTimeData}
            dataKey="avgTime"
            nameKey="category"
            displayKey="displayTime"
          />
        </div>
      </div>
    </div>
  );
}
