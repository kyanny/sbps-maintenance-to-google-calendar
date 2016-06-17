require_relative 'app'
require 'sinatra'
require 'pp'

get '/' do
  redirect 'https://github.com/kyanny/sbps-maintenance-to-google-calendar'
end

post '/' do
  pp params

  'OK'
end
