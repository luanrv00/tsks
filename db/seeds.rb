# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
#user = User.create({id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", email: "registered@api.com", password: "s"})
user = User.create({id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", email: "registered@api.com", password: "s", refresh_token: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJlZ2lzdGVyZWRAYXBpLmNvbSJ9.pzCMeVlhGKmwzS9KCJ3P9ubwz5pbc2DzwWqfHdGpkn4"})
user.save!
user.tsks.create({id: 13, tsk: "t", status: "todo", created_at: "2023-05-29 01:56:56", updated_at: "2023-05-29 01:56:56"})
user.save!
user = User.create({email: "missingrefreshtoken@api.com", password: "s"})
user.save!

