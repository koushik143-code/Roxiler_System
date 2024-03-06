import {
  Box,
  Button,
  Heading,
  Image,
  Input,
  MenuItemOption,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import axios from "axios";

import { Bars } from "react-loader-spinner";

import "../Styles/Dashboard.css";
import BarChart from "./BarChart";
import Statistics from "./Statistics";
import PieChart from "./PieChart";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [loading, setLoading] = useState(false); // State to track loading status

  const fetchTransactions = async (searchText, page) => {
    try {
      setLoading(true);
      let response = await axios.get(
        `https://easy-cyan-coati-tux.cyclic.app/search?search=${searchText}&page=${page}&perPage=10`
      );
      console.log("response.data:", response.data);
      const responseData = response.data.transactions;

      setTransactions(responseData);
      setFilteredTransactions(responseData);

      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  };


  const fetchTransactionsByMonth = async (month, page) => {
    try {
      setLoading(true); // Set loading to true while fetching data
      const response = await axios.get(
        `https://easy-cyan-coati-tux.cyclic.app/search/search_month?month=${month}&page=${page}&perPage=10`
      );
      const responseData = response.data.transactions;
      setTransactions(responseData);
      setFilteredTransactions(responseData);
      setTotalPages(response.data.totalPages);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth !== "") {
      fetchTransactionsByMonth(selectedMonth, currentPage);
    } else if(searchText === ""){
      fetchTransactionsByMonth(selectedMonth, currentPage);
    } else{
      fetchTransactions(searchText, currentPage);
    }
  }, [selectedMonth, searchText, currentPage]);

  const handleSearch = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    // If search text is empty, reset currentPage to 1
    if (searchText === "") {
      setCurrentPage(1);
    }
    // Fetch transactions for the entered search text and current page
    fetchTransactions(searchText, currentPage);
  };

  const handlePaginationPrev = (currentPage) => {
    setCurrentPage(currentPage - 1);
  };

  const handlePaginationNext = (currentPage) => {
    setCurrentPage(currentPage + 1);
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setSelectedMonth(selectedMonth === "Select Month" ? "" : selectedMonth);
    setCurrentPage(1); // Reset currentPage when changing the month
  };

  const months = [
    "Select Month",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Helper function to truncate string
  const truncateString = (str, maxLength) => {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  };

  return (
    <>
      <Heading id="heading" textAlign={"center"}>
        Transactions Dashboard{" "}
      </Heading>

      <Box id="filterBox"  w={["50%", "70%", "60%", "80%"]} flexDirection={["column","row","row","row"]}>
        <Select
          w="100%"
          border={"1px solid teal"}
          color={"teal"}
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {months.map((month, index) => (
            <option style={{width:"100%"}} key={index} value={month}>
              {month}
            </option>
          ))}
        </Select>
        <Input
          border={"1px solid teal"}
          textColor={"teal"}
          placeholder="Search transaction"
          value={searchText}
          onChange={(e) => handleSearch(e)}
        />
      </Box>

      {loading ? (
        <Box display={"flex"} justifyContent={"center"} margin={"5rem"}>
          <Bars
            height="100"
            width="100"
            color="#208080"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </Box>
      ) : (
        <>
        <TableContainer overflowX="scroll">
          <Table  overflowX="scroll" size='sm' id="table" variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Price</Th>
                <Th>Image</Th>
                <Th>Category</Th>
                <Th>Sold Status</Th>
                <Th>Month</Th>
                <Th>Date of Sale</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredTransactions.map((transaction, index) => (
                <Tr key={index}>
                  <Td>{truncateString(transaction.title, 20)}</Td>
                  <Td>{truncateString(transaction.description, 20)}</Td>
                  <Td>{transaction.price.toFixed(2)}</Td>
                  <Td>
                    <Image
                      id="imageCss"
                      src={transaction.image}
                      alt="Transaction Image"
                    />
                  </Td>
                  <Td>{transaction.category}</Td>
                  <Td>{transaction.sold ? "SOLD" : "NOT SOLD"}</Td>
                  <Td>{transaction.month}</Td>
                  <Td>{transaction.dateOfSale}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          </TableContainer>
          <Box id="buttonBox">
            <Button
              onClick={() => handlePaginationPrev(currentPage)}
              isDisabled={currentPage === 1}
              color={"#208080"}
            >
              Previous
            </Button>
            <Text>{currentPage}</Text>
            <Button
              onClick={() => handlePaginationNext(currentPage)}
              isDisabled={currentPage === totalPages}
              color={"#208080"}
            >
              Next
            </Button>
          </Box>
        </>
      )}
      {/* <BarChart month={selectedMonth}/> */}
      {
        selectedMonth !== "" ? <Box id="MonthData">
        <Statistics month={selectedMonth}/>
        <BarChart month={selectedMonth}/>
        <PieChart month={selectedMonth}/>
        </Box> : <></>
      }
     
    </>
  );
};

export default Dashboard;
