import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/comments"
        );
        if (!response.ok) throw new Error("Network error");
        let data = await response.json();
        setRecords(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter
  const filtered = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort
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

  let sorted = [...filtered];
  if (sortConfig.key && sortConfig.direction) {
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(sorted.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = sorted.slice(indexOfFirst, indexOfLast);

  const highlight = { backgroundColor: "#f1f5f9" };

  const setRecord = (recordsSize) => {
      setRecordsPerPage(recordsSize);
  }
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoBox}>S</span>WiFT
        </div>
        <button onClick={()=>navigate('/profile')}>
          <div style={styles.user}>
          <div style={styles.userIcon }>
            EH
            </div>
          <span >Ervin Howell</span>
        </div>
        </button>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div>
          <button style={styles.btn} onClick={() => requestSort("postId")}>
            Sort Post ID
          </button>
          <button style={styles.btn} onClick={() => requestSort("name")}>
            Sort Name
          </button>
          <button style={styles.btn} onClick={() => requestSort("email")}>
            Sort Email
          </button>
        </div>
        <input
          type="text"
          placeholder="Search name, email, comment"
          style={styles.search}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Post ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Comment</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((r) => (
            <tr key={r.id} style={styles.tr}>
              <td style={sortConfig.key === "postId" ? highlight : {}}>
                {r.postId}
              </td>
              <td style={sortConfig.key === "name" ? highlight : {}}>
                {r.name}
              </td>
              <td style={sortConfig.key === "email" ? highlight : {}}>
                {r.email}
              </td>
              <td>{r.body}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          style={styles.pageBtn}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        
          <button
            key={currentPage + 1}
            style={{
              ...styles.pageBtn,
              fontWeight: currentPage === currentPage + 1 ? "bold" : "normal",
            }}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            {currentPage+ 1}
          </button>
            <button
            key={currentPage + 2}
            style={{
              ...styles.pageBtn,
              fontWeight: currentPage === currentPage + 2 ? "bold" : "normal",
            }}
            onClick={() => setCurrentPage(currentPage + 2)}
          >
            {currentPage + 2}
          </button>
        <button
          style={styles.pageBtn}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
        {/* write a label for  */}
        <label>
          <select onChange={(e) => setRecord(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
        
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    paddingBottom: "40px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: "15px 30px",
    alignItems: "center",
  },
  logo: { display: "flex", alignItems: "center", fontWeight: "bold" },
  logoBox: {
    backgroundColor: "#22c55e",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "4px",
    marginRight: "8px",
  },
  user: { display: "flex", alignItems: "center", gap: "10px" },
  userIcon: {
    backgroundColor: "#334155",
    padding: "8px",
    borderRadius: "50%",
    fontSize: "12px",
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 30px",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  btn: {
    padding: "8px 12px",
    marginRight: "5px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
  },
  search: {
    padding: "8px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    width: "250px",
  },
  table: {
    width: "95%",
    margin: "0 auto",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    backgroundColor: "#e2e8f0",
    textAlign: "left",
    padding: "10px",
    fontSize: "14px",
  },
  tr: {
    borderBottom: "1px solid #e2e8f0",
  },
  pagination: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "5px",
    marginTop: "20px",
    paddingRight: "30px",
  },
  pageBtn: {
    padding: "6px 10px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Dashboard;
