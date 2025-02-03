import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const BlogEdit = () => {
	const { blogId } = useParams();
	const history = useHistory();
	const [formData, setFormData] = useState({
		title: '',
		description: ''
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [validationErrors, setValidationErrors] = useState([]);

	useEffect(() => {
		const userEmail = localStorage.getItem('userEmail');
		if (!userEmail) {
			history.push('/users/sign_in', {
				message: { type: 'error', text: 'You must be signed in to edit a blog' },
			});
			return;
		}

		axios.get(`/blogs/${blogId}.json`)
			.then(response => {
				const { title, description } = response.data.blog;
				const fetchedUserEmail = response.data.blog.user.email;
				setFormData({ title, description });
				setLoading(false);

				if (fetchedUserEmail !== userEmail) {
					history.push('/', {
						message: { type: 'error', text: 'You are not authorized to edit this blog' },
					});
				}
			})
			.catch(error => {
				setLoading(false);
				history.push('/users/sign_in', {
					message: { type: 'error', text: 'Failed to load blog' },
				});
				console.error('Error fetching blog data:', error);
			});
	}, [blogId, history]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
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
		setError('');

		const errors = validateForm();
		if (errors.length > 0) {
			setValidationErrors(errors);
			return;
		}

		try {
			await axios.put(`/blogs/${blogId}.json`, {
				blog: formData
			});
			history.push(`/blogs/${blogId}`);
		} catch (error) {
			setError('Error updating blog. Please try again later.');
			console.error('Error updating blog:', error);
		}
	};

	if (loading) return <div className="container mt-5">Loading...</div>;

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

			<div className="bg-light shadow-sm rounded-lg p-4 border">
				<h1 className="h3 mb-4">Edit Blog</h1>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="title" className="form-label">Title</label>
						<input
							type="text"
							className="form-control"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="description" className="form-label">Description</label>
						<textarea
							className="form-control"
							id="description"
							name="description"
							rows="5"
							value={formData.description}
							onChange={handleChange}
						/>
					</div>
					<div className="d-flex justify-content-end gap-2">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={() => history.push(`/blogs/${blogId}`)}
						>
							Cancel
						</button>
						<button type="submit" className="btn btn-primary">
							Update Blog
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default BlogEdit;