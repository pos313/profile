import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Camera, Upload, Check, RefreshCw } from 'lucide-react';
import { isImageFile, createFilePreview, revokeFilePreview } from '../lib/utils';

const Profile = () => {
  const { currentUser, updateUserData } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  
  // Effect to clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        revokeFilePreview(avatarPreview);
      }
    };
  }, [avatarPreview]);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!isImageFile(file)) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please select an image file (JPEG, PNG, GIF, WEBP).',
      });
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Image must be less than 5MB in size.',
      });
      return;
    }
    
    // Create preview and store file for upload
    const previewUrl = createFilePreview(file);
    setAvatarPreview(previewUrl);
    setUploadedFile(file);
    setUploadProgress(false);
  };
  
  // Trigger file input click
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  // Handle avatar upload
  const handleUploadAvatar = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    setUploadProgress(true);
    
    try {
      const response = await api.profile.uploadAvatar(uploadedFile);
      
      // Update user data with new avatar URL
      if (response && response.url) {
        updateUserData({ avatar: response.url });
        
        toast({
          title: 'Avatar updated',
          description: 'Your profile picture has been updated successfully.',
        });
        
        // Clear the uploaded file state but keep the preview
        setUploadedFile(null);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message || 'Failed to upload avatar. Please try again.',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(false);
    }
  };
  
  // Cancel upload and reset state
  const handleCancelUpload = () => {
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      revokeFilePreview(avatarPreview);
    }
    setAvatarPreview(null);
    setUploadedFile(null);
    setUploadProgress(false);
    fileInputRef.current.value = '';
  };
  
  // If not authenticated, show login prompt
  if (!currentUser) {
    return (
      <div className="page-container">
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md text-red-800 dark:text-red-200">
          You must be logged in to view this page.
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="flex flex-col items-center">
          {/* Avatar display */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-md">
              <img 
                src={avatarPreview || currentUser.avatar || 'https://via.placeholder.com/150?text=User'} 
                alt={currentUser.name || 'User avatar'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150?text=User';
                }}
              />
              
              {/* Loading spinner when uploading */}
              {uploadProgress && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <RefreshCw className="h-8 w-8 text-white animate-spin" />
                </div>
              )}
            </div>
            
            {/* Camera icon for mobile devices */}
            <button 
              onClick={handleSelectFile}
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm"
              disabled={isUploading}
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            disabled={isUploading}
          />
          
          {/* User info */}
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
            {currentUser.name || 'User'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {currentUser.email || 'user@example.com'}
          </p>
          
          {/* Upload controls */}
          <div className="w-full space-y-4">
            {!uploadedFile ? (
              <Button 
                onClick={handleSelectFile} 
                className="w-full"
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Photo
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button 
                  onClick={handleUploadAvatar} 
                  className="flex-1"
                  disabled={isUploading}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {isUploading ? 'Uploading...' : 'Save Avatar'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleCancelUpload}
                  className="flex-1"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            )}
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Upload Tips</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc pl-5">
                <li>Max file size: 5MB</li>
                <li>Supported formats: JPEG, PNG, GIF, WEBP</li>
                <li>Square images work best</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;