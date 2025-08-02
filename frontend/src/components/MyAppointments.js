import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, MapPin, Phone, Download, Printer, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AppointmentCard = ({ appointment, onDownload }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
            {appointment.doctorName}
          </h3>
          <p className="text-medical-600 dark:text-medical-400 font-medium">
            Appointment #{appointment.id}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </div>
      </div>

      {/* Appointment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
            <Calendar className="w-5 h-5" />
            <span>{formatDate(appointment.appointmentDate)}</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
            <Clock className="w-5 h-5" />
            <span>{appointment.appointmentTime}</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
            <User className="w-5 h-5" />
            <span>{appointment.patientName}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
            <Phone className="w-5 h-5" />
            <span>{appointment.phone}</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
            <span className="font-medium">Fee:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{appointment.fees}</span>
          </div>
        </div>
      </div>

      {/* Symptoms */}
      {appointment.symptoms && (
        <div className="mb-6">
          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Symptoms/Reason:</h4>
          <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
            {appointment.symptoms}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onDownload(appointment)}
          className="flex items-center space-x-2 bg-medical-600 hover:bg-medical-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
        {appointment.status === 'confirmed' && (
          <Link
            to={`/doctor/${appointment.doctorId}`}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            <User className="w-4 h-4" />
            <span>View Doctor</span>
          </Link>
        )}
      </div>
    </div>
  );
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = () => {
      try {
        const savedAppointments = JSON.parse(localStorage.getItem('nirogGyanAppointments') || '[]');
        setAppointments(savedAppointments.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)));
      } catch (error) {
        console.error('Error loading appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const downloadAppointment = (appointment) => {
    const appointmentDetails = `
NIROG GYAN - APPOINTMENT DETAILS
=====================================

Appointment ID: ${appointment.id}
Doctor: ${appointment.doctorName}
Patient: ${appointment.patientName}
Date: ${new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}
Time: ${appointment.appointmentTime}
Status: ${appointment.status.toUpperCase()}

CONTACT INFORMATION:
Phone: ${appointment.phone}
Email: ${appointment.email}

CONSULTATION FEE: ${appointment.fees}

${appointment.symptoms ? `SYMPTOMS/REASON:\n${appointment.symptoms}` : ''}

BOOKING DATE: ${new Date(appointment.bookingDate).toLocaleString()}

=====================================
Thank you for choosing NirogGyan Healthcare!
    `.trim();

    const blob = new Blob([appointmentDetails], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${appointment.id}-${appointment.doctorName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Appointment details downloaded successfully!');
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            My Appointments
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {appointments.length > 0 
              ? `You have ${appointments.length} appointment${appointments.length > 1 ? 's' : ''}`
              : 'No appointments found'
            }
          </p>
        </div>

        {/* Appointments List */}
        {appointments.length > 0 ? (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onDownload={downloadAppointment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              No Appointments Yet
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mb-6">
              You haven't booked any appointments yet. Start by finding a doctor!
            </p>
            <Link
              to="/"
              className="inline-flex items-center bg-medical-600 hover:bg-medical-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <User className="w-5 h-5 mr-2" />
              Find Doctors
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;