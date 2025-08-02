import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockAPI, speakText } from '../mock';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    symptoms: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const data = await mockAPI.getDoctorById(id);
        setDoctor(data);
      } catch (error) {
        toast.error('Doctor not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setFormData(prev => ({
      ...prev,
      appointmentDate: slot.date,
      appointmentTime: slot.time
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[0-9]{10,14}$/;

    if (!formData.patientName.trim()) {
      toast.error('Please enter patient name');
      return false;
    }
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    if (!selectedSlot) {
      toast.error('Please select an appointment slot');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    
    try {
      const appointmentData = {
        doctorId: doctor.id,
        doctorName: doctor.name,
        patientName: formData.patientName,
        email: formData.email,
        phone: formData.phone,
        symptoms: formData.symptoms,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        fees: doctor.fees
      };

      const appointment = await mockAPI.bookAppointment(appointmentData);
      
      // Success toast
      toast.success(
        <div>
          <div className="font-semibold">Appointment Booked Successfully!</div>
          <div className="text-sm text-slate-600">
            {new Date(formData.appointmentDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} at {formData.appointmentTime}
          </div>
        </div>,
        { duration: 6000 }
      );

      // Speech synthesis
      const speechText = `Your appointment with Dr. ${doctor.name} has been successfully booked for ${new Date(formData.appointmentDate).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      })} at ${formData.appointmentTime}. You will receive a confirmation email shortly.`;
      
      speakText(speechText);

      // Show success screen
      setTimeout(() => {
        navigate('/', { state: { appointmentBooked: true } });
      }, 3000);

    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Doctor not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-medical-600 hover:text-medical-700"
          >
            Return to doctors list
          </button>
        </div>
      </div>
    );
  }

  const availableSlots = doctor.availableSlots.filter(slot => slot.available);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-medical-600 dark:hover:text-medical-400 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to profile</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
              <div className="text-center mb-6">
                <img
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white dark:border-slate-700 shadow-lg"
                />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{doctor.name}</h2>
                <p className="text-medical-600 dark:text-medical-400 font-medium">{doctor.specialization}</p>
                <p className="text-slate-600 dark:text-slate-400 mt-2">{doctor.location}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">Consultation Fee</span>
                  <span className="font-bold text-medical-600 dark:text-medical-400">{doctor.fees}</span>
                </div>
                
                <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Instant confirmation
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                Book Appointment with Dr. {doctor.name}
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-medical-600" />
                    Patient Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-slate-700 dark:text-white transition-colors duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-slate-700 dark:text-white transition-colors duration-200"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-slate-700 dark:text-white transition-colors duration-200"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Symptoms / Reason for visit
                    </label>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-slate-700 dark:text-white transition-colors duration-200 resize-none"
                      placeholder="Briefly describe your symptoms or reason for the appointment..."
                    />
                  </div>
                </div>

                {/* Appointment Slot Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-medical-600" />
                    Select Appointment Slot *
                  </h3>
                  
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:scale-105 ${
                            selectedSlot === slot
                              ? 'border-medical-500 bg-medical-50 dark:bg-medical-900/20 text-medical-700 dark:text-medical-300'
                              : 'border-slate-200 dark:border-slate-600 hover:border-medical-300 dark:hover:border-medical-700 bg-white dark:bg-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-medical-600" />
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {new Date(slot.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {slot.time}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No available slots for this doctor</p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="submit"
                    disabled={submitting || !selectedSlot || !formData.patientName || !formData.email}
                    className="w-full bg-gradient-to-r from-medical-600 to-medical-500 hover:from-medical-700 hover:to-medical-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Booking Appointment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Confirm Booking</span>
                      </>
                    )}
                  </button>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                    By booking this appointment, you agree to our terms and conditions. 
                    You will receive confirmation via email and SMS.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;