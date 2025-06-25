import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress } from '@mui/material';
import { Dialog, Transition } from '@headlessui/react';
import {
  PlusIcon, PhotoIcon, XMarkIcon, ExclamationTriangleIcon,
  CheckCircleIcon, InformationCircleIcon, TrashIcon, PencilSquareIcon,
} from '@heroicons/react/24/outline';
import apiService from '../../service/apiService';


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

const ImagePreview = ({ src, onDelete }) => (
  <div className="relative group h-28 w-28 flex-shrink-0 rounded-lg overflow-hidden border border-gray-300">
    <img src={src} alt="preview" className="h-full w-full object-cover" />
    <button
      type="button"
      onClick={onDelete}
      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
    >
      <XMarkIcon className="h-4 w-4" />
    </button>
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


// ====== 3. MAIN PAGE COMPONENT ======

const Products = () => {
  // --- STATE MANAGEMENT ---
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState(new Map());
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUploadError, setImageUploadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // --- CONSTANTS & CONFIG ---
  const REQUIRED_FIELDS = ['title', 'price', 'category', 'brand', 'stock', 'sku', 'description'];
  const DEFAULT_FORM_STATE = {
    title: '', price: '', category: '', brand: '', stock: '',
    sku: '', description: '', tags: '', discountPercentage: '',
    weight: '', width: '', height: '', depth: '',
    warrantyInformation: '', shippingInformation: '',
    availabilityStatus: 'In Stock', returnPolicy: '',
    minimumOrderQuantity: '1', barcode: ''
  };

  // --- LOGIC HANDLERS ---

  // Fetches categories and builds a map for ID-to-Title lookup
  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiService.getAllCategories();
      const fetchedCategories = Array.isArray(response) ? response : response.categories || [];

      setCategories(fetchedCategories.map(cat => ({
        id: cat.id || cat._id,
        title: cat.title,
        slug: cat.slug,
        description: cat.description
      })));

      const newCategoryMap = new Map();
      fetchedCategories.forEach(cat => {
        const categoryId = cat.id || cat._id;
        if (categoryId) {
          newCategoryMap.set(categoryId, cat.title);
        }
      });
      setCategoryMap(newCategoryMap);

    } catch (error) {
      console.error('Error fetching categories for form:', error.response?.data?.message || error.message);
      setSnackbar({ open: true, message: `Error fetching categories: ${error.response?.data?.message || error.message}`, severity: 'error' });
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllProducts();
      const productsArray = response.data.products || [];

      setRows(productsArray.map((product, index) => {
        const id = product._id || `${product.sku || 'no-sku'}-${index}-${Math.random().toString(36).substr(2, 9)}`;

        let resolvedCategoryName = 'N/A';
        if (product.category) {
          if (typeof product.category === 'object' && product.category.title) {
            resolvedCategoryName = product.category.title;
          } else if (typeof product.category === 'string') {
            resolvedCategoryName = categoryMap.get(product.category) || product.category;
          }
        }

        return {
          ...product,
          id: id,
          categoryName: resolvedCategoryName
        };
      }));
    } catch (error) {
      setSnackbar({ open: true, message: `Error fetching products: ${error.response?.data?.message || error.message}`, severity: 'error' });
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [categoryMap]);


  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (categories.length > 0 || categoryMap.size === 0) {
      fetchProducts();
    }
  }, [fetchProducts, categories.length, categoryMap.size]);


  const validateForm = () => {
    const newErrors = {};
    REQUIRED_FIELDS.forEach(field => {
      if (!form[field] || String(form[field]).trim() === '') {
        newErrors[field] = `This field is required.`;
      }
    });

    const numberFields = ['price', 'stock', 'discountPercentage', 'weight', 'width', 'height', 'depth', 'minimumOrderQuantity'];
    numberFields.forEach(field => {
      const value = parseFloat(form[field]);
      if (form[field] !== '' && (isNaN(value) || value < 0)) {
        newErrors[field] = `Must be a valid non-negative number.`;
      }
      if (field === 'price' && (isNaN(value) || value <= 0)) {
        newErrors[field] = `Price must be a positive number.`;
      }
      if (field === 'stock' && (isNaN(value) || !Number.isInteger(value) || value < 0)) {
        newErrors[field] = `Stock must be a non-negative integer.`;
      }
      if (field === 'minimumOrderQuantity' && (isNaN(value) || !Number.isInteger(value) || value < 1)) {
        newErrors[field] = `Minimum order quantity must be a positive integer.`;
      }
      if (field === 'discountPercentage' && (isNaN(value) || value < 0 || value > 100)) {
        newErrors[field] = `Discount must be between 0 and 100.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpen = (row = null) => {
    if (row) {
      setEditRow(row);
      setForm({
        title: row.title || '',
        price: row.price || '',
        brand: row.brand || '',
        sku: row.sku || '',
        stock: row.stock || '',
        description: row.description || '',
        category: row.category?._id || row.category?.id || row.category || '',
        tags: row.tags?.join(', ') || '',
        discountPercentage: row.discountPercentage || '',
        weight: row.weight || '',

        width: row.dimensions?.width || '',
        height: row.dimensions?.height || '',
        depth: row.dimensions?.depth || '',

        warrantyInformation: row.warrantyInformation || '',
        shippingInformation: row.shippingInformation || '',
        availabilityStatus: row.availabilityStatus || 'In Stock',
        returnPolicy: row.returnPolicy || '',
        minimumOrderQuantity: row.minimumOrderQuantity || '1',

        barcode: row.meta?.barcode || ''
      });
      setThumbnailUrl(row.thumbnail || '');
      setImageUrls(row.images || []);
    } else {
      setEditRow(null);
      setForm(DEFAULT_FORM_STATE);
      setThumbnailUrl('');
      setImageUrls([]);
    }

    setThumbnailFile(null);
    setImageFiles([]);
    setImageUploadError('');
    setErrors({});

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setEditRow(null);
      setForm(DEFAULT_FORM_STATE);
      setErrors({});
      setThumbnailFile(null);
      setImageFiles([]);
      setThumbnailUrl('');
      setImageUrls([]);
      setImageUploadError('');
    }, 200);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const currentTotalImages = imageUrls.length + imageFiles.length + (thumbnailUrl ? 1 : 0);
      if (currentTotalImages >= 10 && !thumbnailUrl) {
        setImageUploadError('You cannot add more than 10 images (including thumbnail).');
        e.target.value = null;
        setThumbnailFile(null);
        return;
      }
      setImageUploadError('');
      setThumbnailFile(file);
    } else {
      setThumbnailFile(null);
    }
  };

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const currentTotalImages = imageUrls.length + imageFiles.length + (thumbnailFile || thumbnailUrl ? 1 : 0);
    if (currentTotalImages + selectedFiles.length > 10) {
      setImageUploadError(`A maximum of 10 images are allowed per product.`);
      e.target.value = null;
      return;
    }
    setImageUploadError('');
    setImageFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please fill in all required fields and correct errors.', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      let finalThumbnailUrl = thumbnailUrl;
      let finalImageUrls = [...imageUrls];

      const filesToUpload = [];
      let newThumbnailFileIndex = -1;

      if (thumbnailFile) {
        filesToUpload.push(thumbnailFile);
        newThumbnailFileIndex = 0;
      }
      filesToUpload.push(...imageFiles);

      if (filesToUpload.length > 0) {
        const formData = new FormData();
        filesToUpload.forEach(file => formData.append('images', file));
        const uploadedUrls = await apiService.uploadImages(formData);

        let uploadedIndex = 0;
        if (newThumbnailFileIndex !== -1 && uploadedUrls[uploadedIndex]) {
          finalThumbnailUrl = uploadedUrls[uploadedIndex];
          uploadedIndex++;
        }

        for (let i = uploadedIndex; i < uploadedUrls.length; i++) {
          finalImageUrls.push(uploadedUrls[i]);
        }
      }

      let categoryValueForBackend = form.category;
      const selectedCategoryObject = categories.find(cat => (cat.id || cat._id) === form.category);
      if (selectedCategoryObject && selectedCategoryObject.title) {
        categoryValueForBackend = selectedCategoryObject.title;
      } else {
        console.warn("Category title not found for ID:", form.category, "Categories state might be empty or invalid.");
      }


      const productData = {
        ...form,
        category: categoryValueForBackend,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock, 10) || 0,
        discountPercentage: parseFloat(form.discountPercentage) || 0,
        weight: parseFloat(form.weight) || 0,
        minimumOrderQuantity: parseInt(form.minimumOrderQuantity, 10) || 1,

        dimensions: {
          width: parseFloat(form.width) || 0,
          height: parseFloat(form.height) || 0,
          depth: parseFloat(form.depth) || 0
        },
        meta: {
          barcode: form.barcode
        },
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        thumbnail: finalThumbnailUrl, // Use the processed thumbnail URL
        images: finalImageUrls,       // Use the processed image URLs
      };

      const action = editRow ? 'updated' : 'created';
      if (editRow) {
        await apiService.updateProduct(editRow.id, productData);
      } else {
        await apiService.createProduct(productData);
      }

      setSnackbar({ open: true, message: `Sản phẩm đã được ${action} thành công!`, severity: 'success' });
      fetchProducts();
      handleClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      setSnackbar({ open: true, message: `Error: ${errorMessage}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (urlToDelete, isNewFile) => {
    if (isNewFile) {
      setImageFiles(prev => prev.filter(file => URL.createObjectURL(file) !== urlToDelete));
      setImageUploadError('');
      return;
    }

    if (urlToDelete === thumbnailUrl) {
      setThumbnailUrl('');
      setSnackbar({ open: true, message: "Thumbnail marked for deletion. Save product to apply changes.", severity: 'info' });
      const currentTotalImages = imageUrls.length + imageFiles.length;
      if (currentTotalImages < 10) {
        setImageUploadError('');
      }
      return;
    }

    setLoading(true);
    try {
      const publicId = urlToDelete.split('/').pop().split('.')[0];
      await apiService.deleteImage(publicId);

      const newImageUrls = imageUrls.filter(url => url !== urlToDelete);
      setImageUrls(newImageUrls);

      if (editRow) {
        await apiService.updateProduct(editRow.id, { images: newImageUrls });
        setEditRow(prev => ({ ...prev, images: newImageUrls }));
      }

      setSnackbar({ open: true, message: "Image deleted successfully.", severity: 'info' });
      const currentTotalImages = newImageUrls.length + imageFiles.length + (thumbnailFile || thumbnailUrl ? 1 : 0);
      if (currentTotalImages < 10) {
        setImageUploadError('');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting image';
      setSnackbar({ open: true, message: `Error: ${errorMessage}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    setLoading(true);
    try {
      await apiService.deleteProduct(id);
      setSnackbar({ open: true, message: "Sản phẩm đã được xóa thành công", severity: 'success' });
      fetchProducts();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting product';
      setSnackbar({ open: true, message: `Error: ${errorMessage}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  const columns = [
    {
      field: 'thumbnail',
      headerName: 'Image',
      width: 90,
      renderCell: ({ value }) => value && (
        <div className="p-1">
          <img
            src={value}
            alt="thumb"
            className="h-12 w-12 rounded-lg object-cover border border-gray-200"
          />
        </div>
      ),
      headerClassName: 'font-bold'
    },
    {
      field: 'title',
      headerName: 'Product Name',
      flex: 1,
      headerClassName: 'font-bold'
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
      type: 'number',
      renderCell: ({ value }) => value ? (
        <span className="font-medium">
          {value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </span>
      ) : '',
      headerClassName: 'font-bold'
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
      renderCell: ({ value }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value > 50 ? 'bg-green-100 text-green-800' :
          value > 10 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
          {value}
        </span>
      ),
      headerClassName: 'font-bold'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      headerClassName: 'font-bold',
      renderCell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpen(row)}
            className="flex items-center justify-center p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            title="Edit Product"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteProduct(row.id)}
            className="flex items-center justify-center p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors"
            title="Delete Product"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    },
  ];

  return (
    // Centering the content using max-w-7xl and mx-auto
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto"> {/* Added max-w-7xl and mx-auto here */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600 mt-1">Tổng cộng {rows.length} sản phẩm.</p>
          </div>
          <Button onClick={() => handleOpen()}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>

        <Card>
          <div className="h-[600px] w-full">
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.id}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              sx={{
                border: 'none',
                fontFamily: 'inherit',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  fontWeight: 600
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f3f4f6',
                  fontSize: '0.875rem'
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid #e5e7eb',
                  fontSize: '0.875rem'
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f9fafb'
                },
                '& .MuiDataGrid-overlay': {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)'
                }
              }}
              slots={{
                loadingOverlay: () => (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                    <CircularProgress color="inherit" />
                  </div>
                ),
              }}
            />
          </div>
        </Card>

        <Transition appear show={open} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={handleClose}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-60" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-start justify-center p-4">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gray-50 text-left align-middle shadow-xl transition-all my-8">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                            {editRow ? `Chỉnh sửa sản phẩm: ${form.title || ''}` : 'Thêm sản phẩm mới'}
                          </Dialog.Title>
                          <button
                            type="button"
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* General Information */}
                        <InputField
                          key="title"
                          label="Product Name"
                          name="title"
                          value={form.title || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
                            setForm(p => ({ ...p, title: val }));
                          }}
                          error={errors.title}
                          required
                          fullWidth
                        />
                        <InputField
                          key="description"
                          label="Description"
                          name="description"
                          value={form.description || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
                            setForm(p => ({ ...p, description: val }));
                          }}
                          error={errors.description}
                          required
                          as="textarea"
                          rows={4}
                          fullWidth
                        />
                        <InputField
                          key="price"
                          label="Price"
                          name="price"
                          type="number"
                          value={form.price || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.price) setErrors(prev => ({ ...prev, price: undefined }));
                            setForm(p => ({ ...p, price: val }));
                          }}
                          error={errors.price}
                          required
                        />
                        <InputField
                          key="category"
                          label="Category"
                          name="category"
                          as="select"
                          value={form.category || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.category) setErrors(prev => ({ ...prev, category: undefined }));
                            setForm(p => ({ ...p, category: val }));
                          }}
                          error={errors.category}
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.title}
                            </option>
                          ))}
                        </InputField>

                        {/* Details */}
                        <InputField
                          key="brand"
                          label="Brand"
                          name="brand"
                          value={form.brand || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.brand) setErrors(prev => ({ ...prev, brand: undefined }));
                            setForm(p => ({ ...p, brand: val }));
                          }}
                          error={errors.brand}
                          required
                        />
                        <InputField
                          key="tags"
                          label="Tags (comma-separated)"
                          name="tags"
                          value={form.tags || ''}
                          onChange={(e) => setForm(p => ({ ...p, tags: e.target.value }))}
                          fullWidth
                        />
                        <InputField
                          key="discountPercentage"
                          label="Discount (%)"
                          name="discountPercentage"
                          type="number"
                          value={form.discountPercentage || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.discountPercentage) setErrors(prev => ({ ...prev, discountPercentage: undefined }));
                            setForm(p => ({ ...p, discountPercentage: val }));
                          }}
                          error={errors.discountPercentage}
                        />
                        <InputField
                          key="weight"
                          label="Weight (kg)"
                          name="weight"
                          type="number"
                          value={form.weight || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.weight) setErrors(prev => ({ ...prev, weight: undefined }));
                            setForm(p => ({ ...p, weight: val }));
                          }}
                          error={errors.weight}
                        />
                        <InputField
                          key="width"
                          label="Width (cm)"
                          name="width"
                          type="number"
                          value={form.width || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.width) setErrors(prev => ({ ...prev, width: undefined }));
                            setForm(p => ({ ...p, width: val }));
                          }}
                          error={errors.width}
                        />
                        <InputField
                          key="height"
                          label="Height (cm)"
                          name="height"
                          type="number"
                          value={form.height || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.height) setErrors(prev => ({ ...prev, height: undefined }));
                            setForm(p => ({ ...p, height: val }));
                          }}
                          error={errors.height}
                        />
                        <InputField
                          key="depth"
                          label="Depth (cm)"
                          name="depth"
                          type="number"
                          value={form.depth || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.depth) setErrors(prev => ({ ...prev, depth: undefined }));
                            setForm(p => ({ ...p, depth: val }));
                          }}
                          error={errors.depth}
                        />

                        {/* Inventory */}
                        <InputField
                          key="stock"
                          label="Stock Quantity"
                          name="stock"
                          type="number"
                          value={form.stock || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.stock) setErrors(prev => ({ ...prev, stock: undefined }));
                            setForm(p => ({ ...p, stock: val }));
                          }}
                          error={errors.stock}
                          required
                        />
                        <InputField
                          key="sku"
                          label="SKU (Stock Keeping Unit)"
                          name="sku"
                          value={form.sku || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.sku) setErrors(prev => ({ ...prev, sku: undefined }));
                            setForm(p => ({ ...p, sku: val }));
                          }}
                          error={errors.sku}
                          required
                        />
                        <InputField
                          key="warrantyInformation"
                          label="Warranty Information"
                          name="warrantyInformation"
                          as="textarea"
                          rows={2}
                          value={form.warrantyInformation || ''}
                          onChange={(e) => setForm(p => ({ ...p, warrantyInformation: e.target.value }))}
                          fullWidth
                        />
                        <InputField
                          key="shippingInformation"
                          label="Shipping Information"
                          name="shippingInformation"
                          as="textarea"
                          rows={2}
                          value={form.shippingInformation || ''}
                          onChange={(e) => setForm(p => ({ ...p, shippingInformation: e.target.value }))}
                          fullWidth
                        />
                        <InputField
                          key="returnPolicy"
                          label="Return Policy"
                          name="returnPolicy"
                          as="textarea"
                          rows={2}
                          value={form.returnPolicy || ''}
                          onChange={(e) => setForm(p => ({ ...p, returnPolicy: e.target.value }))}
                          fullWidth
                        />
                        <InputField
                          key="minimumOrderQuantity"
                          label="Minimum Order Qty"
                          name="minimumOrderQuantity"
                          type="number"
                          value={form.minimumOrderQuantity || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (errors.minimumOrderQuantity) setErrors(prev => ({ ...prev, minimumOrderQuantity: undefined }));
                            setForm(p => ({ ...p, minimumOrderQuantity: val }));
                          }}
                          error={errors.minimumOrderQuantity}
                        />
                        <InputField
                          key="barcode"
                          label="Barcode (UPC, EAN, etc.)"
                          name="barcode"
                          value={form.barcode || ''}
                          onChange={(e) => setForm(p => ({ ...p, barcode: e.target.value }))}
                        />

                        {/* Availability Status (Radio Buttons) */}
                        <div className="sm:col-span-2 mt-2">
                          <label className="block text-sm font-medium text-gray-900 mb-1.5">
                            Trạng thái khả dụng
                          </label>
                          <div className="flex gap-4">
                            {['In Stock', 'Out of Stock', 'Pre-Order'].map(status => (
                              <label key={status} className="flex items-center">
                                <input
                                  type="radio"
                                  name="availabilityStatus"
                                  checked={form.availabilityStatus === status}
                                  onChange={() => setForm(p => ({ ...p, availabilityStatus: status }))}
                                  className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">{status}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="sm:col-span-2 pt-4 border-t border-gray-200 mt-4">
                          <h4 className="text-lg font-bold text-gray-900 mb-4">Hình ảnh sản phẩm</h4>
                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">Hình thu nhỏ (Thumbnail)*</label>
                              <div className="flex flex-col sm:flex-row items-start gap-4">
                                {thumbnailFile ? (
                                  <ImagePreview
                                    src={URL.createObjectURL(thumbnailFile)}
                                    onDelete={() => setThumbnailFile(null)}
                                  />
                                ) : thumbnailUrl ? (
                                  <ImagePreview
                                    src={thumbnailUrl}
                                    onDelete={() => setThumbnailUrl('')}
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-28 w-28 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
                                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-gray-900 mb-1">Chọn một hình thu nhỏ</label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                    disabled={(imageUrls.length + imageFiles.length + (thumbnailUrl ? 1 : 0)) >= 10 && !thumbnailUrl}
                                  />
                                  <p className="mt-1 text-xs text-gray-500">JPG, PNG hoặc GIF. Kích thước tối đa 5MB. (Tổng số ảnh tối đa 10 bao gồm các ảnh khác)</p>
                                  {errors.thumbnail && <p className="mt-1.5 text-sm text-red-600">{errors.thumbnail}</p>}
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">Ảnh bổ sung</label>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImagesChange}
                                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                disabled={(imageUrls.length + imageFiles.length + (thumbnailFile || thumbnailUrl ? 1 : 0)) >= 10}
                              />
                              {imageUploadError && (
                                <p className="mt-2 text-sm text-red-600">{imageUploadError}</p>
                              )}
                              <p className="mt-1 text-xs text-gray-500">Tổng cộng tối đa 10 ảnh (bao gồm hình thu nhỏ). Tối đa 5MB mỗi ảnh.</p>
                              {errors.images && <p className="mt-1.5 text-sm text-red-600">{errors.images}</p>}
                              {(imageUrls.length > 0 || imageFiles.length > 0) && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Ảnh đã tải lên</h4>
                                  <div className="flex flex-wrap gap-3">
                                    {imageUrls.map(url => (
                                      <ImagePreview
                                        key={url}
                                        src={url}
                                        onDelete={() => handleDeleteImage(url, false)}
                                      />
                                    ))}
                                    {imageFiles.map(file => (
                                      <ImagePreview
                                        key={file.name}
                                        src={URL.createObjectURL(file)}
                                        onDelete={() => handleDeleteImage(URL.createObjectURL(file), true)}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div> {/* End of grid layout for form fields */}

                      <div className="flex items-center justify-end gap-3 p-6 pt-4 bg-white border-t border-gray-200">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleClose}
                          disabled={loading}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading || !!imageUploadError}
                        >
                          {loading ? (
                            <>
                              <CircularProgress size={16} color="inherit" className="mr-2" />
                              Đang lưu...
                            </>
                          ) : editRow ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
                        </Button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Toast
          isOpen={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar(p => ({ ...p, open: false }))}
        />
      </div>
    </div>
  );
};

export default Products;