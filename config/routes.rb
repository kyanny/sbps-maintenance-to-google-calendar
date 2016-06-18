Rails.application.routes.draw do
  resources :root, only: [:index, :create]
  root 'root#index'
end
