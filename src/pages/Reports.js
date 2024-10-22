import React, { useState, useEffect } from 'react';
import TotalsComponent from '../components/TotalsComponent'; // Assuming you have a TotalsComponent
import '../styles/Reports.css'; // Import your CSS styles


const Reports = () => {
    const [report, setReport] = useState(null);
    const [startDate, setStartDate] = useState("");  // Start Date
    const [endDate, setEndDate] = useState("");      // End Date
    const [location, setLocation] = useState("");    // Selected Neighborhood
    const [neighborhoods, setNeighborhoods] = useState([]);  // Neighborhoods array
    const [name, setName] = useState("");            // Report Name
    const [error, setError] = useState("");          // Error Handling
    // 定義下載 PDF 的函數
    const downloadReport = () => {
        fetch(`http://localhost:8000/download_report?name=${name}&start_date=${startDate}&end_date=${endDate}&location=${location}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.blob(); // 返回 Blob 格式的二進制數據
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob); // 創建 Blob 的 URL
                const link = document.createElement('a');    // 創建一個 <a> 標籤
                link.href = url;
                link.setAttribute('download', `${name}_crime_report.pdf`); // 設置文件名
                document.body.appendChild(link); // 將 <a> 加到 DOM 中
                link.click();  // 自動點擊，觸發下載
                link.remove(); // 下載完後刪除這個鏈接
            })
            .catch(error => console.error("Error downloading the report:", error)); // 捕捉錯誤
    };


    // Fetch neighborhood clusters from the backend
    useEffect(() => {
        const fetchNeighborhoods = () => {
            fetch(`http://localhost:8000/neighborhood_clusters`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        const validClusters = data.filter(cluster => typeof cluster === 'string' && cluster.trim() !== '');
                        // Format the neighborhoods as "Cluster 1", "Cluster 2", etc.
                        const formattedClusters = validClusters.map((cluster, index) => `Cluster ${index + 1}`);
                        setNeighborhoods(formattedClusters);  // Update state with the formatted neighborhoods
                    } else {
                        console.error('Unexpected data format:', data);
                    }
                })
                .catch(error => {
                    console.error("Error fetching neighborhood clusters:", error);
                });
        };

        fetchNeighborhoods();  // Fetch neighborhoods on component mount
    }, []);  // Run only once when the component mounts

    // Fetch report data from the FastAPI backend
    const fetchReportData = () => {
        if (!startDate || !endDate || !location) {
            setError("Please select start date, end date, and a neighborhood.");
            return;
        }

        // Clear previous error
        setError("");

        fetch(`http://localhost:8000/report?start_date=${startDate}&end_date=${endDate}&location=${location}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setReport(data);  // Set report data
            })
            .catch(error => {
                console.error("Error fetching report data:", error);
            });
    };

    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* Sidebar for Input */}
            <div style={{ width: "20%", padding: "20px", backgroundColor: "#2C2C2C", color: "white" }}>
                <h2>Crime Report Generator</h2>

                {/* Start Date Input */}
                <div>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ width: "100%", marginBottom: "10px", padding: "5px", backgroundColor: "#1B1B1B", color: "white", border: "1px solid gray" }}
                    />
                </div>

                {/* End Date Input */}
                <div>
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{ width: "100%", marginBottom: "10px", padding: "5px", backgroundColor: "#1B1B1B", color: "white", border: "1px solid gray" }}
                    />
                </div>

                {/* Neighborhood Select Input */}
                <div>
                    <label>Select Neighborhood/BID:</label>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ width: "100%", marginBottom: "10px", padding: "5px", backgroundColor: "#1B1B1B", color: "white", border: "1px solid gray" }}
                    >
                        <option value="">Select Neighborhood</option>
                        {neighborhoods.map((neighborhood, index) => (
                            <option key={index} value={neighborhood}>
                                {neighborhood}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => {
                        console.log("Button clicked!");
                        fetchReportData();
                    }}
                    style={{ width: "100%", padding: "10px", backgroundColor: "#1B1B1B", color: "white", border: "1px solid gray" }}
                >
                    Generate Report
                </button>



                {/* Error Handling */}
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            </div>

            {/* Main Content Area */}
            <div style={{ width: "75%", padding: "20px", backgroundColor: "#1C1C1C", color: "white" }}>
                {/* Display the Report */}
                {report && (
                    <div>
                        <h3>Displaying crime incidents from {startDate} to {endDate} in {location}</h3>

                        {/* Report Table */}
                        <table style={{ width: "100%", marginBottom: "20px", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ border: "1px solid gray", padding: "5px" }}>CCN</th>
                                    <th style={{ border: "1px solid gray", padding: "5px" }}>Report Date</th>
                                    <th style={{ border: "1px solid gray", padding: "5px" }}>Shift</th>
                                    <th style={{ border: "1px solid gray", padding: "5px" }}>Offense</th>
                                    <th style={{ border: "1px solid gray", padding: "5px" }}>Method</th>
                                    <th style={{ border: "1px solid gray", padding: "5px" }}>Ward</th>
                                    <th style={{ border: "1px solid gray", padding: "5px" }}>Neighborhood</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.slice(0, 15).map((row, index) => ( // Show top 6 results
                                    <tr key={index}>
                                        <td style={{ border: "1px solid gray", padding: "5px" }}>{row.ccn}</td>
                                        <td style={{ border: "1px solid gray", padding: "5px" }}>{row.REPORT_DAT}</td>
                                        <td style={{ border: "1px solid gray", padding: "5px" }}>{row.SHIFT}</td>
                                        <td style={{ border: "1px solid gray", padding: "5px" }}>{row.offense}</td>
                                        <td style={{ border: "1px solid gray", padding: "5px" }}>{row.method}</td>
                                        <td style={{ border: "1px solid gray", padding: "5px" }}>{row.ward}</td>
                                        <td style={{ border: "1px solid gray", padding: "5px" }}>{row.neighborhood_clusters}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Name Input */}
                        <div>
                            <label>Enter your name for the report:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: "100%", marginBottom: "10px", padding: "5px", backgroundColor: "#1B1B1B", color: "white", border: "1px solid gray" }}
                            />
                        </div>

                        {/* Button to Download Report
                        <button style={{ width: "100%", padding: "10px", backgroundColor: "#1B1B1B", color: "white", border: "1px solid gray" }}>
                            Generate and Download Crime Report
                        </button> */}
                        <button
                            onClick={() => {
                                console.log("Download button clicked!");
                                downloadReport();  // 這裡需要定義一個下載報告的函數
                            }}
                            style={{ width: "100%", padding: "10px", backgroundColor: "#1B1B1B", color: "white", border: "1px solid gray" }}
                        >
                            Generate and Download Crime Report
                        </button>

                    </div>
                )}

                {/* Variable Information */}
                <div style={{ marginTop: "20px" }}>
                    <h4>Variable Information:</h4>
                    <ul>
                        <li><strong>CCN (Criminal Complaint Number):</strong> Unique identifier for each crime report.</li>
                        <li><strong>REPORT_DAT (Crime Report Date):</strong> Date the crime was reported to MPD.</li>
                        <li><strong>SHIFT (MPD Shift):</strong> Shift during which the report was filed (Day, Evening, Midnight).</li>
                        <li><strong>OFFENSE (Crime Offense):</strong> The type of crime committed (e.g., robbery, theft).</li>
                        <li><strong>BLOCK (Block Name):</strong> Street block where the crime occurred.</li>
                        <li><strong>BID (Business Improvement District):</strong> Business Improvement District where the crime occurred.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Reports; // Ensure this is at the end
