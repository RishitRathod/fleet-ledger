// "use client"
// import type React from "react"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { cn } from "@/lib/utils"

// export default function SignupFormDemo() {
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     console.log("Form submitted")
//   }
//   return (
//     <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
//       <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Welcome to FleetLedger</h2>
//       <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
//         Sign-in to FleetLedger
//       </p>

//       <form className="my-8" onSubmit={handleSubmit}>
//         <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
//           <LabelInputContainer>
//             <Label htmlFor="name">Name</Label>
//             <Input id="name" placeholder="please enter your name" type="text" />
//           </LabelInputContainer>
//           {/* <LabelInputContainer>
//             <Label htmlFor="lastname">Last name</Label>
//             <Input id="lastname" placeholder="Rathod" type="text" />
//           </LabelInputContainer> */}
//         </div>
//         <LabelInputContainer className="mb-4">
//           <Label htmlFor="email">Email Address</Label>
//           <Input id="email" placeholder="please enter your email" type="email" />
//         </LabelInputContainer>
//         <LabelInputContainer className="mb-4">
//           <Label htmlFor="password">Password</Label>
//           <Input id="password" placeholder="" type="password" />
//         </LabelInputContainer>
//         <LabelInputContainer className="mb-8">
//           <Label htmlFor="role">Your role</Label>
//           <Input id="role" placeholder="admin" type="text" />
//         </LabelInputContainer>

//         <button
//           className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
//           type="submit"
//         >
//           Sign up &rarr;
//           {/* <BottomGradient /> */}
//         </button>

//         <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

//         <div className="flex flex-col space-y-4">
//         </div>
//       </form>
//     </div>
//   )
// }

// const BottomGradient = () => {
//   return (
//     <>
//       <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
//       <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
//     </>
//   )
// }

// const LabelInputContainer = ({
//   children,
//   className,
// }: {
//   children: React.ReactNode
//   className?: string
// }) => {
//   return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
// }
"use client";
import type React from "react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function SignupFormDemo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        return value.length < 2 ? "Name must be at least 2 characters" : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Please enter a valid email address"
          : "";
      case "password":
        return value.length < 6
          ? "Password must be at least 6 characters"
          : !value.match(/[A-Z]/)
          ? "Password must contain at least one uppercase letter"
          : !value.match(/[0-9]/)
          ? "Password must contain at least one number"
          : "";
      case "confirmPassword":
        return value !== formData.password ? "Passwords do not match" : "";
      case "role":
        return !["", "admin", "user"].includes(value.toLowerCase())
          ? "Role must be either 'admin' or 'user'"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    // Only validate if there's a value or if there was a previous error
    if (value || errors[id]) {
      const error = validateField(id, value);
      setErrors((prev) => ({ ...prev, [id]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSubmitError("");

    try {
      const { confirmPassword, ...submitData } = formData;
      // Only convert role to lowercase, keep password case-sensitive
      const formattedData = {
        name: submitData.name,
        email: submitData.email,
        password: submitData.password, // Keep original case for password
        role: submitData.role.toLowerCase()
      };
      
      console.log('Sending signup data:', { ...formattedData, password: '***' });
      
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");
      window.location.href = "/loginform";
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <div>
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
            Welcome to FleetLedger
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center">
            Create your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <LabelInputContainer>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={cn(
                  "bg-black/80 border-gray-700 text-white",
                  errors.name && "border-red-500"
                )}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  "bg-black/80 border-gray-700 text-white",
                  errors.email && "border-red-500"
                )}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={cn(
                  "bg-black/80 border-gray-700 text-white",
                  errors.password && "border-red-500"
                )}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={cn(
                  "bg-black/80 border-gray-700 text-white",
                  errors.confirmPassword && "border-red-500"
                )}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 rounded-md border text-white bg-black/80 border-gray-700 focus:outline-none",
                  errors.role && "border-red-500"
                )}
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500 mt-1">{errors.role}</p>
              )}
            </LabelInputContainer>
          </div>

          {submitError && (
            <p className="text-sm text-red-500 text-center">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600",
              "block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium",
              "shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]",
              "dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",
              "transition-all duration-200",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
            Already have an account?{" "}
            <a href="/loginform" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>{children}</div>
  );
};
