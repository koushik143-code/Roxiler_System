import { Box, Heading } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto"; 

import "../Styles/CommonStyling.css";

const PieChart = ({month}) => {
  const [pieChartData, setPieChartData] = useState([]);

  const fetchPieChartData = async (month) => {
    try {
      const response = await axios.get(
        `https://easy-cyan-coati-tux.cyclic.app/pieChart?month=${month}`
      );
      setPieChartData(response.data.categories);
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  };

  useEffect(() => {
    fetchPieChartData(month);
  }, []);

  useEffect(() => {
    const ctx = document.getElementById("pieChart");
    let chartInstance = null;

    if (pieChartData.length > 0) {
      // If a chart instance already exists, destroy it
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Data for chart
      const labels = pieChartData.map((data) => data.category);
      const data = pieChartData.map((data) => data.count);

      // Create chart
     
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Categories",
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
                "rgba(75, 192, 192, 0.5)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }
    
    // Cleanup function to destroy the chart instance when component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [pieChartData]);

  return (
    <>
      <Heading className="commonHeading">Pie Chart Stats - {month}</Heading>
      <Box
        className="dataStatistics"
        w={["70%", "50%", "50%", "30%"]}
        border={"1px solid #86740a"}
        borderRadius={"15px"}
      >
        <canvas id="pieChart"></canvas>
      </Box>
    </>
  );
};

export default PieChart;
