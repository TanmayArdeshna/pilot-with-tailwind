import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgCharts } from "ag-charts-react"; // Updated import

const BarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  // Fetch data from the provided API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = getCookie("token"); // Retrieve the token from cookies

        if (!userId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        if (!token) {
          setError("Token not found");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${apiUrl}/main-topics/${userId}/subtopic-percentages`,
          {}, // Body can be empty
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass the token in the Authorization header
              Id: userId,                        // Pass userId as Id in the headers
            },
          }
        );

        const processChartData = (data) => {
          const formattedData = data.map((topic) => {
            const result = { mainTopicName: topic.mainTopicName }; // X-axis is the mainTopicName
            topic.subTopics.forEach((subTopic) => {
              result[subTopic.subTopicName] = subTopic.averagePercentage;
            });
            return result;
          });

          // Create dynamic series based on subTopics across all topics
          const allSubTopics = [
            ...new Set(
              data.flatMap((topic) =>
                topic.subTopics.map((subTopic) => subTopic.subTopicName)
              )
            ),
          ];

          const dynamicSeries = allSubTopics.map((subTopicName) => ({
            type: "bar",
            xKey: "mainTopicName", // X-axis key
            yKey: subTopicName, // Y-axis key is the subTopic name
            yName: subTopicName, // Label for the bar
            stacked: true, // Make the bars stacked
            fill: getRandomColor(), // Assign a random color to each subtopic
          }));

          setChartData(formattedData);
          setSeries(dynamicSeries);
        };

        processChartData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // Function to generate a random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const options = {
    data: chartData,
    series: series, // Dynamic series for each subtopic
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "Main Topics" },
      },
      {
        type: "number",
        position: "left",
        title: { text: "Average Percentage" },
      },
    ],
    legend: {
      position: 'bottom',
      padding: 10, // Adjust padding around the legend
    },
    padding: {
      bottom: 0, // Remove any padding at the bottom of the chart
    },
    height: 500, // Increase height to make the bars longer
  };

  return (
    <>
      {loading ? (
        <p>Loading chart...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div style={{ height: "500px" }}> {/* Adjust container height */}
          <AgCharts options={options} />
        </div>
      )}
    </>
  );
};

export default BarChart;
