"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hook";
import { getProfile, updateProfile } from "../../../../redux/profile/profileThunks";
import api from "../../../../api/axios";

// ── Types ────────────────────────────────────────────────────────────────────

type Timetable = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

type FormValues = {
  fullName: string;
  email: string;
  mobilePhone: string;
  registrationNumber: string;
  gender: string;
  dateOfBirth: string;
  biography: string;
  experience: number;
  consultationFee: number;
  clinicName: string;
  clinicAddress: string;
  clinicCity: string;
  clinicPincode: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  specializations: string[];
  services: string[];
  symptoms: string[];
  timetable: Timetable[];
};

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const inputClass =
  "w-full rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition placeholder:text-gray-400";

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

const sectionTitle = "text-base font-semibold text-gray-800 mb-4 mt-2";

// ── Helper: map API response → FormValues ─────────────────────────────────────

function mapApiToForm(data: any): Partial<FormValues> {
  return {
    // API uses full_name OR fullName (admin-created vs self-registered)
    fullName: data.full_name ?? data.fullName ?? "",
    email: data.email ?? "",
    // API uses phone_number OR phone (depends on endpoint)
    mobilePhone: data.phone_number ?? data.mobilePhone ?? data.phone ?? "",
    registrationNumber: data.registration_number ?? data.registrationNumber ?? "",
    gender: data.gender ?? "",
    // dob comes as ISO string or null
    dateOfBirth: data.dob ? data.dob.split("T")[0] : "",
    biography: data.bio ?? "",
    experience: data.experience ?? 0,
    consultationFee: Number(data.consultation_fee ?? data.consultationFee ?? 0),

    // Clinic
    clinicName: data.clinic_name ?? data.clinicName ?? "",
    clinicAddress: data.clinic_address ?? data.clinicAddress ?? "",
    clinicCity: data.clinic_city ?? data.clinicCity ?? "",
    clinicPincode: data.clinic_pincode ?? data.clinicPincode ?? "",

    // Home address
    addressLine1: data.address_line_1 ?? "",
    city: data.city ?? "",
    postalCode: data.postal_code ?? "",

    // Specializations
    specializations:
      data.specializations?.map(
        (s: any) => s.specialization?.id ?? s.id ?? ""
      ) ?? [],

    // Services
    services:
      data.services?.map(
        (s: any) => s.service?.id ?? s.id ?? ""
      ) ?? [],

    // Symptoms
    symptoms:
      data.symptoms?.map(
        (s: any) => s.symptom?.id ?? s.id ?? ""
      ) ?? [],

    // Availability / timetable
    timetable:
      data.availability?.map((slot: any) => ({
        day_of_week: slot.day_of_week,
        start_time: slot.start_time ?? "",
        end_time: slot.end_time ?? "",
        is_active: slot.is_active ?? true,
      })) ?? [],
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DoctorProfileForm() {
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [specializationList, setSpecializationList] = useState<{id: string, name: string}[]>([]);
  const [serviceList, setServiceList] = useState<{id: string, name: string}[]>([]);
  const [symptomList, setSymptomList] = useState<{id: string, name: string}[]>([]);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.profile);
  console.log('user', user);

  // The actual API data lives one level deeper when it comes from the admin endpoint
  // e.g. { data: { id, full_name, … } }
  const doctorData = user?.data ?? user;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      mobilePhone: "",
      registrationNumber: "",
      gender: "",
      dateOfBirth: "",
      biography: "",
      experience: 0,
      consultationFee: 0,
      clinicName: "",
      clinicAddress: "",
      clinicCity: "",
      clinicPincode: "",
      addressLine1: "",
      city: "",
      postalCode: "",
      specializations: [""],
      services: [""],
      symptoms: [""],
      timetable: [],
    },
  });

  // Pre-fill form whenever the Redux state is populated
  useEffect(() => {
    if (!doctorData) return;
    reset(mapApiToForm(doctorData));

    // Pre-fill avatar from profile_image_url
    if (doctorData.profile_image_url) {
      setAvatarPreview(doctorData.profile_image_url);
    }
  }, [doctorData, reset]);

  // Fetch profile and taxonomies on mount
  useEffect(() => {
    dispatch(getProfile());
    api.get("/doctors/specializations").then((res) => setSpecializationList(res.data.data)).catch(console.error);
    api.get("/doctors/services").then((res) => setServiceList(res.data.data)).catch(console.error);
    api.get("/doctors/symptoms").then((res) => setSymptomList(res.data.data)).catch(console.error);
  }, [dispatch]);

  const { fields: timetableFields, append: appendSlot, remove: removeSlot } =
    useFieldArray({ control, name: "timetable" });

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = (data: FormValues) => {
    setSaving(true);

    // Build the payload in the shape your API expects
    const payload = {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.mobilePhone,
      registrationNumber: data.registrationNumber,
      gender: data.gender,
      dob: data.dateOfBirth || null,
      bio: data.biography,
      experience: Number(data.experience),
      consultationFee: Number(data.consultationFee),
      clinicName: data.clinicName,
      clinicAddress: data.clinicAddress,
      clinicCity: data.clinicCity,
      clinicPincode: data.clinicPincode,
      addressLine_1: data.addressLine1,
      city: data.city,
      postalCode: data.postalCode,

      specializations: data.specializations.filter(Boolean),
      services: data.services.filter(Boolean),
      symptoms: data.symptoms.filter(Boolean),

      timeTable: data.timetable.map((slot) => ({
        ...slot,
        day_of_week: Number(slot.day_of_week),
      })),
    };

    console.log("Update payload →", payload);

    dispatch(updateProfile(payload))
      .unwrap()
      .then(() => setSaving(false))
      .catch(() => setSaving(false));


    setTimeout(() => setSaving(false)
    , 1500);
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white shadow-md rounded-2xl font-sans">
      <div className="mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-1 pt-6">
          <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
          {saving && (
            <span className="flex items-center gap-2 text-sm font-medium text-green-500">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving changes…
            </span>
          )}
        </div>
        <hr className="border-gray-200 mb-8" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

          {/* ── Avatar ── */}
          <div>
            <label className="relative inline-block cursor-pointer group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-3xl">
                    👤
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow group-hover:bg-blue-500 transition">
                📷
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </label>
          </div>

          {/* ── BASIC INFO ── */}
          <div>
            <p className={sectionTitle}>Basic Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className={labelClass}>Full Name</label>
                <input className={inputClass} placeholder="Dr. Jane Smith" {...register("fullName", { required: "Full name is required" })} />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Registration Number</label>
                <input className={inputClass} placeholder="REG67890" {...register("registrationNumber")} />
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input className={inputClass} type="email" placeholder="jane@example.com" {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Mobile Phone</label>
                <div className="flex gap-2">
                  <select className="rounded-full border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition">
                    <option>+91</option>
                    <option>+1</option>
                    <option>+44</option>
                    <option>+880</option>
                  </select>
                  <input className={inputClass} placeholder="9876543210" {...register("mobilePhone")} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Gender</label>
                <select className={inputClass} {...register("gender")}>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Date of Birth</label>
                <input className={inputClass} type="date" {...register("dateOfBirth")} />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Biography</label>
                <textarea
                  rows={3}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition placeholder:text-gray-400 resize-none"
                  placeholder="Brief professional biography…"
                  {...register("biography")}
                />
              </div>

            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── PROFESSIONAL ── */}
          <div>
            <p className={sectionTitle}>Professional Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className={labelClass}>Experience (years)</label>
                <input className={inputClass} type="number" min={0} {...register("experience", { valueAsNumber: true })} />
              </div>

              <div>
                <label className={labelClass}>Consultation Fee (₹)</label>
                <input className={inputClass} type="number" min={0} {...register("consultationFee", { valueAsNumber: true })} />
              </div>

              <div>
                <label className={labelClass}>Specializations</label>
                <select className={inputClass} {...register("specializations.0")}>
                  <option value="">Select Specialization</option>
                  {specializationList.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Services</label>
                <select className={inputClass} {...register("services.0")}>
                  <option value="">Select Service</option>
                  {serviceList.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Symptoms Treated</label>
                <select className={inputClass} {...register("symptoms.0")}>
                  <option value="">Select Symptom</option>
                  {symptomList.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── CLINIC ── */}
          <div>
            <p className={sectionTitle}>Clinic Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className={labelClass}>Clinic Name</label>
                <input className={inputClass} placeholder="Heart Care Clinic" {...register("clinicName")} />
              </div>

              <div>
                <label className={labelClass}>Clinic City</label>
                <input className={inputClass} placeholder="Mumbai" {...register("clinicCity")} />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Clinic Address</label>
                <input className={inputClass} placeholder="456 Medical St, Health City" {...register("clinicAddress")} />
              </div>

              <div>
                <label className={labelClass}>Clinic Pincode</label>
                <input className={inputClass} placeholder="400001" {...register("clinicPincode")} />
              </div>

            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── HOME ADDRESS ── */}
          <div>
            <p className={sectionTitle}>Home Address</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="md:col-span-2">
                <label className={labelClass}>Address Line 1</label>
                <input className={inputClass} placeholder="789 Doctors Colony" {...register("addressLine1")} />
              </div>

              <div>
                <label className={labelClass}>City</label>
                <input className={inputClass} placeholder="Mumbai" {...register("city")} />
              </div>

              <div>
                <label className={labelClass}>Postal Code</label>
                <input className={inputClass} placeholder="400002" {...register("postalCode")} />
              </div>

            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── TIMETABLE ── */}
          <div>
            <p className={sectionTitle}>Weekly Timetable</p>
            <div className="space-y-3">
              {timetableFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-wrap items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm"
                >
                  <div className="w-28">
                    <label className="text-xs text-gray-500 mb-1 block">Day</label>
                    <select
                      className="w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
                      {...register(`timetable.${index}.day_of_week`, { valueAsNumber: true })}
                    >
                      {DAYS.map((d, i) => (
                        <option key={i} value={i}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[110px]">
                    <label className="text-xs text-gray-500 mb-1 block">Start Time</label>
                    <input
                      type="time"
                      className="w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
                      {...register(`timetable.${index}.start_time`)}
                    />
                  </div>

                  <div className="flex-1 min-w-[110px]">
                    <label className="text-xs text-gray-500 mb-1 block">End Time</label>
                    <input
                      type="time"
                      className="w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
                      {...register(`timetable.${index}.end_time`)}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id={`active-${index}`}
                      className="accent-blue-500 w-4 h-4"
                      {...register(`timetable.${index}.is_active`)}
                    />
                    <label htmlFor={`active-${index}`} className="text-sm text-gray-600">Active</label>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="pt-4 text-red-400 hover:text-red-600 text-lg transition"
                    title="Remove slot"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => appendSlot({ day_of_week: 0, start_time: "09:00", end_time: "17:00", is_active: true })}
                className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 font-medium transition"
              >
                <span className="text-lg leading-none">+</span> Add time slot
              </button>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── Save ── */}
          <div className="flex justify-end pb-6">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-60 text-white text-sm font-semibold shadow transition-all"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}