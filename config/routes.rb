Rails.application.routes.draw do
	devise_for :users		

	root "blogs#index"

	resources :blogs do
		resources :blog_comments, only: [:create, :destroy]
		get 'blog_comments/:id', to: 'blog_comments#destroy', as: 'destroy_blog_comment'
	end
end
