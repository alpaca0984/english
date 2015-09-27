ActiveAdmin.register Sentence do

# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
permit_params :book_id, :chapter_id, :number, :japanese, :english
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if resource.something?
#   permitted
# end
  active_admin_importable do |model, hash|
    model.create(book_id: hash[:book_id], chapter_id: hash[:chapter_id], number: hash[:number], japanese: hash[:japanese], english: hash[:english])
  end

end
