"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css"

import PieChartBase from "./piechart.jsx";

import React from "react";

export default function DashboardRaccourci() {
  const [equipmentData, setEquipmentData] = useState([]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/stats/equipements/percentage-by-etat/")
      .then((res) => res.json())
      .then((equipmentRawData) => {
        setEquipmentData(formatEquipmentData(equipmentRawData));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des données du graphique circulaire :", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const formatEquipmentData = (rawData) => {
    const hasAutres = rawData.some(item => item.name === "Autres");
    if (!hasAutres) {
      rawData.push({ name: "Autres", value: 0 });
    }
    return rawData;
  };

  const pieColorMap = {
    "En service": "#0B57D0",
    "En maintenance": "#4F87D9",
    "En panne": "#B1CFF3",
    "Autres": "#D6E6FA",
  };

  return (
    <div className="w-full min-h-screen">

<PieChartBase
  title="Gardez un oeil sur la maintenance!"
  description="Retrouvez toutes les statistiques essentielles en un clic sur le tableau de bord."
  data={equipmentData}
  donut={true}
  showCenterText={false}
  colorMap={pieColorMap}
  onClick={handleClick}
/>
    </div>
  );
}