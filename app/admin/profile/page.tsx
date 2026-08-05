"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Camera,
  User,
  UserCircle2,
  Mail,
  Phone,
  Wallet,
  MapPin,
  Save,
} from "lucide-react";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(
    "/assets/img/profile.jpg"
  );

  const [form, setForm] = useState({
    username: "manish",
    sponsor: "SPN458963",
    fullname: "Manish Saini",
    email: "manish@example.com",
    phone: "+91 9876543210",
    wallet: "",
    address: "",
  });

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="relative overflow-hidden"
    >
      {/* ================= Background Glow ================= */}


      <div className="relative z-10">

        {/* ================= Heading ================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-light tracking-tight text-white">
            Profile Settings
          </h1>

          <p className="mt-2 text-white/55">
            Manage your personal information and account
            preferences.
          </p>

        </div>

        {/* ================= Card ================= */}

        <motion.div
          whileHover={{
            y: -2,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
          rounded-[34px]
          border
          border-white/10
          bg-white/5
          backdrop-blur-3xl
          shadow-[0_35px_80px_rgba(0,0,0,.45)]
          p-8 
          relative
          overflow-hidden
        "
        >
           
          {/* ================= Profile ================= */}

          <div className="flex flex-col items-center">

            <motion.div
              whileHover={{
                scale: 1.04,
              }}
              className="relative"
            >
              <div className="rounded-full bg-gradient-to-br from-[#8A7FFF] to-[#5A54FF] p-[3px]">

                <Image
                  src={preview}
                  alt=""
                  width={130}
                  height={130}
                  className="
                  h-[130px]
                  w-[130px]
                  rounded-full
                  object-cover
                  border-4
                  border-[#14142B]
                "
                />

              </div>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="
                absolute
                bottom-2
                right-2
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white
                text-[#5D58F8]
                shadow-xl
                transition
                hover:scale-110
              "
              >
                <Camera size={18} />
              </button>

              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImage}
              />

            </motion.div>

            <button
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="
              mt-5
              rounded-full
              border
              border-white/10
              bg-white/5
              px-6
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-white/10
            "
            >
              Change Profile Picture
            </button>

          </div>

          {/* ================= Form ================= */}

          <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2">

            {/* Username */}

            <div>

              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">

                <User
                  size={16}
                  className="text-[#8B84FF]"
                />

                Username

              </label>

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                className="
                h-14
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-5
                text-white
                placeholder:text-white/25
                outline-none
                transition-all
                focus:border-[#8B84FF]
                focus:bg-white/10
              "
              />

            </div>

            {/* Sponsor */}

            <div>

              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">

                <UserCircle2
                  size={16}
                  className="text-[#8B84FF]"
                />

                Sponsor ID

              </label>

              <input
                name="sponsor"
                value={form.sponsor}
                onChange={handleChange}
                placeholder="Sponsor"
                className="
                h-14
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-5
                text-white
                placeholder:text-white/25
                outline-none
                transition-all
                focus:border-[#8B84FF]
                focus:bg-white/10
              "
              />

            </div>            {/* Full Name */}

            <div>
              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                <User
                  size={16}
                  className="text-[#8B84FF]"
                />
                Full Name
              </label>

              <input
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="
                h-14
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-5
                text-white
                placeholder:text-white/25
                outline-none
                transition-all
                focus:border-[#8B84FF]
                focus:bg-white/10
              "
              />
            </div>

            {/* Email */}

            <div>
              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                <Mail
                  size={16}
                  className="text-[#8B84FF]"
                />
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="
                h-14
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-5
                text-white
                placeholder:text-white/25
                outline-none
                transition-all
                focus:border-[#8B84FF]
                focus:bg-white/10
              "
              />
            </div>

            {/* Phone */}

            <div>
              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                <Phone
                  size={16}
                  className="text-[#8B84FF]"
                />
                Phone Number
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="
                h-14
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-5
                text-white
                placeholder:text-white/25
                outline-none
                transition-all
                focus:border-[#8B84FF]
                focus:bg-white/10
              "
              />
            </div>

            {/* Wallet */}

            <div>
              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                <Wallet
                  size={16}
                  className="text-[#8B84FF]"
                />
                Wallet Address
              </label>

              <input
                name="wallet"
                value={form.wallet}
                onChange={handleChange}
                placeholder="Wallet Address"
                className="
                h-14
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-5
                text-white
                placeholder:text-white/25
                outline-none
                transition-all
                focus:border-[#8B84FF]
                focus:bg-white/10
              "
              />
            </div>

            {/* Address */}

            <div className="md:col-span-2">
              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                <MapPin
                  size={16}
                  className="text-[#8B84FF]"
                />
                Address
              </label>

              <textarea
                rows={5}
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your complete address..."
                className="
                w-full
                resize-none
                rounded-3xl
                border
                border-white/10
                bg-white/5
                px-5
                py-4
                text-white
                placeholder:text-white/25
                outline-none
                transition-all
                focus:border-[#8B84FF]
                focus:bg-white/10
              "
              />
            </div>

          </div>

          {/* Bottom Divider */}

          <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Footer */}

          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

            <div>
              <h3 className="text-lg font-medium text-white">
                Account Information
              </h3>

              <p className="mt-1 text-sm text-white/45">
                Keep your profile information up to date.
              </p>
            </div>

            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="
              flex
              items-center
              gap-3
              rounded-full
              bg-white
              px-8
              py-4
              font-medium
              text-[#5D58F8]
              shadow-[0_20px_45px_rgba(255,255,255,.18)]
              transition-all
              hover:shadow-[0_25px_60px_rgba(255,255,255,.25)]
            "
            >
              <Save size={18} />
              Update Profile
            </motion.button>

          </div>

        </motion.div>

      </div>

    </motion.div>
  );
}