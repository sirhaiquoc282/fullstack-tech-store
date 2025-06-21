import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit, FiCheckCircle, FiCreditCard, FiCalendar, FiLock, FiUser, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import apiService from "../../service/apiService";

import { number as cardNumberValidator, expirationDate as expirationDateValidator, cvv as cvvValidator } from 'card-validator';

const ProfilePaymentMethods = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [currentEditingCard, setCurrentEditingCard] = useState(null);
    const [formCardData, setFormCardData] = useState({
        type: "",
        bankName: "",
        cardNumber: "",
        last4Digits: "",
        cardholderName: "",
        expiryDate: "",
        cvv: "",
        isDefault: false,
    });
    const [formErrors, setFormErrors] = useState({});

    const [detectedCardBrand, setDetectedCardBrand] = useState(null);

    const vietnameseBanks = [
        { value: "", label: "Select Bank" },
        { value: "Vietcombank", label: "Vietcombank (VCB)" },
        { value: "Techcombank", label: "Techcombank (TCB)" },
        { value: "Agribank", label: "Agribank (AGB)" },
        { value: "BIDV", label: "BIDV" },
        { value: "VietinBank", label: "VietinBank (CTG)" },
        { value: "MBBank", label: "MBBank (MB)" },
        { value: "VPBank", label: "VPBank (VPB)" },
        { value: "ACB", label: "ACB" },
        { value: "Sacombank", label: "Sacombank (STB)" },
        { value: "TPBank", label: "TPBank" },
        { value: "Eximbank", label: "Eximbank (EIB)" },
        { value: "HSBC Bank", label: "HSBC Bank (Vietnam)" },
        { value: "Standard Chartered Bank", label: "Standard Chartered Bank (Vietnam)" },
        { value: "Shinhan Bank", label: "Shinhan Bank (Vietnam)" },
    ];

    // Helper to show Custom Dialog
    const showNotificationDialog = (message, type, confirmActionId = null) => {
        setDialogMessage(message);
        setDialogType(type);
        setCardToDeleteId(confirmActionId);
        setShowCustomDialog(true);
    };

    const closeCustomDialog = () => {
        setShowCustomDialog(false);
        setDialogMessage("");
        setDialogType("");
        setCardToDeleteId(null);
    };

    // State for Custom Confirmation Dialog
    const [showCustomDialog, setShowCustomDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogType, setDialogType] = useState("");
    const [cardToDeleteId, setCardToDeleteId] = useState(null);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiService.getUserPaymentMethods();
                if (response.status === 200) {
                    const formattedCards = response.data.map(card => ({
                        id: card._id,
                        type: card.cardType || 'Unknown',
                        bank: card.bankName || 'Unknown Bank',
                        number: `**** **** **** ${card.last4Digits}`,
                        name: card.cardholderName || 'N/A',
                        expiry: card.expiryDate || 'N/A',
                        isDefault: card.isDefault,
                    }));
                    setCards(formattedCards);
                } else {
                    setError("Failed to load payment methods.");
                    showNotificationDialog("Failed to load payment methods.", "error");
                }
            } catch (err) {
                console.error("Error fetching payment methods:", err);
                setError(err.response?.data?.message || "Error connecting to server.");
                showNotificationDialog(err.response?.data?.message || "Failed to load payment methods.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentMethods();
    }, []);

    // --- Form Validation Logic (Using card-validator) ---
    const validateForm = (data) => {
        const errors = {};
        const cardTypeLower = data.type ? data.type.toLowerCase() : '';

        if (!data.type) errors.type = "Card type is required.";
        if (!data.bankName) errors.bankName = "Bank name is required.";

        const cardNumberCleaned = data.cardNumber.replace(/\s/g, '');
        const validationCardNumber = cardNumberValidator(cardNumberCleaned);

        if (!cardNumberCleaned) {
            errors.cardNumber = "Card number is required.";
        } else if (!validationCardNumber.isValid) {
            errors.cardNumber = validationCardNumber.isPotentiallyValid ? "Invalid card number." : "Card number is too short or contains invalid characters.";
        } else if (validationCardNumber.card && validationCardNumber.card.type.toLowerCase() !== cardTypeLower) {
            errors.cardNumber = "Card number does not match selected card type.";
        }

        if (!data.cardholderName.trim()) errors.cardholderName = "Cardholder name is required.";

        // Expiry Date validation (only for non-ATM cards)
        if (cardTypeLower !== 'atm') {
            const validationExpiry = expirationDateValidator(data.expiryDate);
            if (!data.expiryDate) {
                errors.expiryDate = "Expiry date is required.";
            } else if (!validationExpiry.isValid) {
                errors.expiryDate = validationExpiry.isPotentiallyValid ? "Invalid expiry date (MM/YY)." : "Expiry date is in the past or invalid format.";
            } else if (validationExpiry.isExpired) {
                errors.expiryDate = "Card has expired.";
            }
        }

        // CVV/CVC validation (only for non-ATM cards, and if type is selected)
        // Use card.code.size from card-validator for CVV length expectation
        if (cardTypeLower !== 'atm' && cardTypeLower !== '') {
            const validationCvv = cvvValidator(data.cvv, (detectedCardBrand || validationCardNumber.card)?.code.size);
            if (!data.cvv) {
                errors.cvv = "CVV is required.";
            } else if (!validationCvv.isValid) {
                errors.cvv = validationCvv.isPotentiallyValid ? "Invalid CVV." : "CVV is too short or contains invalid characters.";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Return true if no errors
    };

    // --- Handlers ---
    const handleSetDefault = async (id) => {
        try {
            const response = await apiService.updatePaymentMethod(id, { isDefault: true });

            if (response.status === 200 && response.data.savedCards) {
                const formattedCards = response.data.savedCards.map(card => ({
                    id: card._id, type: card.cardType, bank: card.bankName,
                    number: `**** **** **** ${card.last4Digits}`, name: card.cardholderName,
                    expiry: card.expiryDate, isDefault: card.isDefault,
                }));
                setCards(formattedCards);
                showNotificationDialog("Set as default payment method successfully!", "success");
            } else {
                showNotificationDialog("Failed to set as default. Backend did not return updated list.", "error");
            }
        } catch (error) {
            console.error("Error setting default method:", error);
            showNotificationDialog(error.response?.data?.message || "Failed to set as default.", "error");
        }
    };

    const handleDeleteAttempt = (id) => {
        showNotificationDialog("Are you sure you want to delete this payment method?", "confirm", id);
    };

    const handleDeleteConfirmed = async () => {
        if (!cardToDeleteId) return;
        try {
            await apiService.deletePaymentMethod(cardToDeleteId);
            setCards((prevCards) => prevCards.filter((card) => card.id !== cardToDeleteId));
            showNotificationDialog("Payment method deleted successfully!", "info");
        } catch (error) {
            console.error("Error deleting method:", error);
            showNotificationDialog(error.response?.data?.message || "Failed to delete payment method.", "error");
        } finally {
            closeCustomDialog();
        }
    };

    const handleEdit = (card) => {
        setCurrentEditingCard(card);
        setFormCardData({
            type: card.type,
            bankName: card.bank,
            cardNumber: card.number.replace(/\* /g, ''), // Unmask and remove spaces for editing
            last4Digits: card.number.slice(-4),
            cardholderName: card.name,
            expiryDate: card.expiry === "N/A" ? "" : card.expiry,
            cvv: "", // CVV always empty for edit
            isDefault: card.isDefault,
        });
        setFormErrors({}); // Clear any previous form errors
        setDetectedCardBrand(card.type.toLowerCase()); // Set detected brand for editing
        setShowAddForm(true); // Show form
    };

    // Handles input changes in the form, including formatting and type detection
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        let formattedValue = value;
        let newDetectedBrand = detectedCardBrand;
        let newErrors = { ...formErrors, [name]: '' };

        if (name === "cardNumber") {
            const rawValue = value.replace(/\s/g, '').replace(/[^0-9]/g, '');
            const validation = cardNumberValidator(rawValue);

            if (validation.card) {
                newDetectedBrand = validation.card.type;
            } else {
                newDetectedBrand = null;
            }

            formattedValue = rawValue.replace(/(\d{4})/g, '$1 ').trim();
            if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);

            if (!rawValue) {
                newErrors.cardNumber = "Card number is required.";
            } else if (!validation.isPotentiallyValid) { // For live validation feedback, use isPotentiallyValid
                newErrors.cardNumber = "Invalid card number.";
            } else if (validation.isPotentiallyValid && !validation.isValid && rawValue.length >= (validation.card?.lengths?.[0] || 16)) {
                newErrors.cardNumber = "Card number is too short or contains invalid characters.";
            }

            if (formCardData.type && validation.card && validation.card.type.toLowerCase() !== formCardData.type.toLowerCase()) {
                newErrors.cardNumber = "Card number does not match selected card type.";
            }
            setDetectedCardBrand(newDetectedBrand);

        } else if (name === "expiryDate") {
            formattedValue = value.replace(/\s/g, '').replace(/[^0-9]/g, '');
            if (formattedValue.length > 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
            }
            if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);

            const validation = expirationDateValidator(formattedValue);
            if (!formattedValue) {
                newErrors.expiryDate = "Expiry date is required.";
            } else if (!validation.isPotentiallyValid) {
                newErrors.expiryDate = "Invalid expiry date (MM/YY).";
            } else if (validation.isPotentiallyValid && validation.isExpired) {
                newErrors.expiryDate = "Card has expired.";
            }
        } else if (name === "cvv") {
            // Corrected CVV formatting and validation handling
            formattedValue = value.replace(/[^0-9]/g, ''); // Ensure only digits

            // Get expected CVV length based on detected brand or default
            const expectedCvvLength = (detectedCardBrand && cardNumberValidator(formCardData.cardNumber.replace(/\s/g, '')).card?.type === detectedCardBrand && detectedCardBrand.code?.size)
                || (cardNumberValidator(formCardData.cardNumber.replace(/\s/g, '')).card?.code?.size) // Fallback to current card number's type
                || 3; // Default to 3 if no card type is known (e.g., for ATM)

            if (formattedValue.length > expectedCvvLength) { // Only slice if it exceeds expected
                formattedValue = formattedValue.slice(0, expectedCvvLength);
            }

            const validation = cvvValidator(formattedValue, expectedCvvLength); // Pass expected length
            if (!formattedValue) {
                newErrors.cvv = "CVV is required.";
            } else if (!validation.isPotentiallyValid) { // Use isPotentiallyValid for live feedback
                newErrors.cvv = "Invalid CVV.";
            } else if (validation.isPotentiallyValid && !validation.isValid && formattedValue.length === expectedCvvLength) {
                newErrors.cvv = "CVV is too short or contains invalid characters."; // Only if fully typed and invalid
            }
        }

        setFormCardData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : formattedValue,
        }));
        setFormErrors(newErrors);
    };

    // Handles form submission for adding or updating a card
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm(formCardData)) {
            showNotificationDialog("Please correct the errors in the form.", "error"); // Sử dụng custom dialog
            return;
        }

        const dataToSend = {
            cardType: formCardData.type,
            bankName: formCardData.bankName,
            last4Digits: formCardData.cardNumber.replace(/\s/g, '').slice(-4),
            cardholderName: formCardData.cardholderName,
            expiryDate: formCardData.expiryDate === '' && formCardData.type.toLowerCase() === 'atm' ? 'N/A' : formCardData.expiryDate,
            isDefault: formCardData.isDefault,
        };

        try {
            let response;
            if (currentEditingCard) {
                response = await apiService.updatePaymentMethod(currentEditingCard.id, dataToSend);
            } else {
                response = await apiService.addPaymentMethod(dataToSend);
            }

            if (response.status === 200 || response.status === 201) {
                if (response.data.savedCards) {
                    const formattedCards = response.data.savedCards.map(card => ({
                        id: card._id, type: card.cardType, bank: card.bankName,
                        number: `**** **** **** ${card.last4Digits}`, name: card.cardholderName,
                        expiry: card.expiryDate, isDefault: card.isDefault,
                    }));
                    setCards(formattedCards);
                    showNotificationDialog(currentEditingCard ? "Payment method updated successfully!" : "New payment method added successfully!", "success");
                } else {
                    const fetchResponse = await apiService.getUserPaymentMethods();
                    if (fetchResponse.status === 200) {
                        const formattedFetchedCards = fetchResponse.data.map(card => ({
                            id: card._id, type: card.cardType, bank: card.bankName,
                            number: `**** **** **** ${card.last4Digits}`, name: card.cardholderName,
                            expiry: card.expiryDate, isDefault: card.isDefault,
                        }));
                        setCards(formattedFetchedCards);
                        showNotificationDialog(currentEditingCard ? "Payment method updated successfully!" : "New payment method added successfully!", "success");
                    }
                }
            } else {
                showNotificationDialog(response.data.message || (currentEditingCard ? "Failed to update payment method." : "Failed to add payment method."), "error");
            }
            // Reset form state and close form
            setShowAddForm(false);
            setCurrentEditingCard(null);
            setFormCardData({ type: "", bankName: "", cardNumber: "", last4Digits: "", cardholderName: "", expiryDate: "", cvv: "", isDefault: false });
            setFormErrors({});
            setDetectedCardBrand(null); // Reset detected type
        } catch (error) {
            console.error("Error saving payment method:", error);
            showNotificationDialog(error.response?.data?.message || "Error saving payment method.", "error");
        }
    };

    // --- Helper to get Card Icons (for colored square icon in list) ---
    const getCardIcon = (type) => {
        switch (type.toLowerCase()) {
            case "visa": return <FaCcVisa className="text-white text-xl" />;
            case "mastercard": return <FaCcMastercard className="text-white text-xl" />;
            case "atm": return <FiCreditCard className="text-white text-xl" />;
            case "jcb": return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/200px-JCB_logo.svg.png" alt="JCB" className="h-5 w-auto" />;
            default: return <FiCreditCard className="text-white" />;
        }
    };

    // --- Helper to get actual card brand logo (for display in list beside bank name) ---
    const getCardBrandLogo = (type) => {
        switch (type.toLowerCase()) {
            case "visa": return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5 w-auto" />;
            case "mastercard": return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 w-auto" />;
            case "jcb": return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/200px-JCB_logo.svg.png" alt="JCB" className="h-5 w-auto" />;
            case "atm": return <FiCreditCard size={20} className="text-gray-500" />;
            default: return <FiCreditCard size={20} className="text-gray-500" />;
        }
    };

    // --- Custom Confirmation Dialog Component ---
    const CustomConfirmDialog = ({ message, type, onConfirm, onCancel }) => {
        let bgColor, textColor, icon;
        switch (type) {
            case 'success': bgColor = 'bg-green-100'; textColor = 'text-green-800'; icon = <FiCheckCircle size={24} />; break;
            case 'error': bgColor = 'bg-red-100'; textColor = 'text-red-800'; icon = <FiAlertCircle size={24} />; break;
            case 'info': bgColor = 'bg-blue-100'; textColor = 'text-blue-800'; icon = <FiInfo size={24} />; break;
            case 'confirm': bgColor = 'bg-yellow-100'; textColor = 'text-yellow-800'; icon = <FiAlertCircle size={24} />; break;
            default: bgColor = 'bg-gray-100'; textColor = 'text-gray-800'; icon = null;
        }

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative">
                    <div className={`p-5 flex items-center gap-4 ${bgColor} rounded-t-xl`}>
                        {icon && <div className={textColor}>{icon}</div>}
                        <p className={`font-semibold text-lg ${textColor}`}>{type === 'confirm' ? "Confirm Action" : "Notification"}</p>
                    </div>
                    <button onClick={onCancel} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                        <FiX size={20} />
                    </button>
                    <div className="p-5 text-gray-700">
                        <p className="mb-4">{message}</p>
                        {type === 'confirm' && (
                            <div className="flex justify-end space-x-3">
                                <button onClick={onCancel} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition">Cancel</button>
                                <button onClick={onConfirm} className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition">Confirm</button>
                            </div>
                        )}
                        {type !== 'confirm' && (
                            <div className="flex justify-end">
                                <button onClick={onCancel} className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition">OK</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };


    // --- Loading & Error States Display ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
                <p className="ml-4 text-gray-600">Loading payment methods...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Payment Methods</h2>
                <p className="text-gray-700">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 md:p-6 bg-white rounded-xl shadow-lg">
            {/* Custom Confirmation Dialog */}
            {showCustomDialog && (
                <CustomConfirmDialog
                    message={dialogMessage}
                    type={dialogType}
                    onConfirm={dialogType === 'confirm' ? () => handleDeleteConfirmed(cardToDeleteId) : closeCustomDialog}
                    onCancel={closeCustomDialog}
                />
            )}

            {/* Header and Add New Button */}
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payment Methods</h1>
                <button
                    onClick={() => {
                        setCurrentEditingCard(null); // Reset for new card
                        setFormCardData({ type: "", bankName: "", cardNumber: "", last4Digits: "", cardholderName: "", expiryDate: "", cvv: "", isDefault: false }); // Clear form
                        setFormErrors({}); // Clear errors
                        setShowAddForm(!showAddForm); // Toggle form visibility
                    }}
                    className="
            bg-red-700 text-white px-5 py-2.5 rounded-lg flex items-center
            hover:bg-red-800 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2
          "
                >
                    <FiPlus className="mr-2 text-lg" />
                    {showAddForm ? "Cancel" : "Add New"}
                </button>
            </div>

            {/* Add/Edit Payment Method Form */}
            {showAddForm && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {currentEditingCard ? "Edit Payment Method" : "Add New Payment Method"}
                    </h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {/* Card Type Select Input */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Card Type <span className="text-red-600">*</span></label>
                            <select
                                id="type"
                                name="type"
                                value={formCardData.type}
                                onChange={handleFormChange}
                                className={`
                  block w-full px-3 py-2 border rounded-md shadow-sm
                  focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm
                  ${formErrors.type ? 'border-red-500' : 'border-gray-300'}
                `}
                                required
                            >
                                <option value="">Select card type</option>
                                <option value="Visa">Visa</option>
                                <option value="Mastercard">Mastercard</option>
                                <option value="ATM">Domestic ATM Card</option>
                                <option value="JCB">JCB</option>
                            </select>
                            {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}
                        </div>

                        {/* Bank Name Select Input */}
                        <div>
                            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name <span className="text-red-600">*</span></label>
                            <select
                                id="bankName"
                                name="bankName"
                                value={formCardData.bankName}
                                onChange={handleFormChange}
                                className={`
                  block w-full px-3 py-2 border rounded-md shadow-sm
                  focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm
                  ${formErrors.bankName ? 'border-red-500' : 'border-gray-300'}
                `}
                                required
                            >
                                {vietnameseBanks.map(bank => (
                                    <option key={bank.value} value={bank.value}>{bank.label}</option>
                                ))}
                            </select>
                            {formErrors.bankName && <p className="text-red-500 text-xs mt-1">{formErrors.bankName}</p>}
                        </div>

                        {/* Card Number Input (optimized) */}
                        <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number <span className="text-red-600">*</span></label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={formCardData.cardNumber}
                                    onChange={handleFormChange}
                                    className={`
                    block w-full px-3 py-2 pl-10 border rounded-md shadow-sm
                    focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm
                    ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'}
                  `}
                                    placeholder="e.g., 1234 5678 9012 3456"
                                    required
                                />
                                <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
                        </div>

                        {/* Cardholder Name */}
                        <div>
                            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name <span className="text-red-600">*</span></label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="cardholderName"
                                    name="cardholderName"
                                    value={formCardData.cardholderName}
                                    onChange={handleFormChange}
                                    className={`
                    block w-full px-3 py-2 pl-10 border rounded-md shadow-sm
                    focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm
                    ${formErrors.cardholderName ? 'border-red-500' : 'border-gray-300'}
                  `}
                                    placeholder="Name as on card (CAPITAL LETTERS, NO ACCENTS)"
                                    required
                                />
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            {formErrors.cardholderName && <p className="text-red-500 text-xs mt-1">{formErrors.cardholderName}</p>}
                        </div>

                        {/* Expiry Date (MM/YY) */}
                        {formCardData.type !== 'ATM' && ( // Only show for non-ATM cards
                            <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (MM/YY) <span className="text-red-600">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        name="expiryDate"
                                        value={formCardData.expiryDate}
                                        onChange={handleFormChange}
                                        className={`
                      block w-full px-3 py-2 pl-10 border rounded-md shadow-sm
                      focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm
                      ${formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'}
                    `}
                                        placeholder="MM/YY e.g., 12/25"
                                        maxLength={5}
                                        required={formCardData.type !== 'ATM'} // Required for non-ATM
                                    />
                                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {formErrors.expiryDate && <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>}
                            </div>
                        )}

                        {/* CVV/CVC (Only show for non-ATM cards) */}
                        {formCardData.type !== 'ATM' && formCardData.type !== '' && (
                            <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV/CVC <span className="text-red-600">*</span></label>
                                <div className="relative">
                                    <input
                                        type="tel" // Changed to tel
                                        id="cvv"
                                        name="cvv"
                                        value={formCardData.cvv}
                                        onChange={handleFormChange}
                                        className={`
                      block w-full px-3 py-2 pl-10 border rounded-md shadow-sm
                      focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm
                      ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'}
                    `}
                                        placeholder="e.g., 123 (3 or 4 digits)"
                                        maxLength={4}
                                        required={formCardData.type !== 'ATM'} // Required for non-ATM
                                    />
                                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {formErrors.cvv && <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>}
                            </div>
                        )}

                        {/* Set as Default Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={formCardData.isDefault}
                                onChange={handleFormChange}
                                className="form-checkbox h-4 w-4 text-red-700 border-gray-300 rounded focus:ring-red-700"
                            />
                            <label htmlFor="isDefault" className="ml-2 text-gray-700 text-sm">Set as default payment method</label>
                        </div>

                        {/* Form Action Buttons */}
                        <button
                            type="submit"
                            className="
                w-full bg-red-700 text-white px-4 py-2.5 rounded-md flex items-center justify-center
                hover:bg-red-800 transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2
              "
                        >
                            <FiPlus className="mr-2" /> {currentEditingCard ? "Update Card" : "Add Card"}
                        </button>
                    </form>
                </div>
            )}

            {/* List of existing payment methods */}
            <div className="space-y-4">
                {cards.length === 0 && !loading ? (
                    <p className="text-gray-600 text-center py-8">You have no payment methods added yet.</p>
                ) : (
                    cards.map((card) => (
                        <div
                            key={card.id}
                            className="
                bg-white rounded-xl shadow-md border border-gray-200 p-6
                flex flex-col sm:flex-row justify-between items-start sm:items-center
              "
                        >
                            {/* Card Information */}
                            <div className="flex items-center mb-4 sm:mb-0">
                                <div className="flex items-center justify-center mr-4 text-white text-lg">
                                    {/* Display actual card brand logo or fallback icon */}
                                    {getCardBrandLogo(card.type)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">{card.bank} ({card.type})</h3>
                                    <p className="text-sm text-gray-600">{card.number}</p>
                                </div>
                            </div>

                            {/* Details and Actions */}
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                                <div className="text-right sm:text-left mr-0 sm:mr-6">
                                    <p className="text-sm text-gray-500">Cardholder Name</p>
                                    <p className="font-medium text-gray-700">{card.name}</p>
                                </div>
                                {card.expiry !== "N/A" && (
                                    <div className="text-right sm:text-left mr-0 sm:mr-6">
                                        <p className="text-sm text-gray-500">Expiry Date</p>
                                        <p className="font-medium text-gray-700">{card.expiry}</p>
                                    </div>
                                )}

                                {/* Set as Default Button */}
                                <button
                                    onClick={() => handleSetDefault(card.id)}
                                    className={`
                    py-2 px-4 rounded-full text-sm font-medium
                    ${card.isDefault
                                            ? "bg-green-100 text-green-800 cursor-default"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                                        }
                  `}
                                    disabled={card.isDefault}
                                >
                                    {card.isDefault ? (
                                        <span className="flex items-center"><FiCheckCircle className="mr-1" /> Default</span>
                                    ) : (
                                        "Set as Default"
                                    )}
                                </button>

                                {/* Action Buttons (Edit, Delete) */}
                                <div className="flex space-x-2">
                                    <button
                                        className="
                      p-2 rounded-full text-gray-500 hover:text-red-700 hover:bg-gray-100
                      transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-700
                    "
                                        title="Edit"
                                        onClick={() => handleEdit(card)}
                                    >
                                        <FiEdit size={20} />
                                    </button>
                                    <button
                                        className="
                      p-2 rounded-full text-gray-500 hover:text-red-700 hover:bg-gray-100
                      transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-700
                    "
                                        title="Delete"
                                        onClick={() => handleDeleteAttempt(card.id)}
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Payment Security Section */}
            <div className="bg-gray-50 rounded-xl shadow-inner p-6 border border-gray-200 mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Security</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    Your payment information is securely stored and encrypted. We never share your financial
                    details with third parties.
                </p>
                <div className="flex items-center text-green-600 font-medium">
                    <FiCheckCircle className="h-5 w-5 mr-2" />
                    <span>Secure Payment Processing</span>
                </div>
            </div>
        </div>
    );
};

export default ProfilePaymentMethods;