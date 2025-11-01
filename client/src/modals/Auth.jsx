import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Auth = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setShowUserLogin, setUser, apiClient, navigate, loginUser, fetchUser } = useAppContext();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation (only for register)
    if (state === "register") {
      if (!name.trim()) {
        newErrors.name = "Name is required";
      } else if (!validateName(name)) {
        newErrors.name = "Name must be at least 2 characters";
      }
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    
    try {
      if (state === "register") {
        // Registration
        const { data } = await apiClient.post('/api/user/register', {
          name,
          email,
          password,
        });
        
        if (data && data.success) {
          toast.success(data.message || "Registration successful! Please login to continue.");
          setState("login");
          setName("");
          setPassword("");
          setErrors({});
        } else {
          toast.error(data?.message || "Registration failed");
        }
      } else {
        // Login using the loginUser function from context
        const result = await loginUser({ email, password });
        
        if (result && result.success) {
          toast.success("Login successful!");
          setShowUserLogin(false);
          
          // Reset form
          setName("");
          setEmail("");
          setPassword("");
          setErrors({});
        } else {
          toast.error(result?.message || "Login failed");
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 left-0 bottom-0 right-0 z-30 flex items-center justify-center  bg-black/50 text-gray-600"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[400px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <div className="w-full text-center mb-2">
          <h2 className="text-3xl font-bold text-gray-900">
            {state === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {state === "login" ? "Login to your account" : "Sign up to get started"}
          </p>
        </div>

        {state === "register" && (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: "" });
              }}
              value={name}
              placeholder="Enter your full name"
              className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full p-3 mt-1 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all`}
              type="text"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>
        )}

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: "" });
            }}
            value={email}
            placeholder="Enter your email"
            className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full p-3 mt-1 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all`}
            type="email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: "" });
            }}
            value={password}
            placeholder="Enter your password"
            className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full p-3 mt-1 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all`}
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password}
            </p>
          )}
          {state === "register" && !errors.password && (
            <p className="text-gray-500 text-xs mt-1">Password must be at least 6 characters</p>
          )}
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-white w-full py-3 rounded-lg font-semibold mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            state === "register" ? "Create Account" : "Login"
          )}
        </button>

        <div className="w-full text-center text-sm text-gray-600">
          {state === "register" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setState("login");
                  setErrors({});
                }}
                className="text-green-600 hover:text-green-700 cursor-pointer font-semibold"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setState("register");
                  setErrors({});
                }}
                className="text-green-600 hover:text-green-700 cursor-pointer font-semibold"
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
export default Auth;
