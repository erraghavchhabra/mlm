"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  KeyRound,
  ShieldCheck,
  Save,
} from "lucide-react";

export default function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative min-h-full overflow-hidden">

      {/* ================= Background Glow ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">


      </div>


      {/* ================= Content ================= */}

      <div className="relative z-10">

        {/* Heading */}

        <div className="mb-8">

          <h1
            className="
            text-3xl
            font-light
            tracking-tight
            text-white
            "
          >
            Change Password
          </h1>


          <p
            className="
            mt-2
            text-white/50
            "
          >
            Update your password to keep your account secure.
          </p>

        </div>



        {/* ================= Password Card ================= */}

        <div
          className="
          mx-auto
          max-w-2xl
          rounded-[34px]
          border
          border-white/10
          bg-white/5
          p-8
          backdrop-blur-3xl
          shadow-[0_35px_90px_rgba(0,0,0,.45)]
          "
        >


          {/* Icon Header */}

          <div className="mb-10 text-center">


            <div
              className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-[#8B84FF]
              to-[#5D58F8]
              shadow-[0_20px_45px_rgba(139,132,255,.35)]
              "
            >

              <LockKeyhole
                size={38}
                className="text-white"
              />

            </div>


            <h2
              className="
              mt-6
              text-2xl
              font-light
              text-white
              "
            >
              Account Security
            </h2>


            <p
              className="
              mt-2
              text-sm
              text-white/45
              "
            >
              Change your account password
            </p>


          </div>



          {/* Form */}

          <div className="space-y-6">


            {/* Current Password */}

            <div>

              <label
                className="
                mb-3
                flex
                items-center
                gap-2
                text-sm
                text-white/60
                "
              >

                <ShieldCheck
                  size={16}
                  className="text-[#8B84FF]"
                />

                Current Password

              </label>


              <div className="relative">


                <LockKeyhole
                  size={18}
                  className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-white/40
                  "
                />


                <input
                  type={
                    showCurrent
                      ? "text"
                      : "password"
                  }
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  pl-12
                  pr-14
                  text-white
                  placeholder:text-white/25
                  outline-none
                  transition-all
                  focus:border-[#8B84FF]
                  focus:bg-white/10
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowCurrent(!showCurrent)
                  }
                  className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-white/40
                  hover:text-white
                  "
                >

                  {showCurrent ? (
                    <EyeOff size={18}/>
                  ) : (
                    <Eye size={18}/>
                  )}

                </button>


              </div>

            </div>
            {/* New Password */}

            <div>

              <label
                className="
                mb-3
                flex
                items-center
                gap-2
                text-sm
                text-white/60
                "
              >

                <KeyRound
                  size={16}
                  className="text-[#8B84FF]"
                />

                New Password

              </label>


              <div className="relative">


                <KeyRound
                  size={18}
                  className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-white/40
                  "
                />


                <input
                  type={
                    showNew
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  pl-12
                  pr-14
                  text-white
                  placeholder:text-white/25
                  outline-none
                  transition-all
                  focus:border-[#8B84FF]
                  focus:bg-white/10
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowNew(!showNew)
                  }
                  className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-white/40
                  hover:text-white
                  "
                >

                  {showNew ? (
                    <EyeOff size={18}/>
                  ) : (
                    <Eye size={18}/>
                  )}

                </button>


              </div>

            </div>




            {/* Confirm Password */}


            <div>

              <label
                className="
                mb-3
                flex
                items-center
                gap-2
                text-sm
                text-white/60
                "
              >

                <LockKeyhole
                  size={16}
                  className="text-[#8B84FF]"
                />

                Confirm Password

              </label>


              <div className="relative">


                <LockKeyhole
                  size={18}
                  className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-white/40
                  "
                />


                <input
                  type={
                    showConfirm
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  pl-12
                  pr-14
                  text-white
                  placeholder:text-white/25
                  outline-none
                  transition-all
                  focus:border-[#8B84FF]
                  focus:bg-white/10
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                  className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-white/40
                  hover:text-white
                  "
                >

                  {showConfirm ? (
                    <EyeOff size={18}/>
                  ) : (
                    <Eye size={18}/>
                  )}

                </button>


              </div>

            </div>



            {/* Divider */}

            <div
              className="
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/10
              to-transparent
              "
            />



            {/* Button */}


            <button
              type="button"
              className="
              flex
              h-14
              w-full
              items-center
              justify-center
              gap-3
              rounded-full
              bg-white
              font-medium
              text-[#5D58F8]
              shadow-[0_20px_45px_rgba(255,255,255,.15)]
              transition-all
              hover:scale-[1.02]
              hover:shadow-[0_25px_60px_rgba(255,255,255,.25)]
              active:scale-[0.98]
              "
            >

              <Save size={18}/>

              Update Password

            </button>



          </div>


        </div>


      </div>


    </div>
  );
}