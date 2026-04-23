import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const generateId = () => Math.floor(100000 + Math.random() * 900000).toString();

const initialPolicies = [
  {
    id: 100001,
    name: 'Health Insurance',
    type: 'health',
    premium: 75000,
    duration: 12,
    description: 'Health insurance plan with selectable coverage and plan tier.',
    status: 'active',
  },
  {
    id: 100002,
    name: 'Auto Insurance',
    type: 'auto',
    premium: 90000,
    duration: 12,
    description: 'Auto insurance coverage for private vehicles with flexible protection options.',
    status: 'active',
  },
  {
    id: 100003,
    name: 'Home Insurance',
    type: 'home',
    premium: 65000,
    duration: 12,
    description: 'Home insurance for apartments and houses with configurable property coverage.',
    status: 'active',
  },
  {
    id: 100004,
    name: 'Mutuelle de Sante',
    type: 'mutuelle',
    premium: 3000,
    duration: 12,
    description: 'Community-Based Health Insurance in Rwanda for affordable household healthcare access.',
    status: 'active',
  },
];

const sampleClientNames = [
  'AGIRANEZA Alain Prince',
  'Alain Fils NIYOMUCAMANZA',
  'Bushayija iyabikozee lydie',
  'BYIRINGIRO Ismael',
  'CHARLOTTE UMUHIRE',
  'Donatien ABAFASHIJWENIMANA',
  'DUHIRWE ANGE DELICE',
  'Dushimimana Erneste',
  'Dushimiyimana Claudine',
  'Eli victor Mbonyumugenzi',
  'Emile Manzi',
  'Eric SIKUBWABO',
  'HESHIMA Diane',
  'Honore Tesny RULINDANA SIMBI',
  'horanayezu viateur',
  'HUSSEIN BARAME',
  'Ifitebyose Elina',
  'IKUZWE Adeline',
  'IMANIRUMVA SAMUEL',
  'IRADUKUNDA Funny fabiola',
  'Irere Niyidufasha Aime Celeste',
  'ISINGIZWE Jean berthelot',
  'Jackson MUHIRE',
  "Jean D'Amour ISHIMWE",
  'John NIYOGISUBIZO',
  'Kwizera Elvis',
  'Leuben NZAYISENGA',
  'MASENGESHO Kamuzinzi Steven',
  'Mizero Jeanpaul',
  'Muhire Vedaste',
  'Ngoga Arnaurd Nzanana',
  'Nishimwe Aliane',
  'NIYIKIZA Fabrice',
  'NIYODUSENGA Solange',
  'NKURUNZIZA Thierry',
  'Ntamakemwa Diogene',
  'Numugabo Serge',
  'Samuel NDAYISHIMIYE',
  'Sept ISHIMWE',
  'Shema Jaques',
  'SHUKURU Prince',
  'Tuyisenge Honore',
  'tuyizere emmanuel',
  'UMUHOZA Samuel',
  'Umuhoza Alice',
  'UWAJENEZA Samiati',
  'Uwimbabazi Rebecca',
  'UWITUZE Adeline',
  'UWUMUKIZA Lambert',
  'UWURUKUNDO Aime serge',
  'Yvonne UZAYISENGA',
];

const generateEmail = (name) => {
  const parts = name.toLowerCase().replace(/'/g, '').split(' ');
  return `${parts.join('.')}@email.com`;
};

const generatePhone = (seed) => {
  const num = 1000000 + (seed * 111111) % 8888888;
  return `078${num.toString().slice(0, 7)}`;
};

const generateNationalId = (seed) => {
  const base = 1199000000000000 + ((seed + 1) * 7777777) % 99999999999999;
  return base.toString().padEnd(16, '0').slice(0, 16);
};

const getHouseholdMembersByNationalIdValue = (nationalId, clients) => {
  const matchedClient = clients.find((client) => client.nationalId === nationalId);
  const headName = matchedClient?.name || 'Household Head';
  const seed = nationalId.split('').reduce((sum, digit) => sum + Number(digit || 0), 0);
  const householdSize = 2 + (seed % 4);
  const members = [
    { name: headName, relationship: 'Head of Household' },
  ];

  for (let index = 1; index < householdSize; index += 1) {
    const relatedName = sampleClientNames[(seed + index) % sampleClientNames.length];
    members.push({
      name: relatedName,
      relationship: index === 1 ? 'Spouse' : `Child ${index - 1}`,
    });
  }

  return members;
};

const policyReferences = [
  { policyId: 100001, policyName: 'Health Insurance', type: 'health' },
  { policyId: 100002, policyName: 'Auto Insurance', type: 'auto' },
  { policyId: 100003, policyName: 'Home Insurance', type: 'home' },
  { policyId: 100004, policyName: 'Mutuelle de Sante', type: 'mutuelle' },
];

const createPolicyRecord = (policyRef, startDate, status = 'active') => ({
  ...policyRef,
  status,
  startDate,
  endDate: new Date(new Date(startDate).setFullYear(new Date(startDate).getFullYear() + 1))
    .toISOString()
    .split('T')[0],
});

const createSampleClients = () =>
  sampleClientNames.map((name, index) => {
    const id = 100031 + index;
    const createdDate = new Date(2025, 0, 1 + index).toISOString().split('T')[0];
    const policiesCount = Math.floor(Math.random() * 3);
    const policies = [];

    for (let i = 0; i < policiesCount; i += 1) {
      const ref = policyReferences[(index + i) % policyReferences.length];
      policies.push(createPolicyRecord(ref, createdDate));
    }

    return {
      id,
      name,
      email: generateEmail(name),
      phone: generatePhone(index),
      nationalId: generateNationalId(index),
      createdAt: createdDate,
      canRequestInsurance: true,
      policies,
    };
  });

const initialClients = [
  {
    id: 100001,
    name: 'Ngabo Jean Marie',
    email: 'ngabo.j@email.com',
    phone: '0781234567',
    nationalId: '1199001234567890',
    createdAt: '2025-01-15',
    canRequestInsurance: true,
    policies: [createPolicyRecord(policyReferences[0], '2025-01-15')],
  },
  {
    id: 100002,
    name: 'Mukamana Claire',
    email: 'mukamana.c@email.com',
    phone: '0781234568',
    nationalId: '1199002345678901',
    createdAt: '2025-02-20',
    canRequestInsurance: true,
    policies: [createPolicyRecord(policyReferences[1], '2025-02-20')],
  },
  {
    id: 100003,
    name: 'Niyonkuru Pascal',
    email: 'niyonkuru.p@email.com',
    phone: '0781234569',
    nationalId: '1199003456789012',
    createdAt: '2025-03-10',
    canRequestInsurance: true,
    policies: [createPolicyRecord(policyReferences[2], '2025-03-10')],
  },
  {
    id: 100004,
    name: 'Mukeshimana Alice',
    email: 'mukeshi.a@email.com',
    phone: '0781234570',
    nationalId: '1199004567890123',
    createdAt: '2025-03-25',
    canRequestInsurance: true,
    policies: [
      createPolicyRecord(policyReferences[2], '2025-03-25'),
      createPolicyRecord(policyReferences[0], '2025-03-25'),
    ],
  },
  {
    id: 100005,
    name: 'Rwanda Eric',
    email: 'rwanda.e@email.com',
    phone: '0781234571',
    nationalId: '1199005678901234',
    createdAt: '2025-04-01',
    canRequestInsurance: true,
    policies: [createPolicyRecord(policyReferences[0], '2025-04-01')],
  },
  {
    id: 100006,
    name: 'Umutesi Rose',
    email: 'umutesi.r@email.com',
    phone: '0781234572',
    nationalId: '1199006789012345',
    createdAt: '2025-04-05',
    canRequestInsurance: true,
    policies: [
      createPolicyRecord(policyReferences[1], '2025-04-05'),
      createPolicyRecord(policyReferences[2], '2025-04-05'),
    ],
  },
  {
    id: 100007,
    name: 'Hategekimana Paul',
    email: 'hategekimana.p@email.com',
    phone: '0781234573',
    nationalId: '1199007890123456',
    createdAt: '2025-04-10',
    canRequestInsurance: true,
    policies: [createPolicyRecord(policyReferences[1], '2025-04-10')],
  },
  {
    id: 100008,
    name: 'Mukamurerwa Jeanne',
    email: 'mukamurerwa.j@email.com',
    phone: '0781234574',
    nationalId: '1199008901234567',
    createdAt: '2025-04-15',
    canRequestInsurance: true,
    policies: [createPolicyRecord(policyReferences[2], '2025-04-15')],
  },
  {
    id: 100009,
    name: 'Bizimana Joseph',
    email: 'bizimana.j@email.com',
    phone: '0781234575',
    nationalId: '1199009012345678',
    createdAt: '2025-04-20',
    canRequestInsurance: true,
    policies: [],
  },
  {
    id: 100010,
    name: 'Uwayo Dancille',
    email: 'uwayo.d@email.com',
    phone: '0781234576',
    nationalId: '1199000123456789',
    createdAt: '2025-04-22',
    canRequestInsurance: true,
    policies: [createPolicyRecord(policyReferences[0], '2025-04-22', 'pending')],
  },
  {
    id: 100011,
    name: 'Demo Client',
    email: 'client@gmail.com',
    phone: '0781234577',
    nationalId: '1199001123456789',
    createdAt: '2025-04-23',
    canRequestInsurance: true,
    policies: [],
  },
  ...createSampleClients(),
];

const initialClaims = [
  {
    id: 100001,
    policyId: 100001,
    policyName: 'Health Insurance',
    clientName: 'Ngabo Jean Marie',
    description: 'Medical emergency requiring hospitalization',
    amount: 500000,
    status: 'pending',
    documents: [],
    date: '2025-04-01',
  },
  {
    id: 100002,
    policyId: 100002,
    policyName: 'Auto Insurance',
    clientName: 'Mukamana Claire',
    description: 'Vehicle accident damage claim',
    amount: 250000,
    status: 'approved',
    documents: [],
    date: '2025-03-15',
  },
  {
    id: 100003,
    policyId: 100003,
    policyName: 'Home Insurance',
    clientName: 'Mukeshimana Alice',
    description: 'Fire damage to property',
    amount: 1000000,
    status: 'rejected',
    documents: [],
    date: '2025-03-20',
  },
];

const initialPayments = [
  { id: 100001, clientName: 'Ngabo Jean Marie', policyName: 'Health Insurance', amount: 75000, date: '2025-01-15', status: 'completed' },
  { id: 100002, clientName: 'Mukamana Claire', policyName: 'Auto Insurance', amount: 90000, date: '2025-02-20', status: 'completed' },
  { id: 100003, clientName: 'Niyonkuru Pascal', policyName: 'Home Insurance', amount: 65000, date: '2025-03-10', status: 'pending' },
];

const initialApplications = [
  {
    id: 200001,
    name: 'Mugisha Emmanuel',
    email: 'mugisha.e@email.com',
    phone: '0781234588',
    nationalId: '1199022345678901',
    policyId: 100001,
    policyName: 'Health Insurance',
    premium: 75000,
    age: '34',
    gender: 'Male',
    planType: 'Standard',
    coverageAmount: '10000000',
    preExistingConditions: 'No',
    startDate: '2025-06-28',
    status: 'pending',
    date: '2025-06-28',
  },
  {
    id: 200002,
    name: 'Mutoni Alice',
    email: 'mutoni.a@email.com',
    phone: '0781234584',
    nationalId: '1199018901234567',
    policyId: 100002,
    policyName: 'Auto Insurance',
    premium: 90000,
    carBrand: 'Toyota Corolla',
    carYear: '2020',
    licensePlate: 'RAB123A',
    coverageType: 'Comprehensive',
    accidentHistory: 'No',
    startDate: '2025-07-05',
    status: 'approved',
    date: '2025-07-05',
  },
  {
    id: 200003,
    name: 'Uwineza Divine',
    email: 'uwineza.d@email.com',
    phone: '0781234603',
    nationalId: '1199034000123456',
    policyId: 100003,
    policyName: 'Home Insurance',
    premium: 65000,
    propertyAddress: 'Kigali, Kicukiro',
    propertyType: 'House',
    propertyValue: '90000000',
    coverageAmount: '60000000',
    startDate: '2025-08-05',
    status: 'pending',
    date: '2025-08-05',
  },
  {
    id: 200004,
    name: 'Mukamana Chantal',
    email: 'mukamana.c@email.com',
    phone: '0781234568',
    nationalId: '1199002345678901',
    policyId: 100004,
    policyName: 'Mutuelle de Sante',
    premium: 3000,
    startDate: '2025-08-20',
    status: 'pending',
    date: '2025-08-20',
  },
];

export const AppProvider = ({ children }) => {
  const [policies, setPolicies] = useState(initialPolicies);
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('insurance_clients');
    const initial = saved ? JSON.parse(saved) : initialClients;
    // Normalize: ensure all clients have canRequestInsurance field
    return initial.map(client => ({
      ...client,
      canRequestInsurance: client.canRequestInsurance ?? true
    }));
  });
  const [claims, setClaims] = useState(initialClaims);
  const [payments, setPayments] = useState(initialPayments);
  const [applications, setApplications] = useState(initialApplications);

  // Initialize localStorage on first load
  if (!localStorage.getItem('insurance_clients')) {
    localStorage.setItem('insurance_clients', JSON.stringify(initialClients));
  }

  const addPolicy = (policy) => {
    setPolicies([...policies, { ...policy, id: generateId(), status: 'active' }]);
  };

  const deletePolicy = (id) => {
    setPolicies(policies.filter((p) => p.id !== id));
  };

  const updatePolicy = (id, updatedPolicy) => {
    setPolicies(policies.map((p) => (p.id === id ? { ...p, ...updatedPolicy } : p)));
  };

  const addClient = (client) => {
    const normalizedClient = {
      ...client,
      email: client.email?.trim().toLowerCase(),
      canRequestInsurance: client.canRequestInsurance ?? true
    };
    const newClients = [
      ...clients,
      { ...normalizedClient, id: generateId(), createdAt: new Date().toISOString().split('T')[0], policies: [] },
    ];
    setClients(newClients);
    localStorage.setItem('insurance_clients', JSON.stringify(newClients));
  };

  const deleteClient = (id) => {
    const newClients = clients.filter(c => c.id !== id);
    setClients(newClients);
    localStorage.setItem('insurance_clients', JSON.stringify(newClients));
  };

  const updateClient = (id, updatedClient) => {
    const normalizedUpdate = {
      ...updatedClient,
      email: updatedClient.email?.trim().toLowerCase()
    };
    const newClients = clients.map((c) => (c.id === id ? { ...c, ...normalizedUpdate } : c));
    setClients(newClients);
    localStorage.setItem('insurance_clients', JSON.stringify(newClients));
  };

  const addPolicyToClient = (clientId, policy) => {
    const newClients = clients.map((c) => {
      if (c.id === clientId) {
        return { ...c, policies: [...(c.policies || []), policy] };
      }
      return c;
    });
    setClients(newClients);
    localStorage.setItem('insurance_clients', JSON.stringify(newClients));
  };

  const updateClaimStatus = (id, status) => {
    setClaims(claims.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const addClaim = (claim) => {
    setClaims([
      ...claims,
      { ...claim, id: generateId(), status: 'pending', date: new Date().toISOString().split('T')[0] },
    ]);
  };

  const addApplication = (application) => {
    setApplications([
      ...applications,
      { ...application, id: generateId(), status: 'pending', date: new Date().toISOString().split('T')[0] },
    ]);
  };

  const addPayment = (payment) => {
    setPayments([
      ...payments,
      {
        ...payment,
        id: generateId(),
        amount: Number(payment.amount),
        date: payment.date || new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const approveApplication = (applicationId, clientId) => {
    const app = applications.find((a) => a.id === applicationId);
    const matchedPolicy = policies.find((policy) => policy.id === app?.policyId);
    const existingClient =
      clients.find((client) => client.id === clientId) ||
      clients.find((client) => client.email === app?.email);

    if (app) {
      setApplications(
        applications.map((a) => (a.id === applicationId ? { ...a, status: 'approved' } : a))
      );
      const updatedClients = existingClient
        ? clients.map((c) => {
            if (c.id === existingClient.id) {
              const alreadyAssigned = (c.policies || []).some(
                (policy) => policy.policyId === app.policyId && policy.startDate === app.startDate
              );

              return {
                ...c,
                policies: alreadyAssigned
                  ? c.policies || []
                  : [
                      ...(c.policies || []),
                      {
                        policyId: app.policyId,
                        policyName: app.policyName,
                        type: matchedPolicy?.type || 'health',
                        status: 'active',
                        startDate: app.startDate || new Date().toISOString().split('T')[0],
                        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                          .toISOString()
                          .split('T')[0],
                      },
                    ],
              };
            }
            return c;
          })
        : [
            ...clients,
            {
              id: generateId(),
              name: app.name,
              email: app.email?.trim().toLowerCase(),
              phone: app.phone || '',
              nationalId: app.nationalId || '',
              canRequestInsurance: app.canRequestInsurance ?? true,
              createdAt: new Date().toISOString().split('T')[0],
              policies: [
                {
                  policyId: app.policyId,
                  policyName: app.policyName,
                  type: matchedPolicy?.type || 'health',
                  status: 'active',
                  startDate: app.startDate || new Date().toISOString().split('T')[0],
                  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                    .toISOString()
                    .split('T')[0],
                },
              ],
            },
          ];
      setClients(updatedClients);
      localStorage.setItem('insurance_clients', JSON.stringify(updatedClients));
    }
  };

  const rejectApplication = (applicationId) => {
    setApplications(
      applications.map((application) =>
        application.id === applicationId ? { ...application, status: 'rejected' } : application
      )
    );
  };

  const getHouseholdMembersByNationalId = (nationalId) => {
    if (!nationalId || !/^\d{16}$/.test(nationalId)) {
      return [];
    }
    return getHouseholdMembersByNationalIdValue(nationalId, clients);
  };

  return (
    <AppContext.Provider
      value={{
        policies,
        addPolicy,
        deletePolicy,
        updatePolicy,
        clients,
        addClient,
        deleteClient,
        updateClient,
        addPolicyToClient,
        claims,
        addClaim,
        updateClaimStatus,
        payments,
        addPayment,
        applications,
        addApplication,
        approveApplication,
        rejectApplication,
        getHouseholdMembersByNationalId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
