import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, User, Heart, Activity, TrendingUp, Download, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = () => {
      try {
        const savedAppointments = JSON.parse(localStorage.getItem('nirogGyanAppointments') || '[]');
        const savedRecords = JSON.parse(localStorage.getItem('nirogGyanHealthRecords') || '[]');
        
        setAppointments(savedAppointments);
        setRecords(savedRecords);
      } catch (error) {
        console.error('Error loading health data:', error);
        toast.error('Failed to load health records');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const mockHealthData = {
    vitals: {
      lastUpdated: '2025-01-15',
      bloodPressure: '120/80',
      heartRate: '72 bpm',
      temperature: '98.6°F',
      weight: '70 kg',
      height: '175 cm'
    },
    recentTests: [
      {
        id: 1,
        name: 'Blood Test - Complete Blood Count',
        date: '2025-01-10',
        status: 'Normal',
        doctor: 'Dr. Priya Sharma'
      },
      {
        id: 2,
        name: 'ECG Test',
        date: '2025-01-05',
        status: 'Normal',
        doctor: 'Dr. Priya Sharma'
      }
    ],
    prescriptions: [
      {
        id: 1,
        medication: 'Aspirin 75mg',
        dosage: 'Once daily',
        duration: '30 days',
        prescribedBy: 'Dr. Priya Sharma',
        date: '2025-01-10'
      }
    ]
  };

  const downloadHealthRecord = () => {
    const healthSummary = `
NIROG GYAN - HEALTH RECORDS SUMMARY
=====================================

PATIENT INFORMATION:
Last Updated: ${mockHealthData.vitals.lastUpdated}

VITAL SIGNS:
Blood Pressure: ${mockHealthData.vitals.bloodPressure}
Heart Rate: ${mockHealthData.vitals.heartRate}
Temperature: ${mockHealthData.vitals.temperature}
Weight: ${mockHealthData.vitals.weight}
Height: ${mockHealthData.vitals.height}

RECENT TEST RESULTS:
${mockHealthData.recentTests.map(test => `
- ${test.name}
  Date: ${test.date}
  Status: ${test.status}
  Doctor: ${test.doctor}
`).join('')}

CURRENT PRESCRIPTIONS:
${mockHealthData.prescriptions.map(rx => `
- ${rx.medication}
  Dosage: ${rx.dosage}
  Duration: ${rx.duration}
  Prescribed by: ${rx.prescribedBy}
  Date: ${rx.date}
`).join('')}

APPOINTMENT HISTORY:
${appointments.map(apt => `
- ${apt.doctorName} (${new Date(apt.appointmentDate).toLocaleDateString()})
  Status: ${apt.status}
  Symptoms: ${apt.symptoms || 'N/A'}
`).join('')}

=====================================
Generated on: ${new Date().toLocaleString()}
NirogGyan Healthcare Platform
    `.trim();

    const blob = new Blob([healthSummary], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-records-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Health records downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Health Records
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Your complete health information and medical history
            </p>
          </div>
          <button
            onClick={downloadHealthRecord}
            className="flex items-center space-x-2 bg-medical-600 hover:bg-medical-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            <Download className="w-5 h-5" />
            <span>Download Records</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Vital Signs */}
          <div className="lg:col-span-1 space-y-6">
            {/* Vital Signs Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Heart className="w-6 h-6 mr-3 text-red-500" />
                Vital Signs
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">Blood Pressure</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {mockHealthData.vitals.bloodPressure}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">Heart Rate</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {mockHealthData.vitals.heartRate}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">Temperature</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {mockHealthData.vitals.temperature}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">Weight</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {mockHealthData.vitals.weight}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">Height</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {mockHealthData.vitals.height}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                Last updated: {mockHealthData.vitals.lastUpdated}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-emerald-500" />
                Health Overview
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Total Appointments</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{appointments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Recent Tests</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{mockHealthData.recentTests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Active Prescriptions</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{mockHealthData.prescriptions.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tests & Prescriptions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Tests */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-3 text-blue-500" />
                Recent Test Results
              </h2>
              <div className="space-y-4">
                {mockHealthData.recentTests.map((test) => (
                  <div key={test.id} className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{test.name}</h3>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                        {test.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Doctor: {test.doctor}</p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm">Date: {test.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Prescriptions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-purple-500" />
                Current Prescriptions
              </h2>
              <div className="space-y-4">
                {mockHealthData.prescriptions.map((prescription) => (
                  <div key={prescription.id} className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {prescription.medication}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Dosage:</span>
                        <span className="ml-2 text-slate-900 dark:text-white">{prescription.dosage}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Duration:</span>
                        <span className="ml-2 text-slate-900 dark:text-white">{prescription.duration}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                      Prescribed by: {prescription.prescribedBy} on {prescription.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment History */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-medical-500" />
                Appointment History
              </h2>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {appointment.doctorName}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                          </p>
                          {appointment.symptoms && (
                            <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                              Reason: {appointment.symptoms}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {appointments.length > 3 && (
                    <Link
                      to="/appointments"
                      className="block text-center text-medical-600 hover:text-medical-700 font-medium"
                    >
                      View all {appointments.length} appointments
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                  No appointment history available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;