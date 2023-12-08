import React, { useState, useEffect } from 'react';
import {io} from 'socket.io-client';

const socket = io('http://192.168.1.76:3001/'); // Update with your server URL

const Try = () => {
  const [recordId, setRecordId] = useState('');
  const [username, setUsername] = useState('');
  const [lockInfo, setLockInfo] = useState(null);

  useEffect(() => {
    // Listen for recordOpened, recordLocked, and recordClosed events
    socket.on('recordOpened', (openedRecordId, openedBy) => {
      setLockInfo({ locked: false, openedBy }); 
    });

    socket.on('recordLocked', (lockedRecordId, lockedBy) => {
      setLockInfo({ locked: true, openedBy: lockedBy });
    });

    socket.on('recordClosed', (closedRecordId) => {
      if (recordId === closedRecordId) {
        setLockInfo(null);
      }
    });

    // Cleanup on unmount or component update
    return () => {
      socket.off('recordOpened');
      socket.off('recordLocked');
      socket.off('recordClosed');
    };
  }, [recordId]);

  const handleOpenRecord = () => {
    socket.emit('openRecord', recordId, username);
  };

  const handleCloseRecord = () => {
    socket.emit('closeRecord', recordId);
  };

  console.log(lockInfo?.locked);
  return (
    <div>
      <h1>Record Viewer</h1>
      <label>
        Record ID:
        <input type="text" value={recordId} onChange={(e) => setRecordId(e.target.value)} />
      </label>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <button onClick={handleOpenRecord} disabled={lockInfo?.locked}  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded disabled:opacity-75 "  >
        Open Record
      </button>
      <button onClick={handleCloseRecord}  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Close Record</button>
      {lockInfo && (
        <div>
          {lockInfo.locked ? (
            <p>Record locked by {lockInfo.openedBy}. Please wait.</p>
          ) : (
            <p>Record opened by {lockInfo.openedBy}.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Try;



///////////////////////////////////////