// src/EventForm.js - REPLACE YOUR CURRENT EVENTFORM.JS WITH THIS
import React, { useState } from 'react';
import { db } from './firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

function EventForm() {
  const { user } = useAuth(); // Get current user
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Enhanced form validation
  const validateForm = () => {
    if (!eventName.trim()) return "Event name is required";
    if (!eventLocation.trim()) return "Location is required";
    if (!eventDate) return "Date is required";
    
    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) return "Event date cannot be in the past";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Add event with authenticated user info
      await addDoc(collection(db, 'events'), {
        name: eventName,
        location: eventLocation,
        date: eventDate,
        description: eventDescription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        organizerId: user.uid, // Use actual user ID
        organizerName: user.displayName || 'Anonymous Organizer',
        organizerEmail: user.email,
        organizerPhone: user.phoneNumber,
        status: 'published',
        attendees: 0,
        maxAttendees: null
      });

      // Success: Clear form and show success message
      setEventName('');
      setEventLocation('');
      setEventDate('');
      setEventDescription('');
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('Error adding event to Firestore: ', err);
      setError('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-indigo-500">
      
      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          ✅ Event created successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name *
          </label>
          <input
            type="text"
            placeholder="e.g., Spring Festival 2024"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isSubmitting}
            required
          />
        </div>
        
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            placeholder="e.g., Central Park, Main Street"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isSubmitting}
            required
          />
        </div>
        
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Date *
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            placeholder="Tell people about your event..."
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full text-white font-bold py-3 px-4 rounded-md transition duration-300 
            ${isSubmitting 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-[1.02]'
            }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Event...
            </span>
          ) : (
            'Create Event'
          )}
        </button>
      </form>
    </div>
  );
}

export default EventForm;
// import React, { useState } from 'react';
// import { db } from './firebase'; 
// import { collection, addDoc } from 'firebase/firestore';

// function EventForm() {
//   // 1. STATE: To manage the three required form inputs
//   const [eventName, setEventName] = useState('');
//   const [eventLocation, setEventLocation] = useState('');
//   const [eventDate, setEventDate] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   // 2. HANDLER: Function to process form submission and talk to Firebase
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent page reload
//     setError(null);
//     setIsSubmitting(true);

//     try {
//       // 2a. Attempt to add a new document to the 'events' collection
//       await addDoc(collection(db, 'events'), {
//         name: eventName,
//         location: eventLocation,
//         date: eventDate,
//         createdAt: new Date().toISOString(), // Timestamp for ordering
//         organizerId: "Organizer-123", // Placeholder organizer ID
//       });

//       // 2b. Success: Clear the form fields
//       setEventName('');
//       setEventLocation('');
//       setEventDate('');
//       alert('Event successfully posted to the marketplace!');

//     } catch (err) {
//       // 2c. Error Handling
//       console.error('Error adding event to Firestore: ', err);
//       setError('Failed to create event. Check console for details.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg border-t-4 border-indigo-500">
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
        
//         {/* Event Name Input */}
//         <input
//           type="text"
//           placeholder="Event Name (e.g., Spring Fest Carnival)"
//           value={eventName}
//           onChange={(e) => setEventName(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           disabled={isSubmitting}
//           required
//         />
        
//         {/* Location Input */}
//         <input
//           type="text"
//           placeholder="Location (e.g., University Grounds, Main Street)"
//           value={eventLocation}
//           onChange={(e) => setEventLocation(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           disabled={isSubmitting}
//           required
//         />
        
//         {/* Date Input */}
//         <input
//           type="date"
//           value={eventDate}
//           onChange={(e) => setEventDate(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           disabled={isSubmitting}
//           required
//         />

//         {/* Submit Button */}
//         <button 
//           type="submit" 
//           disabled={isSubmitting}
//           className={`w-full text-white font-bold py-2 px-4 rounded-md transition duration-300 
//             ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
//         >
//           {isSubmitting ? 'Posting Event...' : 'Create Event'}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default EventForm;