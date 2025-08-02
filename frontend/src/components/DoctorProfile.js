import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Calendar, Phone, Mail, Award, Users } from 'lucide-react';
import { mockAPI, getAvailabilityBadgeColor } from '../mock';
import toast from 'react-hot-toast';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <Link to="/" className="text-medical-600 hover:text-medical-700">
            Return to doctors list
          </Link>
        </div>
      </div>
    );
  }

  const badgeColor = getAvailabilityBadgeColor(doctor.availability);
  const availableSlots = doctor.availableSlots.filter(slot => slot.available);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-medical-600 dark:hover:text-medical-400 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to doctors</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            {/* Doctor Image & Basic Info */}
            <div className="flex-shrink-0 mb-6 lg:mb-0">
              <img
                src={doctor.profileImage}
                alt={doctor.name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white dark:border-slate-700 shadow-lg"
              />
            </div>

            {/* Doctor Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {doctor.name}
                </h1>
                <p className="text-xl text-medical-600 dark:text-medical-400 font-semibold">
                  {doctor.specialization}
                </p>
              </div>

              {/* Status Badge */}
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${badgeColor}`}>
                {doctor.availability}
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-slate-900 dark:text-white">{doctor.rating}</span>
                  <span className="text-slate-600 dark:text-slate-400">({doctor.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <Clock className="w-5 h-5" />
                  <span>{doctor.experience} experience</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-5 h-5" />
                  <span>{doctor.location}</span>
                </div>
              </div>

              {/* Consultation Fee */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Consultation Fee</span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{doctor.fees}</span>
                </div>
              </div>
            </div>

            {/* Book Appointment Button */}
            <div className="flex-shrink-0">
              <Link
                to={`/book/${doctor.id}`}
                className={`inline-flex items-center px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  doctor.availability === 'Available Today'
                    ? 'bg-medical-600 hover:bg-medical-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (doctor.availability !== 'Available Today') {
                    e.preventDefault();
                    toast.error(`Dr. ${doctor.name} is currently ${doctor.availability.toLowerCase()}`);
                  }
                }}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About & Experience */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3 text-medical-600" />
                About Dr. {doctor.name.split(' ')[1]}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {doctor.bio}
              </p>
            </div>

            {/* Experience & Specializations */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <Award className="w-6 h-6 mr-3 text-medical-600" />
                Experience & Expertise
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Years of Experience</h3>
                  <p className="text-medical-600 dark:text-medical-400 text-lg font-semibold">{doctor.experience}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Specialization</h3>
                  <p className="text-medical-600 dark:text-medical-400 text-lg font-semibold">{doctor.specialization}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Patient Reviews</h3>
                  <p className="text-medical-600 dark:text-medical-400 text-lg font-semibold">{doctor.reviews} reviews</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Current Location</h3>
                  <p className="text-medical-600 dark:text-medical-400 text-lg font-semibold">{doctor.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Available Slots */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-medical-600" />
                Available Slots
              </h2>
              
              {availableSlots.length > 0 ? (
                <div className="space-y-3">
                  {availableSlots.slice(0, 6).map((slot, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-medical-50 dark:hover:bg-medical-900/20 transition-colors duration-200"
                    >
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {new Date(slot.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {slot.time}
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    </div>
                  ))}
                  
                  {availableSlots.length > 6 && (
                    <div className="text-center pt-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        +{availableSlots.length - 6} more slots available
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No slots available</p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                  <Phone className="w-5 h-5" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                  <Mail className="w-5 h-5" />
                  <span>{doctor.name.toLowerCase().replace(/\s+/g, '.')}@hospital.com</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-5 h-5" />
                  <span>{doctor.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;