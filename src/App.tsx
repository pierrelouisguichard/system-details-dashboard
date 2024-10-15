import { useEffect, useState } from "react";
import { db } from "./firebase"; // Adjust the path as necessary
import { collection, getDocs } from "firebase/firestore";
import styled from "styled-components";

interface Partition {
  percentage: number;
  device: string;
  free: string;
  total_size: string;
  used: string;
}

interface SystemInfo {
  id: string;
  user: string;
  pc_name: string;
  os: string;
  processor: string;
  ram: string;
  ip_address: string;
  mac_address: string;
  boot_time: string;
  collected_at: string;
  partitions: Partition[];
}

// Styled components
const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
`;

const TableHeader = styled.th`
  background-color: #4caf50;
  color: white;
  padding: 12px;
  text-align: left;
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }

  &:hover {
    background-color: #ddd;
  }
`;

function App() {
  const [data, setData] = useState<SystemInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "system_info"));
        const allData: SystemInfo[] = [];
        querySnapshot.forEach((doc) => {
          allData.push({ id: doc.id, ...doc.data() } as SystemInfo);
        });
        setData(allData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return <Container>Error: {error}</Container>;
  }

  return (
    <Container>
      <Title>System Info</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>User</TableHeader>
            <TableHeader>PC Name</TableHeader>
            <TableHeader>OS</TableHeader>
            <TableHeader>Processor</TableHeader>
            <TableHeader>RAM</TableHeader>
            <TableHeader>IP Address</TableHeader>
            <TableHeader>MAC Address</TableHeader>
            <TableHeader>Boot Time</TableHeader>
            <TableHeader>Collected At</TableHeader>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.user}</TableCell>
              <TableCell>{item.pc_name}</TableCell>
              <TableCell>{item.os}</TableCell>
              <TableCell>{item.processor}</TableCell>
              <TableCell>{item.ram}</TableCell>
              <TableCell>{item.ip_address}</TableCell>
              <TableCell>{item.mac_address}</TableCell>
              <TableCell>{item.boot_time}</TableCell>
              <TableCell>{item.collected_at}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
