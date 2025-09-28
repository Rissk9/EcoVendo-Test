// src/App.js - REPLACE YOUR CURRENT APP.JS WITH THIS
import React from 'react';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import UserProfile from './UserProfile';
import EventForm from './EventForm'; 
import EventList from './EventList'; 
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen bg-gray-50">
        <ProtectedRoute>
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-2xl font-bold text-indigo-800">
                EcoVENDO Organizer Dashboard
              </h1>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* User Profile Section */}
            <UserProfile />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Event Creation */}
              <div>
                <h2 className="text-xl font-semibold text-indigo-800 mb-4">
                  Create New Event
                </h2>
                <EventForm />
              </div>
              
              {/* Event List */}
              <div>
                <h2 className="text-xl font-semibold text-indigo-800 mb-4">
                  Your Events
                </h2>
                <EventList />
              </div>
            </div>
          </main>
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
}

export default App;
// import logo from './logo.svg';
// import './App.css';
// import EventForm from './EventForm';
// import EventList from './EventList';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// import React from 'react';
// import { Eventform } from './EventForm'; // Note the curly braces!
// import { EventList } from './EventList'; // Note the curly braces!
// // ... and render them like before
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header>
//         <h1>Event Organizer Dashboard</h1>
//       </header>
//       <main>
//         {/* You need to add this part to render the components */}
//         <EventForm />
//         <EventList />
//       </main>
//     </div>
//   );
// }

// export default App;

// import React from 'react';
// // FIX: Using Default Imports (no curly braces) as per the 'export default' convention.
// // File names confirmed: EventForm.js and EventList.js
// import EventForm from './EventForm'; 
// import EventList from './EventList'; 
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header>
//         <h1>EcoVENDO Organizer Dashboard</h1>
//       </header>
//       <main className="p-4">
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-indigo-800">1. Post New Event</h2>
//           {/* Component rendered with correct PascalCase tag matching the import name */}
//           <EventForm /> 
//         </div>
        
//         <h2 className="text-xl font-semibold text-indigo-800">2. Real-time Event List</h2>
//         <EventList />
//       </main>
//     </div>
//   );
// }

// export default App;
