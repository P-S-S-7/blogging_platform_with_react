class AddUserAndBlogReferencesToBlogComments < ActiveRecord::Migration[6.1]
  def change
    add_reference :blog_comments, :user, null: false, foreign_key: true
    add_reference :blog_comments, :blog, null: false, foreign_key: true
  end
end
