import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here (clear tokens, etc.)
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>Budgetmate Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: '10px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </header>

      <main>
        <h3>Welcome to your Dashboard!</h3>
        <p>This is a placeholder for your daily expense tracking features.</p>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
          <div style={{ flex: 1, padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
            <h4>Recent Transactions</h4>
            <p>No transactions yet.</p>
          </div>
          <div style={{ flex: 1, padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
            <h4>Expense Summary</h4>
            <p>Total: $0.00</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
