import React, { useState } from "react";
import { FiMapPin, FiHome, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const ProfileAddresses = () => {
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: "Home",
            fullName: "Sami Ahmed",
            address: "123 Main Street, Apt 4B",
            city: "New York",
            state: "NY",
            zip: "10001",
            phone: "+1 (555) 123-4567",
            isDefault: true
        },
        {
            id: 2,
            name: "Work",
            fullName: "Sami Ahmed",
            address: "456 Business Ave, Floor 12",
            city: "New York",
            state: "NY",
            zip: "10005",
            phone: "+1 (555) 987-6543",
            isDefault: false
        }
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);

    const handleSetDefault = (id) => {
        setAddresses(addresses.map(address => ({
            ...address,
            isDefault: address.id === id
        })));
    };

    const handleDelete = (id) => {
        setAddresses(addresses.filter(address => address.id !== id));
    };

    const handleEdit = (address) => {
        setCurrentAddress(address);
        setIsEditing(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Addresses</h1>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-700 transition"
                    onClick={() => {
                        setCurrentAddress(null);
                        setIsEditing(true);
                    }}
                >
                    <FiPlus className="mr-2" />
                    Add New Address
                </button>
            </div>

            {isEditing ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {currentAddress ? "Edit Address" : "Add New Address"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Address Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Home, Work"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                                defaultValue={currentAddress?.name || ""}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                                defaultValue={currentAddress?.fullName || ""}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-gray-700 mb-2">Street Address</label>
                            <input
                                type="text"
                                placeholder="Street address"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                                defaultValue={currentAddress?.address || ""}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">City</label>
                            <input
                                type="text"
                                placeholder="City"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                                defaultValue={currentAddress?.city || ""}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">State</label>
                            <input
                                type="text"
                                placeholder="State"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                                defaultValue={currentAddress?.state || ""}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">ZIP Code</label>
                            <input
                                type="text"
                                placeholder="ZIP code"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                                defaultValue={currentAddress?.zip || ""}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Phone number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                                defaultValue={currentAddress?.phone || ""}
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center">
                            <input
                                type="checkbox"
                                id="defaultAddress"
                                className="mr-2"
                                defaultChecked={currentAddress?.isDefault || false}
                            />
                            <label htmlFor="defaultAddress" className="text-gray-700">
                                Set as default shipping address
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                            Save Address
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <div key={address.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3">
                                            <FiHome />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{address.name}</h3>
                                            {address.isDefault && (
                                                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            className="text-gray-500 hover:text-red-600"
                                            onClick={() => handleEdit(address)}
                                        >
                                            <FiEdit />
                                        </button>
                                        {!address.isDefault && (
                                            <button
                                                className="text-gray-500 hover:text-red-600"
                                                onClick={() => handleDelete(address.id)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 text-gray-700">
                                    <p>{address.fullName}</p>
                                    <p>{address.address}</p>
                                    <p>{address.city}, {address.state} {address.zip}</p>
                                    <p>{address.phone}</p>
                                </div>

                                {!address.isDefault && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleSetDefault(address.id)}
                                            className="w-full py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                                        >
                                            Set as Default
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Shipping Preferences</h2>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                                <p className="font-medium">Standard Shipping</p>
                                <p className="text-sm text-gray-500">3-5 business days</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mt-3">
                            <div>
                                <p className="font-medium">Express Shipping</p>
                                <p className="text-sm text-gray-500">1-2 business days (additional fee)</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfileAddresses;