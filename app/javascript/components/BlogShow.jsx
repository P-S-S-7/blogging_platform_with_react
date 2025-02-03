import React, { useState, useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const BlogShow = () => {
	const { blogId } = useParams();
	const history = useHistory();
	const [blog, setBlog] = useState(null);
	const [comments, setComments] = useState([]);
	const [error, setError] = useState(null);
	const [newComment, setNewComment] = useState('');

	useEffect(() => {
		axios.get(`/blogs/${blogId}.json`)
			.then(response => {
				console.log(response.data);
				setBlog(response.data.blog);
				setComments(response.data.comments);
			})
			.catch(error => {
				setError('Failed to load blog');
				console.error('Error fetching blog data:', error);
			});
	}, [blogId]);

	const handleDeleteBlog = async () => {
		const userEmail = localStorage.getItem('userEmail'); 

		if (!userEmail) {
			history.push('/users/sign_in', {
				message: { type: 'error', text: 'You must be signed in to delete a blog' },
			});
			return;
		}

		if (blog && blog.user.email !== userEmail) {
			history.push('/', {
				message: { type: 'error', text: 'You are not authorized to delete this blog' },
			});
			return;
		}

		if (window.confirm('Are you sure you want to delete this blog?')) {
			try {
				await axios.delete(`/blogs/${blogId}.json`);
				window.location.href = '/';
			} catch (error) {
				console.error('Error deleting blog:', error);
			}
		}
	};

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		const userEmail = localStorage.getItem('userEmail');

		if (!userEmail) {
			history.push('/users/sign_in', {
				message: { type: 'error', text: 'You must be signed in to post a comment' },
			});
			return;
		}

		if (!newComment.trim()) {
			setError('Comment cannot be empty');
			return;
		}

		try {
			await axios.post(`/blogs/${blogId}/blog_comments.json`, {
				blog_comment: {
					content: newComment.trim(),
					user_email: userEmail,
					blog_id: parseInt(blogId, 10)
				}
			});

			window.location.reload();
		} catch (error) {
			console.error('Error posting comment:', error);
			if (error.response) {
				console.log('Error response:', error.response.data);
				setError(error.response.data.message || 'Failed to post comment. Please try again.');
			} else {
				setError('Failed to post comment. Please try again.');
			}
		}
	};

	const handleDeleteComment = async (commentId) => {
		const userEmail = localStorage.getItem('userEmail');
		const comment = comments.find(comment => comment.id === commentId);

		if (!userEmail) {
			history.push('/users/sign_in', {
				message: { type: 'error', text: 'You must be signed in to delete a comment' },
			});
			return;
		}

		if (!comment) {
			setError('Comment not found');
			return;
		}

		if (comment.user.email !== userEmail) {
			setError('You are not authorized to delete this comment');
			return;
		}

		try {
			await axios.delete(`/blogs/${blogId}/blog_comments/${commentId}.json`);
			window.location.reload();
		} catch (error) {
			console.error('Error deleting comment:', error);
			setError('Failed to delete comment. Please try again.');
		}
	};

	const canDeleteComment = (comment) => {
		const userEmail = localStorage.getItem('userEmail');
		return userEmail && comment.user.email === userEmail;
	};

	return (
		<div className="container mt-5">
			{error && <div className="alert alert-danger text-center">{error}</div>}
			{blog ? (
			<>
			<div className="bg-light shadow-sm rounded-lg p-4 mb-4 border">
				<div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
					<h3 className="h5 font-weight-bold text-dark text-decoration-italic">
						{blog.title}
					</h3>
					<p className="text-primary small mt-2">{blog.user.email}</p>
				</div>
				<p className="text-lg text-dark">{blog.description}</p>
			</div>

			<div className="d-flex justify-content-end mb-4">
				<Link 
				to="/" 
				className="btn btn-link text-decoration-underline text-primary"
				>
				Back
			</Link>
			<Link 
			to={`/blogs/${blogId}/edit?title=${encodeURIComponent(blog.title)}&description=${encodeURIComponent(blog.description)}`}
			className="btn btn-link text-decoration-underline text-warning"
			>
			Edit
		</Link>
		<button 
		className="btn btn-link text-danger text-decoration-underline"
		onClick={handleDeleteBlog}
		>
		Delete
	</button>
</div>

<hr className="my-4" />

<div className="bg-light shadow-sm rounded-lg p-4 border">
	<h2 className="h5 font-weight-bold mb-4">Comments</h2>
	{comments.length > 0 ? (
	<ul className="list-group">
		{comments.map((comment) => (
		<li key={`comment-${comment.id}`} className="list-group-item">
			<div key={`comment-header-${comment.id}`} className="d-flex justify-content-between align-items-center mb-2">
				<strong key={`comment-author-${comment.id}`} className="text-dark">
					{comment.user.email}
				</strong>
				{canDeleteComment(comment) && (
				<button 
					key={`comment-delete-${comment.id}`}
					className="btn btn-link text-danger"
					onClick={() => handleDeleteComment(comment.id)}
					>
					Delete
				</button>
				)}
			</div>
			<p key={`comment-content-${comment.id}`} className="text-muted">
				{comment.content}
			</p>
		</li>
		))}
	</ul>
	) : (
	<p className="text-muted">No comments yet. Be the first to comment!</p>
	)}
		</div>
			<hr className="my-4" />
				<div className="bg-light shadow-sm rounded-lg p-4 mt-4 border">
					<h3 className="h5 font-weight-bold mb-3">Add a Comment</h3>
					<form onSubmit={handleCommentSubmit}>
						<div className="mb-3">
							<textarea
							className="form-control"
							rows="3"
							placeholder="Write a comment"
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							></textarea>
					</div>
					<button 
					type="submit" 
					className="btn btn-primary"
					>
					Post Comment
				</button>
			</form>
		</div>
	</>
) : (
	<div className="text-center">
		<div className="spinner-border text-primary" role="status">
			<span className="visually-hidden">Loading...</span>
		</div>
	</div>
)}
	</div>
);
};

export default BlogShow;
