class BlogCommentsController < ApplicationController
	before_action :set_comment, only: [:destroy]

	def create
		user = User.find_by(email: params[:blog_comment][:user_email])
		blog = Blog.find_by(id: params[:blog_comment][:blog_id])

		if user && blog
			@blog_comment = blog.blog_comments.build(comment_params.except(:user_email, :blog_id))
			@blog_comment.user = user

			if @blog_comment.save
				render json: @blog_comment, status: :created
			else
				render json: { errors: @blog_comment.errors.full_messages }, status: :unprocessable_entity
			end
		else
			render json: { error: 'Invalid user or blog.' }, status: :unprocessable_entity
		end
	end

	def destroy
		if @blog_comment.destroy
			render json: { message: 'Comment deleted successfully.' }, status: :ok
		else
			render json: { error: 'You are not authorized to delete this comment.' }, status: :forbidden
		end
	end

	private

	def set_comment
		@blog_comment = BlogComment.find(params[:id])
	end

	def comment_params
		params.require(:blog_comment).permit(:content, :user_email, :blog_id)
	end
end  
