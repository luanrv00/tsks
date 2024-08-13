Rails.application.routes.draw do
  namespace :v1 do
    post "/signup", to: "signup#create"
    post "/signin", to: "signin#create"
    post "/refresh_token", to: "refresh_token#create"
    resources :tsks
  end
end
