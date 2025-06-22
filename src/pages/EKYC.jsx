import { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';

export default function EKYCPage() {
  const { darkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    registrationNumber: '',
    taxId: '',
    address: '',
    businessType: '',
    industry: '',
    riskRating: 'medium',
    kycStatus: 'pending',
    lastReviewDate: '',
    nextReviewDate: '',
    notes: ''
  });

  // Sample data - in a real app this would come from an API
  const clients = [
    {
      id: 1,
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1 (555) 123-4567',
      organization: 'Acme Group',
      registrationNumber: 'ACME123456',
      taxId: 'TAX-ACME-789',
      address: '123 Business Ave, New York, NY 10001',
      businessType: 'Corporation',
      industry: 'Manufacturing',
      riskRating: 'low',
      kycStatus: 'verified',
      lastReviewDate: '2023-05-15',
      nextReviewDate: '2024-05-15',
      representatives: [
        {
          id: 1,
          name: 'John Smith',
          position: 'CEO',
          email: 'john.smith@acme.com',
          phone: '+1 (555) 987-6543',
          isPrimary: true
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          position: 'CFO',
          email: 'sarah.j@acme.com',
          phone: '+1 (555) 456-7890',
          isPrimary: false
        }
      ],
      issues: [
        {
          id: 1,
          date: '2023-02-10',
          type: 'Document Expiry',
          status: 'resolved',
          description: 'Business license was about to expire'
        },
        {
          id: 2,
          date: '2023-04-05',
          type: 'Unusual Transaction',
          status: 'investigating',
          description: 'Large transfer to new supplier'
        }
      ],
      notes: 'Long-standing client with good transaction history. Bulk of business in Q2-Q3 each year.',
      documents: [
        { name: 'Certificate of Incorporation', uploaded: '2022-01-15', expiry: '2025-01-15' },
        { name: 'Tax Compliance Certificate', uploaded: '2023-03-20', expiry: '2024-03-20' }
      ]
    },
    // More client objects...
  ];

  const partners = [
    {
      id: 1,
      name: 'Global Verification Services',
      type: 'KYC Provider',
      contact: 'support@globalverify.com',
      services: 'Identity verification, document authentication',
      contractStart: '2022-01-10',
      contractEnd: '2025-01-10',
      sla: '99.9% uptime, 24/7 support'
    },
    // More partner objects...
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setClientForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      organization: client.organization,
      registrationNumber: client.registrationNumber,
      taxId: client.taxId,
      address: client.address,
      businessType: client.businessType,
      industry: client.industry,
      riskRating: client.riskRating,
      kycStatus: client.kycStatus,
      lastReviewDate: client.lastReviewDate,
      nextReviewDate: client.nextReviewDate,
      notes: client.notes
    });
  };

  const handleSaveClient = () => {
    // In a real app, this would call an API to update the client
    console.log('Saving client:', clientForm);
    setIsEditing(false);
    // Update the selectedClient with the new data
    setSelectedClient({
      ...selectedClient,
      ...clientForm
    });
  };

  const renderClientList = () => (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Client Directory
          </h3>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Client Name</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Organization</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Contact</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>KYC Status</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Risk Rating</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredClients.map((client) => (
                <tr key={client.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {client.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                      {client.organization}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                      {client.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {client.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.kycStatus === 'verified' 
                        ? darkMode ? 'bg-green-900/20 text-green-200' : 'bg-green-100 text-green-800'
                        : client.kycStatus === 'pending'
                        ? darkMode ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        : darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'
                    }`}>
                      {client.kycStatus.charAt(0).toUpperCase() + client.kycStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.riskRating === 'low' 
                        ? darkMode ? 'bg-green-900/20 text-green-200' : 'bg-green-100 text-green-800'
                        : client.riskRating === 'medium'
                        ? darkMode ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        : darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'
                    }`}>
                      {client.riskRating.charAt(0).toUpperCase() + client.riskRating.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewClient(client)}
                      className={`mr-3 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        handleViewClient(client);
                        setIsEditing(true);
                      }}
                      className={darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderClientDetail = () => {
    if (!selectedClient) return null;

    return (
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedClient.name}
            </h2>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {selectedClient.organization} • {selectedClient.businessType}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-md ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } ${darkMode ? 'text-white' : 'text-gray-700'}`}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            {isEditing && (
              <button
                onClick={handleSaveClient}
                className={`px-4 py-2 rounded-md ${
                  darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Basic Information
            </h3>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={clientForm.name}
                      onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={clientForm.email}
                      onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={clientForm.phone}
                      onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Organization
                    </label>
                    <input
                      type="text"
                      value={clientForm.organization}
                      onChange={(e) => setClientForm({...clientForm, organization: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={clientForm.registrationNumber}
                      onChange={(e) => setClientForm({...clientForm, registrationNumber: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Tax ID
                    </label>
                    <input
                      type="text"
                      value={clientForm.taxId}
                      onChange={(e) => setClientForm({...clientForm, taxId: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Address
                    </label>
                    <textarea
                      value={clientForm.address}
                      onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Email</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedClient.email}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Phone</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedClient.phone}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Registration Number</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedClient.registrationNumber}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Tax ID</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedClient.taxId}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Address</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedClient.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Business Information */}
            <h3 className={`text-lg font-medium mt-6 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Business Information
            </h3>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Business Type
                    </label>
                    <select
                      value={clientForm.businessType}
                      onChange={(e) => setClientForm({...clientForm, businessType: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    >
                      <option value="Corporation">Corporation</option>
                      <option value="LLC">LLC</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Non-Profit">Non-Profit</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Industry
                    </label>
                    <input
                      type="text"
                      value={clientForm.industry}
                      onChange={(e) => setClientForm({...clientForm, industry: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Risk Rating
                    </label>
                    <select
                      value={clientForm.riskRating}
                      onChange={(e) => setClientForm({...clientForm, riskRating: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      KYC Status
                    </label>
                    <select
                      value={clientForm.kycStatus}
                      onChange={(e) => setClientForm({...clientForm, kycStatus: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Last Review Date
                    </label>
                    <input
                      type="date"
                      value={clientForm.lastReviewDate}
                      onChange={(e) => setClientForm({...clientForm, lastReviewDate: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Next Review Date
                    </label>
                    <input
                      type="date"
                      value={clientForm.nextReviewDate}
                      onChange={(e) => setClientForm({...clientForm, nextReviewDate: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Business Type</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedClient.businessType}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Industry</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedClient.industry}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Risk Rating</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedClient.riskRating === 'low' 
                        ? darkMode ? 'bg-green-900/20 text-green-200' : 'bg-green-100 text-green-800'
                        : selectedClient.riskRating === 'medium'
                        ? darkMode ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        : darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedClient.riskRating.charAt(0).toUpperCase() + selectedClient.riskRating.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>KYC Status</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedClient.kycStatus === 'verified' 
                        ? darkMode ? 'bg-green-900/20 text-green-200' : 'bg-green-100 text-green-800'
                        : selectedClient.kycStatus === 'pending'
                        ? darkMode ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        : darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedClient.kycStatus.charAt(0).toUpperCase() + selectedClient.kycStatus.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Last Review Date</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedClient.lastReviewDate}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Next Review Date</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedClient.nextReviewDate}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <h3 className={`text-lg font-medium mt-6 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Notes
            </h3>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              {isEditing ? (
                <textarea
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({...clientForm, notes: e.target.value})}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                  }`}
                />
              ) : (
                <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                  {selectedClient.notes || 'No notes available'}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Representatives */}
            <div>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Representatives
              </h3>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                {selectedClient.representatives.map((rep) => (
                  <div key={rep.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {rep.name} {rep.isPrimary && (
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                              darkMode ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-100 text-blue-800'
                            }`}>
                              Primary
                            </span>
                          )}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {rep.position}
                        </p>
                      </div>
                      {isEditing && (
                        <button className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium">Email:</span> {rep.email}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium">Phone:</span> {rep.phone}
                      </p>
                    </div>
                  </div>
                ))}
                {isEditing && (
                  <button className={`mt-3 text-sm px-3 py-1 rounded ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}>
                    + Add Representative
                  </button>
                )}
              </div>
            </div>

            {/* Issues */}
            <div>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Issues & Alerts
              </h3>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                {selectedClient.issues.map((issue) => (
                  <div key={issue.id} className="mb-4 last:mb-0 pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex justify-between">
                      <span className={`text-sm font-medium ${
                        issue.status === 'resolved' 
                          ? darkMode ? 'text-green-400' : 'text-green-600'
                          : issue.status === 'investigating'
                          ? darkMode ? 'text-yellow-400' : 'text-yellow-600'
                          : darkMode ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {issue.type}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {issue.date}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {issue.description}
                    </p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        issue.status === 'resolved' 
                          ? darkMode ? 'bg-green-900/20 text-green-200' : 'bg-green-100 text-green-800'
                          : issue.status === 'investigating'
                          ? darkMode ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                          : darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'
                      }`}>
                        {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
                <button className={`mt-3 text-sm px-3 py-1 rounded ${
                  darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                } ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  + Add New Issue
                </button>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Documents
              </h3>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                {selectedClient.documents.map((doc) => (
                  <div key={doc.name} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {doc.name}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Expires: {doc.expiry}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Uploaded: {doc.uploaded}
                      </span>
                      <button className={`text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
                <button className={`mt-3 w-full text-sm px-3 py-1.5 rounded ${
                  darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}>
                  Upload New Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPartners = () => (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Service Providers & Partners
          </h3>
          <button className={`px-4 py-2 rounded ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}>
            Add New Partner
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Partner Name</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Type</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Services</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Contract Period</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>SLA</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {partners.map((partner) => (
                <tr key={partner.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {partner.name}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {partner.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                      {partner.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {partner.services}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {partner.contractStart} to {partner.contractEnd}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {partner.sla}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className={`mr-3 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                    >
                      View
                    </button>
                    <button
                      className={darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          eKYC Management
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'clients' 
                ? darkMode 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-blue-600 text-white'
                : darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Clients
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'partners' 
                ? darkMode 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-blue-600 text-white'
                : darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Partners
          </button>
        </div>
      </div>

      {activeTab === 'clients' ? (
        selectedClient ? renderClientDetail() : renderClientList()
      ) : renderPartners()}
    </div>
  );
}