import React, { useState, useRef } from "react";
import { MdClose, MdAddAPhoto } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

const EditProfileModal = ({ user, onClose }) => {
  // State for the form fields, initialized with the current user's data.
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [profileImg, setProfileImg] = useState(null);
  const [bannerImg, setBannerImg] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState(
    user.profileImg || ""
  );
  const [bannerImgPreview, setBannerImgPreview] = useState(
    user.bannerImg || ""
  );
  const [isUploading, setIsUploading] = useState(false);

  const profileImgRef = useRef(null);
  const bannerImgRef = useRef(null);
  const dispatch = useDispatch();

  // Handler for when a new profile image is selected
  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setProfileImgPreview(URL.createObjectURL(file));
    }
  };

  // Handler for when a new banner image is selected
  const handleBannerImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImg(file);
      setBannerImgPreview(URL.createObjectURL(file));
    }
  };

  // Handler for submitting the form
  const submitHandler = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (profileImg) formData.append("profileImg", profileImg);
    if (bannerImg) formData.append("bannerImg", bannerImg);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/user/profile/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      // Update the user data in the Redux store for an instant UI refresh.
      dispatch(setUser(res.data.user));
      toast.success(res.data.message);
      onClose(); // Close the modal on success.
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-black w-full max-w-lg rounded-2xl border border-neutral-800 animate-pop-in text-white">
        {/* --- Modal Header --- */}
        <div className="flex items-center justify-between p-3 border-b border-neutral-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
            >
              <MdClose size="22px" />
            </button>
            <h2 className="text-xl font-bold">Edit Profile</h2>
          </div>
          <button
            onClick={submitHandler}
            disabled={isUploading}
            className="px-4 py-1.5 text-sm font-bold text-black cursor-pointer bg-white rounded-full hover:bg-neutral-300 disabled:opacity-50 transition-colors duration-200"
          >
            {isUploading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* --- Modal Body --- */}
        <div className="overflow-y-auto max-h-[85vh]">
          {/* Banner and Profile Image Section */}
          <div className="relative">
            {/* Banner Image */}
            <div className="relative bg-neutral-800 h-48">
              {bannerImgPreview && (
                <img
                  src={bannerImgPreview}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              )}
              {/* Visible Upload Button for Banner */}
              <button
                onClick={() => bannerImgRef.current.click()}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30  cursor-pointer hover:bg-opacity-40 transition-colors"
                aria-label="Change banner image"
              >
                <MdAddAPhoto size={45} className="text-white hover:bg-neutral-800 transition-colors duration-200 rounded-full p-2" />
              </button>
              <input
                type="file"
                ref={bannerImgRef}
                onChange={handleBannerImgChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* Profile Image */}
            <div className="absolute top-[130px] left-4">
              <div className="relative w-32 h-32 rounded-full border-4 border-black">
                <img
                  src={
                    profileImgPreview ||
                    "https://placehold.co/128x128/1a202c/FFFFFF?text=Add"
                  }
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full bg-neutral-700"
                />
                {/* Visible Upload Button for Profile */}
                <button
                  onClick={() => profileImgRef.current.click()}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors rounded-full"
                  aria-label="Change profile image"
                >
                  <MdAddAPhoto size={45} className="text-white  hover:bg-neutral-800 transition-colors duration-200 rounded-full p-2" />
                </button>
                <input
                  type="file"
                  ref={profileImgRef}
                  onChange={handleProfileImgChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* Form Fields - Added margin top to not overlap with avatar */}
          <div className="p-4 mt-16 flex flex-col space-y-6">
            {/* Floating Label Input for Name */}
            <div className="relative">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer w-full p-3 pt-6 bg-transparent border border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-sky-500 transition"
                placeholder=" " /* Placeholder is needed for the peer selector */
              />
              <label
                htmlFor="name"
                className="absolute text-md text-neutral-500 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
              >
                Name
              </label>
            </div>

            {/* Floating Label Textarea for Bio */}
            <div className="relative">
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="peer w-full p-3 pt-6 bg-transparent border border-neutral-700 rounded-md resize-none outline-none focus:ring-2 focus:ring-sky-500 transition"
                rows="3"
                placeholder=" " /* Placeholder is needed for the peer selector */
              />
              <label
                htmlFor="bio"
                className="absolute text-md text-neutral-500 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
              >
                Bio
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
