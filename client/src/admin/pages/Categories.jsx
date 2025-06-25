import React, { useState, useEffect, useCallback, Fragment } from 'react';
import {
  PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, ExclamationTriangleIcon,
  CheckCircleIcon, InformationCircleIcon, PhotoIcon
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from '@headlessui/react';
import apiService from "../../service/apiService";

const LoadingSpinner = ({ size = 24, color = "currentColor", className = "" }) => (
  <div
    className={`inline-block animate-spin rounded-full border-2 border-solid border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
    style={{
      width: `${size / 16}rem`,
      height: `${size / 16}rem`,
      borderColor: color,
      borderRightColor: 'transparent',
    }}
    role="status"
  >
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
);


const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false, className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';
  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`}>
      {children}
    </button>
  );
};

const InputField = ({ label, name, type = 'text', value, onChange, error, required, as = 'input', className, children, ...props }) => {
  const commonProps = {
    id: name, name, value, onChange, ...props,
    className: `block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${error ? 'ring-red-500 focus:ring-red-500' : 'focus:ring-red-600'} ${className}`
  };

  return (
    <div className={`${props.fullWidth ? 'col-span-full' : ''}`}>
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900 mb-1.5">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div>
        {as === 'select' ? (
          <select {...commonProps}>
            {children}
          </select>
        ) : as === 'textarea' ? (
          <textarea {...commonProps} />
        ) : (
          <input type={type} {...commonProps} />
        )}
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const Toast = ({ isOpen, message, severity, onClose }) => {
  const severities = {
    success: { bg: 'bg-green-600', icon: <CheckCircleIcon className="h-5 w-5 text-white" /> },
    error: { bg: 'bg-red-600', icon: <XMarkIcon className="h-5 w-5 text-white" /> },
    warning: { bg: 'bg-yellow-500', icon: <ExclamationTriangleIcon className="h-5 w-5 text-white" /> },
    info: { bg: 'bg-blue-600', icon: <InformationCircleIcon className="h-5 w-5 text-white" /> },
  };
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => { onClose(); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);
  return (
    <Transition
      show={isOpen} as={Fragment}
      enter="transition-transform duration-300 ease-out" enterFrom="translate-x-full" enterTo="translate-x-0"
      leave="transition-transform duration-300 ease-in" leaveFrom="translate-x-0" leaveTo="translate-x-full"
    >
      <div className={`fixed bottom-5 right-5 z-[100] rounded-lg shadow-xl ${severities[severity]?.bg || 'bg-gray-800'}`}>
        <div className="flex items-center gap-3 px-4 py-3 text-white">
          {severities[severity]?.icon}
          <p className='text-sm font-medium'>{message}</p>
          <button onClick={onClose} className="ml-2 rounded-full p-1 hover:bg-white/20">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Transition>
  );
};


const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showFormDialog, setShowFormDialog] = useState(false);
  const [currentEditingCategory, setCurrentEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("");
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


  // --- Fetch Categories ---
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const responseData = await apiService.getAllCategories();

      const fetchedCategories = Array.isArray(responseData) ? responseData : responseData.categories || [];

      setCategories(fetchedCategories.map(cat => ({
        id: cat.id || cat._id,
        title: cat.title,
        slug: cat.slug
      })));
    } catch (error) {
      setSnackbar({ open: true, message: `Error loading categories: ${error.response?.data?.message || error.message}`, severity: 'error' });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- Form Handlers ---
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.title.trim()) errors.title = "Category title is required.";
    // Removed description validation: if (!data.description.trim()) errors.description = "Description is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) {
      setSnackbar({ open: true, message: "Please correct the errors in the form.", severity: "warning" });
      return;
    }

    setLoading(true);
    try {
      if (currentEditingCategory) {
        await apiService.updateCategory(currentEditingCategory.id, formData);
        setSnackbar({ open: true, message: "Category updated successfully!", severity: "success" });
      } else {
        await apiService.createCategory(formData);
        setSnackbar({ open: true, message: "Category added successfully!", severity: "success" });
      }
      fetchCategories();
      handleCloseFormDialog();
    } catch (error) {
      setSnackbar({ open: true, message: `Error saving category: ${error.response?.data?.message || error.message}`, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- Dialog/Form Open/Close Handlers ---
  const handleOpenFormDialog = (category = null) => {
    if (category) {
      setCurrentEditingCategory(category);
      setFormData({
        title: category.title
      });
    } else {
      setCurrentEditingCategory(null);
      setFormData({ title: "" }); // Only title reset
    }
    setFormErrors({});
    setShowFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setShowFormDialog(false);
    setTimeout(() => {
      setCurrentEditingCategory(null);
      setFormData({ title: "" }); // Only title reset
      setFormErrors({});
    }, 200);
  };


  // --- Delete Confirmation Dialog Handlers ---
  const handleDeleteCategoryAttempt = (id) => {
    setCategoryToDeleteId(id);
    setDialogMessage("Are you sure you want to delete this category? This action cannot be undone.");
    setDialogType("confirm");
    setShowConfirmDialog(true);
  };

  const handleDeleteCategoryConfirmed = async () => {
    if (!categoryToDeleteId) return;
    setLoading(true);
    try {
      await apiService.deleteCategory(categoryToDeleteId);
      setSnackbar({ open: true, message: "Category deleted successfully!", severity: "info" });
      fetchCategories();
      closeCustomDialog();
    } catch (error) {
      setSnackbar({ open: true, message: `Error deleting category: ${error.response?.data?.message || error.message}`, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const closeCustomDialog = () => {
    setShowConfirmDialog(false);
    setDialogMessage("");
    setDialogType("");
    setCategoryToDeleteId(null);
  };

  // --- Loading State Display ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <LoadingSpinner className="text-red-700" size={48} />
        <p className="ml-4 text-gray-600">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6 bg-white rounded-xl shadow-lg font-sans max-w-7xl mx-auto"> {/* Added max-w-7xl and mx-auto */}
      {/* Custom Confirmation/Notification Dialog Component */}
      {showConfirmDialog && (
        <Transition appear show={showConfirmDialog} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeCustomDialog}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className={`p-4 flex items-center gap-4 rounded-xl ${dialogType === 'success' ? 'bg-green-100 text-green-800' : dialogType === 'error' ? 'bg-red-100 text-red-800' : dialogType === 'info' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {dialogType === 'success' && <CheckCircleIcon className="h-6 w-6" />}
                      {dialogType === 'error' && <XMarkIcon className="h-6 w-6" />}
                      {dialogType === 'info' && <InformationCircleIcon className="h-6 w-6" />}
                      {dialogType === 'confirm' && <ExclamationTriangleIcon className="h-6 w-6" />}
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6">
                        {dialogType === 'confirm' ? "Confirm Action" : "Notification"}
                      </Dialog.Title>
                      <button onClick={closeCustomDialog} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-4 p-2 text-gray-700">
                      <p className="mb-4">{dialogMessage}</p>
                      {dialogType === 'confirm' && (
                        <div className="flex justify-end space-x-3">
                          <Button variant="secondary" onClick={closeCustomDialog}>Cancel</Button>
                          <Button variant="danger" onClick={handleDeleteCategoryConfirmed}>Confirm</Button>
                        </div>
                      )}
                      {dialogType !== 'confirm' && (
                        <div className="flex justify-end">
                          <Button variant="primary" onClick={closeCustomDialog}>OK</Button>
                        </div>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {/* Header and Add New Category Button */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Product Categories</h1>
        <Button onClick={() => handleOpenFormDialog()}>
          <PlusIcon className="mr-2 text-lg h-5 w-5" />
          Add New
        </Button>
      </div>

      {/* Add/Edit Category Form Dialog */}
      <Transition appear show={showFormDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseFormDialog}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all my-8">
                  <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 border-b pb-3 mb-4">
                    {currentEditingCategory ? "Edit Category" : "Add New Category"}
                  </Dialog.Title>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    {/* Title Input */}
                    <InputField
                      label="Category Title"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      error={formErrors.title}
                      required
                    />

                    {/* Form Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button type="button" variant="secondary" onClick={handleCloseFormDialog} disabled={loading}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? (
                          <>
                            <LoadingSpinner size={16} color="inherit" className="mr-2" />
                            Saving...
                          </>
                        ) : currentEditingCategory ? "Update" : "Add"}
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Categories List Table */}
      {categories.length === 0 && !loading ? (
        <p className="text-gray-600 text-center py-8">No categories found.</p>
      ) : (
        <Card>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  {/* Description column header -- REMOVED */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  {/* Category Image column header (if enabled) */}
                  {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th> */}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{category.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleOpenFormDialog(category)}
                        className="text-red-700 hover:text-red-800 transition-colors mr-3"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategoryAttempt(category.id)}
                        className="text-red-700 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Toast
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
      />
    </div>
  );
};

export default Categories;