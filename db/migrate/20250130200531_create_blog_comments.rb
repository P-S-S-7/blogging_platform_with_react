class CreateBlogComments < ActiveRecord::Migration[6.1]
  def change
    create_table :blog_comments do |t|
      t.string :content

      t.timestamps
    end
  end
end
