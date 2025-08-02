// Mock data for NirogGyan Healthcare System

export const mockDoctors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    experience: "12 years",
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    availability: "Available Today",
    rating: 4.8,
    reviews: 142,
    bio: "Dr. Priya Sharma is a renowned cardiologist with over 12 years of experience in treating heart conditions. She specializes in preventive cardiology and minimally invasive procedures.",
    location: "Apollo Hospital, Delhi",
    fees: "₹800",
    availableSlots: [
      { date: "2025-01-20", time: "10:00 AM", available: true },
      { date: "2025-01-20", time: "11:30 AM", available: true },
      { date: "2025-01-20", time: "02:00 PM", available: false },
      { date: "2025-01-21", time: "09:00 AM", available: true },
      { date: "2025-01-21", time: "10:30 AM", available: true },
      { date: "2025-01-22", time: "11:00 AM", available: true }
    ]
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialization: "Orthopedic Surgeon",
    experience: "15 years",
    profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    availability: "Available Today",
    rating: 4.9,
    reviews: 238,
    bio: "Dr. Rajesh Kumar is an expert orthopedic surgeon specializing in joint replacement and sports injury treatment. He has successfully performed over 2000 surgeries.",
    location: "Max Hospital, Mumbai",
    fees: "₹1200",
    availableSlots: [
      { date: "2025-01-20", time: "09:30 AM", available: true },
      { date: "2025-01-20", time: "11:00 AM", available: true },
      { date: "2025-01-20", time: "03:30 PM", available: true },
      { date: "2025-01-21", time: "10:00 AM", available: false },
      { date: "2025-01-21", time: "02:00 PM", available: true }
    ]
  },
  {
    id: 3,
    name: "Dr. Anita Gupta",
    specialization: "Pediatrician",
    experience: "8 years",
    profileImage: "https://images.unsplash.com/photo-1594824920330-8b2a9ca20d63?w=300&h=300&fit=crop&crop=face",
    availability: "Fully Booked",
    rating: 4.7,
    reviews: 89,
    bio: "Dr. Anita Gupta is a compassionate pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence.",
    location: "Fortis Hospital, Bangalore",
    fees: "₹600",
    availableSlots: [
      { date: "2025-01-22", time: "10:00 AM", available: true },
      { date: "2025-01-22", time: "11:30 AM", available: true },
      { date: "2025-01-23", time: "09:00 AM", available: true }
    ]
  },
  {
    id: 4,
    name: "Dr. Vikram Singh",
    specialization: "Neurologist",
    experience: "20 years",
    profileImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
    availability: "On Leave",
    rating: 4.9,
    reviews: 356,
    bio: "Dr. Vikram Singh is a leading neurologist with expertise in treating complex neurological disorders including epilepsy, stroke, and neurodegenerative diseases.",
    location: "AIIMS, Delhi",
    fees: "₹1500",
    availableSlots: [
      { date: "2025-01-25", time: "10:00 AM", available: true },
      { date: "2025-01-25", time: "02:00 PM", available: true }
    ]
  },
  {
    id: 5,
    name: "Dr. Sunita Reddy",
    specialization: "Dermatologist",
    experience: "10 years",
    profileImage: "https://images.unsplash.com/photo-1559457154-61cd6c85c7eb?w=300&h=300&fit=crop&crop=face",
    availability: "Available Today",
    rating: 4.6,
    reviews: 167,
    bio: "Dr. Sunita Reddy specializes in medical and cosmetic dermatology, offering advanced treatments for skin, hair, and nail conditions.",
    location: "Manipal Hospital, Hyderabad",
    fees: "₹900",
    availableSlots: [
      { date: "2025-01-20", time: "12:00 PM", available: true },
      { date: "2025-01-20", time: "01:30 PM", available: true },
      { date: "2025-01-20", time: "04:00 PM", available: true },
      { date: "2025-01-21", time: "11:00 AM", available: true }
    ]
  },
  {
    id: 6,
    name: "Dr. Arjun Menon",
    specialization: "Gastroenterologist",
    experience: "14 years",
    profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    availability: "Available Today",
    rating: 4.8,
    reviews: 203,
    bio: "Dr. Arjun Menon is an experienced gastroenterologist specializing in digestive system disorders and endoscopic procedures.",
    location: "Ruby Hall Clinic, Pune",
    fees: "₹1000",
    availableSlots: [
      { date: "2025-01-20", time: "09:00 AM", available: true },
      { date: "2025-01-20", time: "02:30 PM", available: true },
      { date: "2025-01-21", time: "10:30 AM", available: true }
    ]
  }
];

export const mockAppointments = JSON.parse(localStorage.getItem('nirogGyanAppointments') || '[]');

// Mock API functions
export const mockAPI = {
  getDoctors: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDoctors), 800);
    });
  },

  getDoctorById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const doctor = mockDoctors.find(doc => doc.id === parseInt(id));
        if (doctor) {
          resolve(doctor);
        } else {
          reject(new Error('Doctor not found'));
        }
      }, 500);
    });
  },

  bookAppointment: (appointmentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment = {
          id: Date.now(),
          ...appointmentData,
          status: 'confirmed',
          bookingDate: new Date().toISOString()
        };
        
        const existingAppointments = JSON.parse(localStorage.getItem('nirogGyanAppointments') || '[]');
        existingAppointments.push(newAppointment);
        localStorage.setItem('nirogGyanAppointments', JSON.stringify(existingAppointments));
        
        resolve(newAppointment);
      }, 1000);
    });
  },

  searchDoctors: (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredDoctors = mockDoctors.filter(doctor => 
          doctor.name.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filteredDoctors);
      }, 300);
    });
  }
};

export const getAvailabilityBadgeColor = (availability) => {
  switch (availability) {
    case 'Available Today':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Fully Booked':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'On Leave':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

export const speakText = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  }
};