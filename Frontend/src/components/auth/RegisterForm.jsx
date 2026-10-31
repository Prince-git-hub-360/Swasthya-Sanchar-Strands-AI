import GoogleSignInButton from './GoogleSignInButton';
import React, { useState } from 'react';
import { useAuth, LANGUAGES } from '../../shared/context/AuthContext';
import { ROUTES, navigateTo, getRoleDefaultRoute } from '../../utils/routes';
import { INDIAN_STATES_LIST, getDistrictsForState } from '../../shared/data/indianStatesAndDistricts';

export const RegisterForm = ({ onNavigateLogin, onSuccess, initialUsername = '' }) => {
  const { register, loading, showToast } = useAuth();
  const [selectedRole, setSelectedRole] = useState('patient');
  const [usernameTakenError, setUsernameTakenError] = useState(null);

  const [formData, setFormData] = useState({
    username: initialUsername || '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    gender: '',
    preferred_language: '',
    date_of_birth: '',
    age: '',
    phone_number: '',
    state: '',
    district: '',
    village_or_town: '',
    pincode: '',
    
    // Doctor Specific
    medical_reg_no: '',
    specialization: '',
    hospital_name: '',

    // ASHA Specific
    asha_id: '',
    sub_centre: '',

    // Caregiver Specific
    relationship_to_patient: '',
    linked_patient_name: '',
    linked_patient_phone: '',
  });

  React.useEffect(() => {
    if (initialUsername) {
      setFormData((prev) => ({ ...prev, username: initialUsername }));
    }
  }, [initialUsername]);

  const availableDistricts = formData.state ? getDistrictsForState(formData.state) : [];

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (usernameTakenError) setUsernameTakenError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username' && usernameTakenError) {
      setUsernameTakenError(null);
    }
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'date_of_birth' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (!isNaN(age) && age >= 0) {
          updated.age = age.toString();
        }
      }
      if (name === 'state') {
        updated.district = '';
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.first_name || !formData.password) {
      if (showToast) showToast('Please fill all required fields.', 'warning');
      return;
    }

    try {
      setUsernameTakenError(null);
      const payload = {
        ...formData,
        role: selectedRole,
      };

      const registeredUser = await register(payload);
      const userRole = registeredUser?.role || selectedRole;
      const targetRoute = getRoleDefaultRoute(userRole);
      
      const roleDisplayName = 
        selectedRole === 'doctor' ? 'Doctor' :
        selectedRole === 'healthcare_worker' ? 'ASHA Worker' :
        selectedRole === 'caregiver' ? 'Caregiver' : 'Patient';

      // Save patient to shared ABDM registry for instant ASHA & Doctor lookup
      if (selectedRole === 'patient') {
        try {
          const abdmRegistry = JSON.parse(localStorage.getItem('swasthya_abdm_registry') || '[]');
          const registeredAbha = registeredUser?.profile?.abha_id || registeredUser?.abha_id || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
          const patientEntry = {
            abhaId: registeredAbha,
            fullName: `${formData.first_name} ${formData.last_name || ''}`.trim(),
            nameHi: `${formData.first_name} ${formData.last_name || ''}`.trim(),
            date_of_birth: formData.date_of_birth || '',
            age: formData.age || '18',
            gender: formData.gender === 'F' ? 'Female' : 'Male',
            mobile: formData.phone_number || '+91 9008802105',
            state: formData.state || 'Karnataka',
            district: formData.district || 'Bengaluru Urban',
            village: formData.village_or_town || 'Electronic City',
            sector: `${formData.village_or_town || 'Electronic City'} Sector`,
            chronicCondition: 'None',
          };
          abdmRegistry.unshift(patientEntry);
          localStorage.setItem('swasthya_abdm_registry', JSON.stringify(abdmRegistry));
        } catch {}
      }

      if (showToast) showToast(`✅ ${roleDisplayName} account created successfully for ${formData.first_name}! Please sign in.`, 'success');
      
      if (onNavigateLogin) {
        onNavigateLogin(formData.username);
      } else {
        navigateTo(ROUTES.AUTH.LOGIN);
      }
    } catch (err) {
      const msg = String(err.message || '');
      if (err.errorCode === 'USERNAME_TAKEN' || msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('taken')) {
        setUsernameTakenError(`Username "${formData.username}" is already taken.`);
      }
      if (showToast) showToast(err.message || 'Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-[#161F30] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl font-sans transition-colors">
      
      {/* Header Adapting Dynamically per Role */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight mb-1">
          {selectedRole === 'patient' && 'Register Citizen Patient'}
          {selectedRole === 'healthcare_worker' && 'Register ASHA Health Worker'}
          {selectedRole === 'doctor' && 'Register Medical Officer / Doctor'}
          {selectedRole === 'caregiver' && 'Register Family Caregiver'}
        </h2>
        <p className="text-xs text-stone-600 dark:text-slate-300">
          {selectedRole === 'patient' && 'ABDM Ayushman Bharat Digital Health Ecosystem & 14-Digit ABHA ID'}
          {selectedRole === 'healthcare_worker' && 'National Health Mission (NHM) Community Health & Doorstep Care'}
          {selectedRole === 'doctor' && 'Healthcare Professionals Registry (HPR) & PHC Clinical OPD'}
          {selectedRole === 'caregiver' && 'Family Care Network & Patient Medication Monitoring'}
        </p>
      </div>

      {/* 4 Clean Role Selector Tabs at the Top */}
      <div className="grid grid-cols-4 gap-1.5 bg-stone-100 dark:bg-slate-900 p-1.5 rounded-2xl mb-6 border border-stone-200 dark:border-slate-800">
        {[
          { id: 'patient', label: '👵 Patient' },
          { id: 'healthcare_worker', label: '👩‍⚕️ ASHA' },
          { id: 'doctor', label: '👨‍⚕️ Doctor' },
          { id: 'caregiver', label: '👨‍👩‍👧 Caregiver' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleRoleChange(tab.id)}
            className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer text-center ${
              selectedRole === tab.id
                ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Registration Form with Empty Inputs */}
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              autoComplete="off"
              className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0F766E] dark:focus:border-teal-400 shadow-2xs"
              placeholder="e.g. Ramesh"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              autoComplete="off"
              className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0F766E] dark:focus:border-teal-400 shadow-2xs"
              placeholder="e.g. Kumar"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Username & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              autoComplete="off"
              className={`w-full bg-white dark:bg-slate-800 border text-stone-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all shadow-2xs ${
                usernameTakenError
                  ? 'border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  : 'border-stone-300 dark:border-slate-700 focus:border-[#0F766E] dark:focus:border-teal-400'
              }`}
              placeholder="e.g. ramesh_kumar"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {usernameTakenError && (
              <div className="mt-1.5 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-200">
                <span>⚠️ {usernameTakenError}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateLogin) onNavigateLogin(formData.username);
                    else navigateTo(ROUTES.AUTH.LOGIN);
                  }}
                  className="font-bold underline text-amber-900 dark:text-amber-300 hover:text-amber-950 cursor-pointer ml-1.5 whitespace-nowrap"
                >
                  Sign In →
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone_number"
              autoComplete="off"
              className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0F766E] dark:focus:border-teal-400 shadow-2xs"
              placeholder="e.g. 9876543210"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1">
            Create Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0F766E] dark:focus:border-teal-400 shadow-2xs"
            placeholder="••••••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Age/DOB, Gender & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1 flex items-center justify-between">
              <span>DOB (जन्म तिथि) <span className="text-red-500">*</span></span>
              {formData.age && (
                <span className="text-[10px] font-black text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                  {formData.age} yrs
                </span>
              )}
            </label>
            <input
              type="date"
              name="date_of_birth"
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0F766E] dark:focus:border-teal-400 shadow-2xs cursor-pointer"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#0F766E] dark:focus:border-teal-400 shadow-2xs"
            >
              <option value="">Select Gender (लिंग चुनें)</option>
              <option value="M">Male (पुरुष)</option>
              <option value="F">Female (महिला)</option>
              <option value="O">Other (अन्य)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1">
              Preferred Language
            </label>
            <select
              name="preferred_language"
              value={formData.preferred_language}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#0F766E] dark:focus:border-teal-400 shadow-2xs"
            >
              <option value="">Select Language (भाषा चुनें)</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🩺 ROLE-SPECIFIC PROFESSIONAL / IDENTITY FIELDS */}

        {/* DOCTOR FIELDS */}
        {selectedRole === 'doctor' && (
          <div className="bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 p-4 rounded-2xl space-y-3">
            <div className="text-[11px] font-black uppercase text-teal-800 dark:text-teal-300 tracking-wider">
              👨‍⚕️ Medical Registration &amp; License Details (HPR)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Medical Council Reg No. *
                </label>
                <input
                  type="text"
                  name="medical_reg_no"
                  placeholder="e.g. KMC-58492"
                  value={formData.medical_reg_no}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-stone-900 dark:text-white text-xs rounded-xl px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Clinical Specialization *
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-stone-900 dark:text-white text-xs rounded-xl px-3 py-2 outline-none"
                >
                  <option value="">Select Specialization</option>
                  <option value="General Medicine / MBBS">General Medicine / MBBS</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Obstetrics & Gynecology (OBGYN)">Obstetrics & Gynecology (OBGYN)</option>
                  <option value="Pulmonology (Chest/TB)">Pulmonology (Chest/TB)</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Diabetology">Diabetology</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                Assigned PHC / Hospital Facility *
              </label>
              <input
                type="text"
                name="hospital_name"
                placeholder="e.g. Mandya Primary Health Centre #2"
                value={formData.hospital_name}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-stone-900 dark:text-white text-xs rounded-xl px-3 py-2 outline-none"
              />
            </div>
          </div>
        )}

        {/* ASHA WORKER FIELDS */}
        {selectedRole === 'healthcare_worker' && (
          <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl space-y-3">
            <div className="text-[11px] font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider">
              👩‍⚕️ Frontline Health Worker Identification (NHM)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Official ASHA ID / Badge No. *
                </label>
                <input
                  type="text"
                  name="asha_id"
                  placeholder="e.g. ASHA-KA-MDY-084"
                  value={formData.asha_id}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-stone-900 dark:text-white text-xs rounded-xl px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Assigned Sub-Centre / Sector *
                </label>
                <input
                  type="text"
                  name="sub_centre"
                  placeholder="e.g. Gejjalagere Health Sub-Centre"
                  value={formData.sub_centre}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-stone-900 dark:text-white text-xs rounded-xl px-3 py-2 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* CAREGIVER FIELDS */}
        {selectedRole === 'caregiver' && (
          <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 p-4 rounded-2xl space-y-3">
            <div className="text-[11px] font-black uppercase text-blue-800 dark:text-blue-300 tracking-wider">
              👨‍👩‍👧 Family Linkage &amp; Care Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Relationship to Patient *
                </label>
                <select
                  name="relationship_to_patient"
                  value={formData.relationship_to_patient}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 text-stone-900 dark:text-white text-xs rounded-xl px-3 py-2 outline-none"
                >
                  <option value="">Select Relationship</option>
                  <option value="Son">Son (बेटा / ಮಗ)</option>
                  <option value="Daughter">Daughter (बेटी / ಮಗಳು)</option>
                  <option value="Spouse">Spouse (पति/पत्नी / ಗಂಡ/ಹೆಂಡತಿ)</option>
                  <option value="Parent">Parent (माता/पिता / ತಂದೆ/ತಾಯಿ)</option>
                  <option value="Brother/Sister">Sibling (भाई/बहन / ಸಹೋದರ/ಸಹೋದರಿ)</option>
                  <option value="Legal Guardian">Legal Guardian (संरक्षक / ಪಾಲಕ)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Primary Patient Name / Mobile *
                </label>
                <input
                  type="text"
                  name="linked_patient_name"
                  placeholder="e.g. Savithri Devi (+91 98765 00222)"
                  value={formData.linked_patient_name}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 text-stone-900 dark:text-white text-xs rounded-xl px-3 py-2 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 🇮🇳 DYNAMIC STATE & DISTRICT DROPDOWNS (28 STATES & 8 UTs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1">
              State (राज्य) <span className="text-red-500">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:border-[#0F766E] dark:focus:border-teal-400 shadow-2xs cursor-pointer"
              required
            >
              <option value="">Select State (राज्य चुनें)</option>
              {INDIAN_STATES_LIST.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1">
              District (जिला) <span className="text-red-500">*</span>
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:border-[#0F766E] dark:focus:border-teal-400 shadow-2xs cursor-pointer"
              required
              disabled={!formData.state}
            >
              <option value="">{formData.state ? 'Select District (जिला चुनें)' : 'Select State First'}</option>
              {availableDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Village / Town & Pincode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1">
              Village / Town / Ward <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="village_or_town"
              autoComplete="off"
              className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0F766E] dark:focus:border-teal-400 shadow-2xs"
              placeholder="e.g. Gejjalagere"
              value={formData.village_or_town}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1">
              PIN Code
            </label>
            <input
              type="text"
              name="pincode"
              autoComplete="off"
              maxLength={6}
              className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0F766E] dark:focus:border-teal-400 shadow-2xs"
              placeholder="e.g. 571428"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Dynamic Role Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 mt-4"
        >
          {loading ? 'Registering Account...' : (
            selectedRole === 'patient' ? 'Create Patient Account & Issue 14-Digit ABHA ID →' :
            selectedRole === 'doctor' ? 'Register Doctor & Verify HPR License →' :
            selectedRole === 'healthcare_worker' ? 'Register ASHA Worker Portal Account →' :
            'Create Caregiver Account & Link Family Member →'
          )}
        </button>

      </form>

      {/* Google OAuth 2.0 Registration */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="border-t border-stone-200 dark:border-slate-700 w-full" />
        <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-stone-400 dark:text-slate-500 uppercase tracking-wider absolute">
          Or register with
        </span>
      </div>

      <GoogleSignInButton
        role={selectedRole}
        onSuccess={onSuccess}
        text="signup_with"
      />


      {/* Switch to Login */}
      <div className="text-center mt-6 text-xs text-stone-600 dark:text-slate-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => {
            if (onNavigateLogin) onNavigateLogin(formData.username);
            else navigateTo(ROUTES.AUTH.LOGIN);
          }}
          className="font-bold text-[#0F766E] dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 cursor-pointer underline"
        >
          Sign In
        </button>
      </div>

    </div>
  );
};

export default RegisterForm;
