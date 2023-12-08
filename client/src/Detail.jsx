import React, { useState } from "react";

const Detail = ({ person, onSave }) => {
  const [editedPerson, setEditedPerson] = useState({ ...person });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPerson((prevPerson) => ({
      ...prevPerson,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedPerson);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Person</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={editedPerson.name}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Age:</label>
          <input
            type="number"
            name="age"
            value={editedPerson.age}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Occupation:
          </label>
          <input
            type="text"
            name="occupation"
            value={editedPerson.occupation}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Gender:</label>
          <input
            type="text"
            name="gender"
            value={editedPerson.gender}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        {/* <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Date of Birth:</label>
          <input
            type="text"
            name="dob"
            value={editedPerson.dob}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div> */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">City:</label>
          <input
            type="text"
            name="city"
            value={editedPerson.city}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Detail;
