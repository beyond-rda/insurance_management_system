import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const initialPolicies = [
  { id: 1, name: 'Premium Health Plus', type: 'health', premium: 15000, duration: 12, description: 'Comprehensive health coverage with dental and optical benefits', terms: 'Annual coverage with 30-day waiting period', eligibility: 'Age 18-65, no pre-existing conditions', status: 'active' },
  { id: 2, name: 'Auto Secure Plan', type: 'motor', premium: 8000, duration: 12, description: 'Full coverage for private vehicles including theft and accident', terms: 'Comprehensive motor insurance with zero depreciation', eligibility: 'Valid driving license required', status: 'active' },
  { id: 3, name: 'Life Guardian', type: 'life', premium: 12000, duration: 60, description: 'Term life insurance with accidental death benefits', terms: 'Coverage up to 5 years with guaranteed sum assured', eligibility: 'Age 21-50, medical examination required', status: 'active' },
  { id: 4, name: 'Home Protect', type: 'property', premium: 5000, duration: 12, description: 'Coverage for residential property against fire, theft, and natural disasters', terms: 'Standard home insurance with content coverage', eligibility: 'Property owner or tenant', status: 'active' },
  { id: 5, name: 'Family Health Shield', type: 'health', premium: 25000, duration: 12, description: 'Family floater health insurance covering all family members', terms: 'Family coverage up to 5 members, sum insured 10L', eligibility: 'Family with 2+ members', status: 'active' },
  { id: 6, name: 'Commercial Vehicle Cover', type: 'motor', premium: 15000, duration: 12, description: 'Commercial vehicle insurance for trucks and logistics', terms: 'Comprehensive cover for goods-carrying vehicles', eligibility: 'Commercial vehicle registration', status: 'pending' },
];

const initialClients = [
  { id: 1, name: 'John Smith', email: 'john.smith@email.com', phone: '9876543210', nationalId: 'AB1234567', createdAt: '2025-01-15' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '9876543211', nationalId: 'CD2345678', createdAt: '2025-02-20' },
  { id: 3, name: 'Mike Wilson', email: 'mike.wilson@email.com', phone: '9876543212', nationalId: 'EF3456789', createdAt: '2025-03-10' },
  { id: 4, name: 'Emily Brown', email: 'emily.b@email.com', phone: '9876543213', nationalId: 'GH4567890', createdAt: '2025-03-25' },
];

const initialClaims = [
  { id: 1, policyId: 1, policyName: 'Premium Health Plus', clientName: 'John Smith', description: 'Medical emergency requiring hospitalization', amount: 50000, status: 'pending', documents: [], date: '2025-04-01' },
  { id: 2, policyId: 2, policyName: 'Auto Secure Plan', clientName: 'Sarah Johnson', description: 'Vehicle accident damage claim', amount: 25000, status: 'approved', documents: [], date: '2025-03-15' },
  { id: 3, policyId: 3, policyName: 'Life Guardian', clientName: 'Mike Wilson', description: 'Accidental death benefit claim', amount: 500000, status: 'pending', documents: [], date: '2025-04-05' },
  { id: 4, policyId: 4, policyName: 'Home Protect', clientName: 'Emily Brown', description: 'Fire damage to property', amount: 100000, status: 'rejected', documents: [], date: '2025-03-20' },
];

const initialPayments = [
  { id: 1, clientName: 'John Smith', policyName: 'Premium Health Plus', amount: 15000, date: '2025-01-15', status: 'completed' },
  { id: 2, clientName: 'Sarah Johnson', policyName: 'Auto Secure Plan', amount: 8000, date: '2025-02-20', status: 'completed' },
  { id: 3, clientName: 'Mike Wilson', policyName: 'Life Guardian', amount: 12000, date: '2025-03-10', status: 'pending' },
  { id: 4, clientName: 'Emily Brown', policyName: 'Home Protect', amount: 5000, date: '2025-03-25', status: 'completed' },
];

const initialApplications = [];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const savedUser = localStorage.getItem('user');
    if (savedRole && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    const normalizedEmail = email.trim().toLowerCase();
    const userData = { email: normalizedEmail, role };
    localStorage.setItem('role', role);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const getRole = () => {
    return user?.role || localStorage.getItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, getRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const AppProvider = ({ children }) => {
  const [policies, setPolicies] = useState(initialPolicies);
  const [clients, setClients] = useState(initialClients);
  const [claims, setClaims] = useState(initialClaims);
  const [payments, setPayments] = useState(initialPayments);
  const [applications, setApplications] = useState(initialApplications);

  const addPolicy = (policy) => {
    setPolicies([...policies, { ...policy, id: Date.now(), status: 'active' }]);
  };

  const deletePolicy = (id) => {
    setPolicies(policies.filter(p => p.id !== id));
  };

  const addClient = (client) => {
    setClients([...clients, { ...client, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]);
  };

  const deleteClient = (id) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const updateClaimStatus = (id, status) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status } : c));
  };

  const addClaim = (claim) => {
    setClaims([...claims, { ...claim, id: Date.now(), status: 'pending', date: new Date().toISOString().split('T')[0] }]);
  };

  const addApplication = (application) => {
    setApplications([...applications, { ...application, id: Date.now(), status: 'pending', date: new Date().toISOString().split('T')[0] }]);
  };

  return (
    <AuthProvider>
      <AppContext.Provider value={{
        policies, addPolicy, deletePolicy,
        clients, addClient, deleteClient,
        claims, addClaim, updateClaimStatus,
        payments,
        applications, addApplication
      }}>
        {children}
      </AppContext.Provider>
    </AuthProvider>
  );
};

const AppContext = createContext();

export const useApp = () => useContext(AppContext);