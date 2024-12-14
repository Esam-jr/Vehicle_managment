import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: "", status: "" });
  const [editingStatus, setEditingStatus] = useState("");
  const [vehicleToEdit, setVehicleToEdit] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle({ ...newVehicle, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/vehicles",
        newVehicle
      );
      setVehicles([...vehicles, response.data]);
      setNewVehicle({ name: "", status: "" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error adding vehicle", error);
    }
  };

  const handleUpdateStatus = async (vehicleId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/vehicles/${vehicleId}`,
        { status: editingStatus }
      );
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle._id === vehicleId
            ? { ...vehicle, status: response.data.status }
            : vehicle
        )
      );
      setEditingStatus("");
      setVehicleToEdit(null);
    } catch (error) {
      console.error("Error updating vehicle status", error);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${vehicleId}`);
      setVehicles(vehicles.filter((vehicle) => vehicle._id !== vehicleId));
    } catch (error) {
      console.error("Error deleting vehicle", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Vehicle Management
      </h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Vehicle
        </button>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-white p-6 shadow-md rounded-lg mb-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Create New Vehicle</h2>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Vehicle Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newVehicle.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <input
              type="text"
              id="status"
              name="status"
              value={newVehicle.status}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Add Vehicle
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 text-sm font-medium text-gray-700">
                Vehicle Name
              </th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">
                Last Updated
              </th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-sm text-gray-800">
                  {vehicle.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {vehicleToEdit === vehicle._id ? (
                    <input
                      type="text"
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    vehicle.status
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(vehicle.lastUpdated).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {vehicleToEdit === vehicle._id ? (
                    <button
                      onClick={() => handleUpdateStatus(vehicle._id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingStatus(vehicle.status);
                        setVehicleToEdit(vehicle._id);
                      }}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                    >
                      Edit Status
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteVehicle(vehicle._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
