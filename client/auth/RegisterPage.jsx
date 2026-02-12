import { useState } from "react";

const VALIDATIONS = {
  name: (value) => {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    if (value.trim().length > 50) return "Name must be under 50 characters";
    return null;
  },
  email: (value) => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    return null;
  },
  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number";
    return null;
  },
};

export default function RegisterPage({ onRegister }) {
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const error = VALIDATIONS[name]?.(value) ?? null;
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateAll = () => {
    const newErrors = {
      name: VALIDATIONS.name(registerName),
      email: VALIDATIONS.email(registerEmail),
      password: VALIDATIONS.password(registerPassword),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true });
    return Object.values(newErrors).every((e) => e === null);
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const res = await onRegister({
      name: registerName,
      email: registerEmail,
      password: registerPassword,
    });

    if (res && res.ok) {
      console.log(":white_check_mark: Registration Success:", res);
      alert("Registration successful!");
    } else {
      console.log(":x: Registration Failed:", res);
      alert(res?.message || "Registration failed");
    }
  };

  const fields = [
    {
      label: "Name",
      name: "name",
      type: "text",
      value: registerName,
      onChange: (e) => {
        setRegisterName(e.target.value);
        if (touched.name) validateField("name", e.target.value);
      },
      placeholder: "Enter your name",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      value: registerEmail,
      onChange: (e) => {
        setRegisterEmail(e.target.value);
        if (touched.email) validateField("email", e.target.value);
      },
      placeholder: "Enter your email",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      value: registerPassword,
      onChange: (e) => {
        setRegisterPassword(e.target.value);
        if (touched.password) validateField("password", e.target.value);
      },
      placeholder: "Create a password",
    },
  ];

  return (
    <form onSubmit={submitRegister} className="auth-form" noValidate>
      {fields.map(({ label, name, type, value, onChange, placeholder }) => (
        <div key={name} className="form-group">
          <label>{label}</label>
          <input
            type={type}
            value={value}
            onChange={onChange}
            onBlur={() => handleBlur(name)}
            placeholder={placeholder}
            aria-invalid={!!(touched[name] && errors[name])}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
          />
          {touched[name] && errors[name] && (
            <span id={`${name}-error`} className="error-message" role="alert">
              {errors[name]}
            </span>
          )}
        </div>
      ))}

      <button type="submit" className="btn-primary">
        Register
      </button>
    </form>
  );
}