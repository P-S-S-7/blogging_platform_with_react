class BlogsController < ApplicationController
	before_action :set_blog, only: %i[show update destroy]

	def new
		@blog = Blog.new
	end

	def index
		@blogs = Blog.includes(:user).all

		respond_to do |format|
			format.html
			format.json { render json: @blogs.as_json(include: { user: { only: [:email] } }) }
		end
	end

	def show
		respond_to do |format|
			format.html
			format.json do
				render json: {
					blog: @blog.as_json(include: { user: { only: [:email] } }),
					comments: @blog.blog_comments.as_json(include: { user: { only: [:email] } })
				}
			end
		end
	end

	def create
		user = User.find_by(email: params[:blog][:userEmail])

		if user.nil?
			render json: { errors: 'User not found' }, status: :not_found
		else
			@blog = user.blogs.build(blog_params.except(:userEmail))
			if @blog.save
				render json: @blog, status: :created
			else
				render json: { errors: @blog.errors.full_messages }, status: :unprocessable_entity
			end
		end
	end

	def update
		respond_to do |format|
			if @blog.update(blog_params)
				format.json { render json: { blog: @blog.as_json(include: { user: { only: [:email] } }) }, status: :ok }
				format.html { redirect_to @blog, notice: 'Blog was successfully updated.' }
			else
				format.json { render json: { errors: @blog.errors.full_messages }, status: :unprocessable_entity }
				format.html { render :edit, status: :unprocessable_entity }
			end
		end
	end

	def destroy
		if @blog.destroy
			render json: { message: "Blog deleted successfully" }, status: :ok
		else
			render json: { errors: "Failed to delete blog" }, status: :unprocessable_entity
		end
	end

	private

	def set_blog
		@blog = Blog.find(params[:id])
	rescue ActiveRecord::RecordNotFound
		render json: { error: "Blog not found" }, status: :not_found
	end

	def blog_params
		params.require(:blog).permit(:title, :description, :userEmail)
	end
end
