Rails.application.routes.draw do
  namespace :v1 do
    post "/signup", to: "signup#create"
    post "/signin", to: "signin#create"
    resources :tsks
  end
end
