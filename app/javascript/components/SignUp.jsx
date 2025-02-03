import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [errors, setErrors] = useState([]);

	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let validationErrors = [];

		if(email === "") {
			validationErrors.push("Email can't be blank");
		}

		if (email !== "" && !validateEmail(email)) {
			validationErrors.push("Invalid email format");
		}

		if (password.length < 6) {
			validationErrors.push("Password must be at least 6 characters long");
		}

		if (password !== passwordConfirmation) {
			validationErrors.push("Password and password confirmation do not match");
		}

		if (validationErrors.length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			await axios.post(
				"/users",
				{ user: { email, password, password_confirmation: passwordConfirmation } },
				{ withCredentials: true }
			);

			await axios.post("/users/sign_in", { user: { email, password } });

			localStorage.setItem("isSignedIn", "true");
			localStorage.setItem("userEmail", email);
			window.location.href = "/";
		} catch (error) {
			if (error.response) {
				setErrors(["Email has already been taken"]);
			} else if (error.request) {
				setErrors(["No response from server"]);
			} else {
				setErrors([error.message]);
			}
		}
	};

	return (
		<div className="container d-flex justify-content-center align-items-center vh-100">
			<div className="card shadow-lg p-4" style={{ width: "400px" }}>
				<h1 className="mb-4 text-center">Sign Up</h1>

				{errors.length > 0 && (
				<div className="alert alert-danger">
					<ul className="mb-0">
						{errors.map((error, index) => (
						<li key={index}>{error}</li>
						))}
					</ul>
				</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">Email</label>
						<input
						type="email"
						className="form-control"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email"
					/>
						</div>
						<div className="mb-3">
							<label htmlFor="password" className="form-label">Password</label>
							<input
							type="password"
							className="form-control"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
						/>
							</div>
							<div className="mb-3">
								<label htmlFor="passwordConfirmation" className="form-label">Confirm Password</label>
								<input
								type="password"
								className="form-control"
								id="passwordConfirmation"
								value={passwordConfirmation}
								onChange={(e) => setPasswordConfirmation(e.target.value)}
								placeholder="Confirm your password"
							/>
								</div>
								<button type="submit" className="btn btn-primary w-100">Sign Up</button>
							</form>
						</div>
					</div>
	);
};

export default SignUp;
