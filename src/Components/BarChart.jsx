import { Box, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";

import "../Styles/CommonStyling.css";

const BarChart = ({ month }) => {

  const [barChartData,setBarChartData] = useState([])
  
  const fetchBarChartData = async (month) => {
    try {
      
      const response = await axios.get(
        `https://easy-cyan-coati-tux.cyclic.app/barChart?month=${month}`
      );
      console.log('response:', response.data.priceRanges
      )

      setBarChartData(response.data.priceRanges)
   
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    if (month !== "") {
      fetchBarChartData(month);
    }
  }, [month]);


  useEffect(() => {
    const ctx = document.getElementById("myChart");
    let chartInstance = null;
  
    if (barChartData.length > 0) {
      // If a chart instance already exists, destroy it
      if (chartInstance) {
        chartInstance.destroy();
      }
  
      // Data for chart
      const labels = barChartData.map((data) => data.range);
      const data = barChartData.map((data) => data.count);
  
      // Create chart
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Count",
              data: data,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  
    // Cleanup function to destroy the chart instance when component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [barChartData]);
  
  return (
    <>
      <Heading className="commonHeading">Bar Chart Stats - {month}</Heading>
      <Box
        className="dataStatistics"
        w={["80%", "60%", "60%", "80%"]}
        border={"1px solid #86740a"} 
        borderRadius={'15px'}
      >
      <canvas id="myChart"></canvas>
    
      </Box>
    </>
  );
};

export default BarChart