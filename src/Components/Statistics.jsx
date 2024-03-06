import { Box, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

import "../Styles/CommonStyling.css";

const Statistics = ({ month }) => {
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSoldItems, setTotalSoldItems] = useState(0);
  const [totalNotSoldItems, setTotalNotSoldItems] = useState(0);

  const fetchStatistics = async (month) => {
    try {
      const response = await axios.get(
        `https://easy-cyan-coati-tux.cyclic.app/statistics?month=${month}`
      );
      setTotalSaleAmount(response.data.totalSaleAmount);
      setTotalSoldItems(response.data.totalSoldItems);
      setTotalNotSoldItems(response.data.totalNotSoldItems);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    if (month !== "") {
      fetchStatistics(month);
    }
  }, [month]);
  return (
    <>
      <Heading className="commonHeading">Statistics - {month}</Heading>
      <Box
        className="dataStatistics"
        w={["90%", "70%", "60%", "40%"]}
        border={"1px solid #86740a"} 
        borderRadius={'15px'}
      >
        <Text className="textStatistics" >Total Sale - <span style={{
            color:"#86740a" 
        }}>{totalSaleAmount.toFixed(2)}</span></Text>
        <Text className="textStatistics" >Total Sold Items - <span style={{
            color:"#86740a" 
        }}>{totalSoldItems}</span> </Text>
        <Text className="textStatistics" >Total Not Sold Items - <span style={{
            color:"#86740a" 
        }}>{totalNotSoldItems}</span></Text>
      </Box>
    </>
  );
};

export default Statistics;
