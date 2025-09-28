import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, onSnapshot, query, orderBy, where, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

function EventList() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Show ONLY current user's events
        const q = query(
            collection(db, 'events'),
            where('organizerId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const eventsArray = [];
            
            querySnapshot.forEach((doc) => {
                eventsArray.push({ id: doc.id, ...doc.data() });
            });
            
            setEvents(eventsArray);
            setLoading(false); 
        }, (error) => {
            console.error("Firestore real-time listener failed:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]); 

    const formatDate = (dateString) => {
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleDeleteEvent = async (eventId, eventName) => {
        if (window.confirm(`Are you sure you want to delete "${eventName}"?`)) {
            try {
                await deleteDoc(doc(db, 'events', eventId));
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading your events...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Your Events</h3>
                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                    {events.length} events
                </span>
            </div>

            {/* Events Display */}
            {events.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8" />
                        </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">No Events Yet</h4>
                    <p className="text-gray-500 text-sm">
                        Create your first event using the form above to get started.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {events.map((event) => (
                        <div 
                            key={event.id} 
                            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="text-lg font-medium text-gray-900">
                                            {event.name}
                                        </h4>
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                            Active
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span><strong>Location:</strong> {event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-5 8a2 2 0 114 0m-1-4a2 2 0 11-2 0" />
                                            </svg>
                                            <span><strong>Date:</strong> {formatDate(event.date)}</span>
                                        </div>
                                        {event.description && (
                                            <div className="flex items-start gap-2 mt-2">
                                                <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                                </svg>
                                                <span className="text-gray-700">{event.description}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Created {new Date(event.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 ml-4">
                                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium px-3 py-1 rounded border border-indigo-200 hover:bg-indigo-50 transition">
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteEvent(event.id, event.name)}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EventList;
// import React from 'react';
// import React, { useState, useEffect } from 'react';
// import { db } from './firebase'; // <-- your database connection
// import { collection, onSnapshot, query } from 'firebase/firestore';
// const [events, setEvents] = useState([]);

// const EventList = ({ events }) => {
//   return (
//     <div className="event-list">
//       {events.map((event, index) => (
//         <div key={index} className="event-card">
//           <h3>{event.name}</h3>
//           <p>Location: {event.location}</p>
//           <p>Date: {event.date}</p>
//         </div>
//       ))}
//     </div>
//   );
// };
// useEffect(() => {
//     // Create a query to the 'events' collection
//     const q = query(collection(db, 'events'));

//     // Set up the real-time listener
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const eventsArray = [];
//         querySnapshot.forEach((doc) => {
//             eventsArray.push({ id: doc.id, ...doc.data() });
//         });
//         setEvents(eventsArray);
//     });

//     // This is a cleanup function to prevent memory leaks
//     return () => unsubscribe();
// }, []); // Empty dependency array means this effect runs only once

// export default EventList;
// import React, { useState, useEffect } from 'react';
// import { db } from './firebase'; 
// import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// function EventList() {
//     // State to hold the events data fetched from Firestore
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Use query to fetch the 'events' collection and order by the creation time
//         // The orderBy is important to see the newest events first
//         const eventsCollectionRef = collection(db, 'events');
//         const q = query(eventsCollectionRef, orderBy('createdAt', 'desc'));

//         // Set up the real-time listener (onSnapshot)
//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const eventsArray = [];
            
//             // Loop through all documents (events) returned
//             querySnapshot.forEach((doc) => {
//                 // Store both the document ID (for React key) and the data
//                 eventsArray.push({ id: doc.id, ...doc.data() });
//             });
            
//             // Update the React state with the new list of events
//             setEvents(eventsArray);
//             setLoading(false); 
//         }, (error) => {
//             console.error("Firestore real-time listener failed:", error);
//             setLoading(false);
//         });

//         // Cleanup: This runs when the component is removed to stop the listener
//         return () => unsubscribe();
//     }, []); 

//     // --- RENDERING LOGIC ---
//     if (loading) {
//         return (
//             <div className="text-center p-8">
//                 <p className="text-lg text-indigo-600 font-semibold">Loading events...</p>
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mt-4"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="mt-4 p-4 max-w-lg mx-auto">
            
//             {events.length === 0 ? (
//                 <p className="text-gray-500 italic text-center p-4 border rounded">
//                   No events found. Be the first to add one using the form above!
//                 </p>
//             ) : (
//                 <div className="space-y-4">
//                     {events.map((event) => (
//                         <div key={event.id} className="event-card bg-white p-4 border border-indigo-200 rounded-lg shadow-md">
//                             <h3 className="text-xl font-semibold text-indigo-800">{event.name}</h3>
//                             <p className="text-sm text-gray-700 mt-1">
//                                 <strong>📍 Location:</strong> {event.location}
//                             </p>
//                             <p className="text-sm text-gray-700">
//                                 <strong>🗓 Date:</strong> {event.date}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default EventList;
