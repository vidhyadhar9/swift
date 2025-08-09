import { useEffect, useState } from "react";

const DashBoard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Fetch data
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/comments");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let data = await response.json();

        // Mock phone numbers for demo
        data = data.map((item, index) => ({
          ...item,
          
        }));

        setRecords(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Search filtering
  const filteredRecords = records.filter(
    (record) =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic with cycle
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
      key = null;
    }
    setSortConfig({ key, direction });
  };

  let sortedRecords = [...filteredRecords];
  if (sortConfig.key && sortConfig.direction) {
    sortedRecords.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const getPaginationRange = () => {
    const range = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) range.push(i);
    return range;
  };

  // Helper to highlight sorted column
  const highlightStyle = { backgroundColor: "#ffeeba" };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <h1>Records</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, or phone"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        style={{
          padding: "8px",
          marginBottom: "15px",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
        <thead>
          <tr>
            <th
              onClick={() => requestSort("postId")}
              style={{
                cursor: "pointer",
                ...(sortConfig.key === "postId" ? highlightStyle : {}),
              }}
            >
              PostID {sortConfig.key === "postId" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              onClick={() => requestSort("name")}
              style={{
                cursor: "pointer",
                ...(sortConfig.key === "name" ? highlightStyle : {}),
              }}
            >
              Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              onClick={() => requestSort("email")}
              style={{
                cursor: "pointer",
                ...(sortConfig.key === "email" ? highlightStyle : {}),
              }}
            >
              Email {sortConfig.key === "email" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((record) => (
            <tr key={record.id}>
              <td style={sortConfig.key === "postId" ? highlightStyle : {}}>{record.postId}</td>
              <td style={sortConfig.key === "name" ? highlightStyle : {}}>{record.name}</td>
              <td style={sortConfig.key === "email" ? highlightStyle : {}}>{record.email}</td>
              <td>{record.body}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "20px",
          gap: "10px",
        }}
      >
        <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>
          Previous
        </button>

        {getPaginationRange().map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            disabled={currentPage === page}
          >
            {page}
          </button>
        ))}

        <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>
          Next
        </button>

        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          Records per page:
          <select
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default DashBoard;
