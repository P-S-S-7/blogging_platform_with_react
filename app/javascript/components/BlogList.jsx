import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

function BlogList() {
	const [blogs, setBlogs] = useState([]);
	const [error, setError] = useState(null);
	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
		axios.get('/blogs.json', { withCredentials: true })
			.then(response => {
				setBlogs(response.data);
			})
			.catch(error => {
				setError('Error fetching blogs. Please try again later.');
				console.error('Error fetching blogs:', error);
			});
	}, []);

	const handleNewBlog = () => {
		history.push('/blogs/new');
	};

	const displayMessage = location.state?.message;

	return (
		<div className="container mt-5">
			{displayMessage && (
			<div className="alert alert-danger text-center mb-4">
				{displayMessage.text}
			</div>
			)}
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="h2 text-dark font-weight-bold">Blogs</h1>
				<button className="btn btn-primary rounded-pill px-4 py-2" onClick={handleNewBlog}>
					+New Blog
				</button>
			</div>

			{error && <div className="alert alert-danger text-center mb-4">{error}</div>}

			<div id="blogs" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 rounded-3">
				{blogs.length > 0 ? (
				blogs.map((blog) => (
				<div key={blog.id} className="col">
					<div className="card h-100 shadow-lg border-0 rounded-lg overflow-hidden transform-hover">
						<div className="card-body d-flex flex-column">
							<Link
							to={`/blogs/${blog.id}`}
							className="text-decoration-none text-dark h5 d-block text-truncate mb-3"
							style={{ maxWidth: '100%' }}
							>
							{blog.title}
						</Link>
						<p className="text-primary small mb-3">- {blog.user?.email}</p>
						<p className="card-text mb-4 text-muted">
							{blog.description.length > 250 
							? blog.description.slice(0, 250) + '...'
							: blog.description}
						</p>
						<div className="d-flex justify-content-between align-items-center mt-auto">
							<Link
							to={`/blogs/${blog.id}`}
							className="btn btn-outline-primary btn-sm rounded-pill border-2"
							>
							Read More
						</Link>
					</div>
				</div>
			</div>
		</div>
		))
		) : (
		<p className="text-center text-muted col-12">No blogs available.</p>
		)}
	</div>
</div>
	);
}

export default BlogList;
