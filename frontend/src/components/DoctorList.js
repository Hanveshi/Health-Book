import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, MapPin, Clock, Calendar, Users } from 'lucide-react';
import { mockAPI, getAvailabilityBadgeColor } from '../mock';
import toast from 'react-hot-toast';

const DoctorCard = ({ doctor }) => {
  const badgeColor = getAvailabilityBadgeColor(doctor.availability);

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-medical-200 dark:hover:border-medical-700 hover:-translate-y-1">
      <div className="p-6">
        {/* Doctor Image & Status */}
        <div className="relative mb-4">
          <img
            src={doctor.profileImage}
            alt={doctor.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className={`absolute -top-1 -right-1 px-2 py-1 rounded-full text-xs font-medium border ${badgeColor}`}>
            {doctor.availability}
          </div>
        </div>

        {/* Doctor Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors duration-200">
              {doctor.name}
            </h3>
            <p className="text-medical-600 dark:text-medical-400 font-medium">
              {doctor.specialization}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold">{doctor.rating}</span>
              <span>({doctor.reviews})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{doctor.experience}</span>
            </div>
          </div>

          {/* Location & Fees */}
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{doctor.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Consultation</span>
              <span className="font-semibold text-slate-900 dark:text-white">{doctor.fees}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Link
              to={`/doctor/${doctor.id}`}
              className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 text-center"
            >
              View Profile
            </Link>
            <Link
              to={`/book/${doctor.id}`}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-center transition-all duration-200 ${
                doctor.availability === 'Available Today'
                  ? 'bg-medical-600 hover:bg-medical-700 text-white hover:scale-105'
                  : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
              onClick={(e) => {
                if (doctor.availability !== 'Available Today') {
                  e.preventDefault();
                  toast.error(`Dr. ${doctor.name} is currently ${doctor.availability.toLowerCase()}`);
                }
              }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
    <div className="flex items-start space-x-4 mb-4">
      <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
      <div className="flex space-x-3">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
      </div>
    </div>
  </div>
);

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await mockAPI.getDoctors();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await mockAPI.searchDoctors(query);
        setFilteredDoctors(results);
      } catch (error) {
        toast.error('Search failed');
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-medical-600 via-medical-500 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Healthcare Partner
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-medical-100 max-w-3xl mx-auto">
              Connect with top-rated doctors, book appointments instantly, and take control of your health journey
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-slate-900 bg-white/95 backdrop-blur-sm rounded-2xl border-0 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center space-x-8 mt-12 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-medical-200">Expert Doctors</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">50k+</div>
                <div className="text-medical-200">Happy Patients</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-medical-200">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Available Doctors
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {loading ? 'Loading doctors...' : `${filteredDoctors.length} doctors found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              No doctors found
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;