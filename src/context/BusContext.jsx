export function BusProvider({ children }) {
  const [buses, setBuses] = useState([
    { 
      id: 1, 
      number: 'KA-01-1234', 
      route: 'Bangalore-Chennai', 
      capacity: 40, 
      status: 'active',
      departureTime: '2024-01-20T10:00',
      seats: Array(40).fill({ status: 'available' })
    },
    { 
      id: 2, 
      number: 'MH-02-5678', 
      route: 'Mumbai-Pune', 
      capacity: 36, 
      status: 'maintenance',
      departureTime: '2024-01-20T11:00',
      seats: Array(36).fill({ status: 'available' })
    }
    // Initial data will be loaded from backend
  ]);

  return (
  );
}