Rails.application.routes.draw do
  namespace :v1 do
    post "/register", to: "register#create"
    post "/login", to: "login#create"
    resources :tsks
  end
end
