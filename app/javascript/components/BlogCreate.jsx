import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function BlogCreate() {
	const history = useHistory();
	const [formData, setFormData] = useState({
		title: '',
		description: '',
	});
	const [error, setError] = useState('');
	const [validationErrors, setValidationErrors] = useState([]);

	useEffect(() => {
		const userEmail = localStorage.getItem('userEmail');
		if (!userEmail) {
			history.push('/users/sign_in', {
				message: { type: 'error', text: 'You must be signed in to create a blog' },
			});
		}
	}, [history]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateForm = () => {
		const errors = [];

		if (!formData.title.trim()) {
			errors.push('Title cannot be blank.');
		} else if (!/^[a-zA-Z0-9 ]+$/.test(formData.title)) {
			errors.push('Title must be alphanumeric.');
		}

		if (!formData.description.trim()) {
			errors.push('Description cannot be blank.');
		}

		return errors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setValidationErrors([]);

		const errors = validateForm();
		if (errors.length > 0) {
			setValidationErrors(errors);
			return;
		}

		try {
			const response = await axios.post('/blogs', {
				blog: {
					...formData,
					userEmail: localStorage.getItem('userEmail'),
				},
			});
			history.push(`/blogs/${response.data.id}`);
		} catch (err) {
			setError('Failed to create blog. Please try again later.');
			console.error('Error creating blog:', err);
		}
	};

	return (
		<div className="container mt-5">
			{validationErrors.length > 0 && (
			<div className="alert alert-danger">
				<ul>
					{validationErrors.map((err, index) => (
					<li key={index}>{err}</li>
					))}
				</ul>
			</div>
			)}

			{error && <div className="alert alert-danger">{error}</div>}

			<h1 className="h3 mb-4 text-primary">Create New Blog</h1>

			<form onSubmit={handleSubmit} className="shadow-lg p-4 rounded bg-light">
				<div className="mb-3">
					<label htmlFor="title" className="form-label fw-bold">
						Title
					</label>
					<input
					type="text"
					className="form-control"
					id="title"
					name="title"
					value={formData.title}
					onChange={handleChange}
					placeholder="Enter blog title"
				/>
					</div>
					<div className="mb-3">
						<label htmlFor="description" className="form-label fw-bold">
							Description
						</label>
						<textarea
						className="form-control"
						id="description"
						name="description"
						rows="5"
						value={formData.description}
						onChange={handleChange}
						placeholder="Write your blog description here"
					/>
						</div>
						<div className="d-flex justify-content-between align-items-center">
							<button type="submit" className="btn btn-primary rounded-pill px-4">
								Create Blog
							</button>
						</div>
					</form>
				</div>
	);
}

export default BlogCreate;
