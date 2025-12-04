import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useCurrentUser from "../../hooks/useCurrentUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { getAuth, updateProfile } from "firebase/auth";
import PageTitle from "../../components/PageTitle";
import Loader from "../../components/Loader";
import QRCode from "react-qr-code";

export default function Profile() {
  const { currentUser, loading } = useCurrentUser();
  const { user: authUser, setUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    district: "",
    upazila: "",
    bloodGroup: "",
    availabilityStatus: "available",
    lastDonationDate: "",
    preferredRadius: 10,
    hemoglobinLevel: "",
    healthNotes: "",
    reminderEmail: true,
    reminderSMS: false,
  });
  const [healthFlags, setHealthFlags] = useState([]);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const base = currentUser || authUser;
    if (base) {
      setFormData({
        name: base.name || base.displayName || "",
        email: base.email || "",
        image: base.image || base.photoURL || "",
        district: base.district || "",
        upazila: base.upazila || "",
        bloodGroup: base.bloodGroup || "",
        availabilityStatus: base.availabilityStatus || "available",
        lastDonationDate: base.lastDonationDate || "",
        preferredRadius: base.preferredRadius || 10,
        hemoglobinLevel: base.healthAssessment?.hemoglobinLevel || "",
        healthNotes: base.healthAssessment?.notes || "",
        reminderEmail: base.reminderPreferences?.email ?? true,
        reminderSMS: base.reminderPreferences?.sms ?? false,
      });
      setHealthFlags(base.healthAssessment?.flags || []);
      setImagePreview(base.image || base.photoURL || "");
    }
  }, [currentUser, authUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData((prev) => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    if (!currentUser?._id) {
      toast.error("User data not loaded. Please refresh the page.");
      return;
    }

    try {
      const res = await axiosSecure.patch(
        `/update-user/${currentUser._id}`,
        {
          ...formData,
          preferredRadius: Number(formData.preferredRadius),
          healthAssessment: {
            hemoglobinLevel: formData.hemoglobinLevel,
            notes: formData.healthNotes,
            flags: healthFlags,
            lastUpdated: new Date().toISOString(),
          },
          reminderPreferences: {
            email: formData.reminderEmail,
            sms: formData.reminderSMS,
          },
        }
      );

      await updateProfile(auth.currentUser, {
        displayName: formData.name,
        photoURL: formData.image,
      });

      await auth.currentUser.reload();
      setUser(auth.currentUser);

      if (res.data.modifiedCount > 0) {
        toast.success("Profile updated successfully");
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const healthChecklist = [
    { label: "No chronic illness", value: "no-chronic" },
    { label: "No recent surgery", value: "no-surgery" },
    { label: "Hemoglobin within range", value: "hb-stable" },
    { label: "Blood pressure normal", value: "bp-stable" },
  ];

  const toggleFlag = (value) => {
    setHealthFlags((prev) =>
      prev.includes(value) ? prev.filter((flag) => flag !== value) : [...prev, value]
    );
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("donor-qr");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = function handleImg() {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
      const png = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = png;
      link.download = "bloodbridge-donor-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = url;
  };

  if (loading && !currentUser) {
    return <Loader label="Loading profile..." full={true} />;
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <PageTitle title={"Profile"} />

      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
          My Profile
        </h2>

        {/* Profile Card with Two Columns */}
        <div className="glass p-8 rounded-2xl shadow-2xl">
          {/* Edit Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                editMode
                  ? "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
                  : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white"
              }`}
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Profile Image and Basic Info */}
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="text-center bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-6">
                <div className="relative inline-block">
                  <img
                    src={imagePreview || formData.image || "https://via.placeholder.com/160?text=No+Image"}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl mx-auto mb-4"
                  />
                  <div className="absolute bottom-4 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  {editMode && (
                    <label className="absolute bottom-0 left-1/2 transform -translate-x-1/2 cursor-pointer bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors shadow-lg">
                      📷 Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                  {formData.name}
                </h3>
                <p className="text-sm text-slate-600">{formData.email}</p>
              </div>

              {/* Quick Stats */}
              <div className="border-2 border-rose-200 rounded-2xl p-6 bg-white shadow-lg space-y-4">
                <h4 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-4">
                  Profile Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                    <span className="font-semibold text-slate-700">
                      Blood Group:
                    </span>
                    <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full font-bold">
                      {formData.bloodGroup || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">
                      Location:
                    </span>
                    <span className="text-slate-600">
                      {formData.upazila && formData.district
                        ? `${formData.upazila}, ${formData.district}`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">
                      Status:
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold capitalize">
                      {currentUser.status || "Active"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">Role:</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold capitalize">
                      {currentUser.role || "User"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">
                      Availability:
                    </span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-semibold capitalize">
                      {formData.availabilityStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">
                      Last Donation:
                    </span>
                    <span className="text-slate-600">
                      {formData.lastDonationDate || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">
                      Radius:
                    </span>
                    <span className="text-slate-600">
                      {formData.preferredRadius} km
                    </span>
                  </div>
                </div>
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-700">
                    Health Checklist
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {healthFlags.length === 0 && (
                      <span className="text-xs text-slate-500">No checklist saved.</span>
                    )}
                    {healthFlags.map((flag) => (
                      <span
                        key={flag}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-rose-600 text-xs font-semibold"
                      >
                        ✓ {flag.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="border-2 border-dashed border-rose-200 rounded-2xl p-6 text-center bg-white space-y-4">
                <p className="text-sm font-semibold text-slate-700">
                  Donor QR Verification
                </p>
                <div className="bg-white inline-block p-4 rounded-2xl shadow-inner">
                  <QRCode
                    id="donor-qr"
                    value={`bloodbridge:donor:${currentUser?._id || currentUser?.email}`}
                    size={160}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white text-sm font-semibold"
                >
                  Download QR
                </button>
              </div>
            </div>

            {/* Right Column - Edit Form */}
            {/* Right Column - Edit Form */}
            <div className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!editMode}
                    className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 bg-slate-100 text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    readOnly={!editMode}
                    className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    placeholder="Enter image URL"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      District
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                      placeholder="District"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Upazila
                    </label>
                    <input
                      type="text"
                      name="upazila"
                      value={formData.upazila}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                      placeholder="Upazila"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>

                {/* Availability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Availability
                    </label>
                    <select
                      name="availabilityStatus"
                      value={formData.availabilityStatus}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    >
                      <option value="available">Ready to donate</option>
                      <option value="resting">Resting (recent donation)</option>
                      <option value="medical-review">Medical review</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Last Donation Date
                    </label>
                    <input
                      type="date"
                      name="lastDonationDate"
                      value={formData.lastDonationDate}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Radius */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Preferred Donation Radius ({formData.preferredRadius} km)
                  </label>
                  <input
                    type="range"
                    name="preferredRadius"
                    min="5"
                    max="50"
                    step="5"
                    value={formData.preferredRadius}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full accent-rose-600"
                  />
                </div>

                {/* Health */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Hemoglobin (g/dL)
                    </label>
                    <input
                      type="number"
                      name="hemoglobinLevel"
                      value={formData.hemoglobinLevel}
                      onChange={handleChange}
                      readOnly={!editMode}
                      step="0.1"
                      className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Health Notes
                    </label>
                    <input
                      type="text"
                      name="healthNotes"
                      value={formData.healthNotes}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {healthChecklist.map((flag) => (
                    <label key={flag.value} className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={healthFlags.includes(flag.value)}
                        onChange={() => toggleFlag(flag.value)}
                        disabled={!editMode}
                        className="accent-rose-600"
                      />
                      {flag.label}
                    </label>
                  ))}
                </div>

                {/* Reminders */}
                <div className="border border-rose-100 rounded-2xl p-4 bg-white">
                  <p className="text-sm font-semibold text-slate-700 mb-3">
                    Reminder Preferences
                  </p>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.reminderEmail}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, reminderEmail: e.target.checked }))
                      }
                      disabled={!editMode}
                      className="accent-rose-600"
                    />
                    Email me after 90 days
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.reminderSMS}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, reminderSMS: e.target.checked }))
                      }
                      disabled={!editMode}
                      className="accent-rose-600"
                    />
                    SMS me about nearby drives
                  </label>
                </div>

                {/* Submit Button */}
                {editMode && (
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 font-bold mt-6"
                  >
                    💾 Save Changes
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
