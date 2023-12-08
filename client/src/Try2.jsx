// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3001'); // Use your server address

// const Try2 = () => {
//   const [userId, setUserId] = useState('');
//   const [leads, setLeads] = useState({
//     1: { user: null },
//     2: { user: null },
//     3: { user: null },
//     4: { user: null },
//     5: { user: null },
//   });

//   const openLead = (leadId) => {
//     socket.emit('openLead', leadId, userId);
//   };

//   useEffect(() => {
//     socket.on('leadOpened', ({ leadId, userId }) => {
//       setLeads((prevLeads) => ({
//         ...prevLeads,
//         [leadId]: { user: userId },
//       }));
//     });

//     socket.on('invalidLead', (message) => {
//       console.log(`Error: ${message}`);
//     });

//     socket.on('leadAlreadyOpened', (message) => {
//       console.log(`Error: ${message}`);
//     });

//     socket.on('updateLeads', (updatedLeads) => {
//       setLeads(updatedLeads);
//     });

//     return () => {
//       socket.off('leadOpened');
//       socket.off('invalidLead');
//       socket.off('leadAlreadyOpened');
//       socket.off('updateLeads');
//     };
//   }, [userId]);

//   return (
//     <div>
//       <h2>Leads</h2>
//       <div>
//         <label htmlFor="userId">Set User ID: </label>
//         <input
//           type="text"
//           id="userId"
//           value={userId}
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"
//           onChange={(e) => setUserId(e.target.value)}
//         />
//       </div>
//       <ul className="list-disc" >
//         {[1, 2, 3, 4, 5].map((leadId) => (
//           <li key={leadId}>
//             Lead {leadId}
//             {leads[leadId].user && <span> - Opened by {leads[leadId].user}</span>}
//             <button onClick={() => openLead(leadId)} className=" bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" >Open Lead</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Try2;


///////////////
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'tailwindcss/tailwind.css';

const socket = io('http://http://192.168.1.76:3001');

const Try2 = () => {
  const [userId, setUserId] = useState('');
  const [leads, setLeads] = useState({
    1: { user: null },
    2: { user: null },
    3: { user: null },
    4: { user: null },
    5: { user: null },
  });
  // useEffect(() => {
  //   if (!userId || !Number.isInteger(parseInt(userId))) {
  //     console.log(`Invalid userID ${userId}`);
  //     return;
  //     }
  //     socket.emit('join', parseInt(userId));
  //     socket.on('openedBy', ({ leadId }) => {
  //       setLeads({ ...leads, [leadId]: { user: `User ${userId}` }});
  //       });
  //       }, [userId]);

  const openLead = (leadId) => {
    socket.emit('openLead', leadId, userId);
  };

  const closeLead = (leadId) => {
    socket.emit('closeLead', leadId,userId);
  };

  useEffect(() => {
    socket.on('leadOpened', ({ leadId, userId }) => {
      setLeads((prevLeads) => ({
        ...prevLeads,
        [leadId]: { user: userId },
      }));
    });

    socket.on('leadClosed', (leadId) => {
      setLeads((prevLeads) => ({
        ...prevLeads,
        [leadId]: { user: null },
      }));
    });

    socket.on('invalidLead', (message) => {
      console.log(`Error: ${message}`);
    });

    socket.on('leadAlreadyOpened', (message) => {
      console.log(`Error: ${message}`);
    });

    socket.on('updateLeads', (updatedLeads) => {
      setLeads(updatedLeads);
    });

    return () => {
      socket.off('leadOpened');
      socket.off('leadClosed');
      socket.off('invalidLead');
      socket.off('leadAlreadyOpened');
      socket.off('updateLeads');
    };
  }, [userId]);


  return (
    <div className="container mx-auto my-8">
      <h2 className="text-2xl font-semibold mb-4">Leads</h2>
      <div className="mb-4">
        <label htmlFor="userId" className="mr-2">
          Set User ID:
        </label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border rounded py-1 px-2"
        />
      </div>
      <ul>
        {[1, 2, 3, 4, 5].map((leadId) => (
          <li key={leadId} className="flex items-center justify-between border-b py-2">
            <span>
              Lead {leadId}
              {leads[leadId].user && <span className="ml-2">- Opened by {leads[leadId].user}</span>}
            </span>
            <div>
              {leads[leadId].user === userId && (
                <button onClick={() => closeLead(leadId)} className="bg-red-500 text-white py-1 px-2 rounded mr-2">
                  Close Lead
                </button>
              )}
              <button onClick={() => openLead(leadId)} className="bg-blue-500 text-white py-1 px-2 rounded">
                Open Lead
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Try2;
