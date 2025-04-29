"use client";

import { useEffect, useState } from "react";
import "../index.css"

import PieChartBase from "./piechart.jsx";

import React from "react";

export default function DashboardRaccourci() {

  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    fetch("/data/piechrt.json")
      .then((res) => res.json())
      .then(setPieChartData);
  }, []);

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
  data={pieChartData}
  donut={true}
  showCenterText={false}
  colorMap={pieColorMap}
/>
    </div>
  );
}