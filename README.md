project title - Banking Account Management System
this is ready to use project, build using java + angular and for database MySQL,
and finally been deployed on the azure
in this project there are basically 3 options as to login as user, manager and admin
users are there to take the services of the bank of widthdraw, transfer, check balance and balance history,
in the manager dashboard there are 3 option to see the account, to create the account, and to see the transaction
in the admin dashboard there are lot of options that comes up

in the backend we have used spring security and jwt for login, and there is a token expring currently set to 10 hours. anyone willing to use this project can set this expring time accordingly.
if you change the port for angular then in the cors also you need to change it. but better recomended not change remain the default port for every application


IMPORTANT POINTS TO NOTE FOR CONNECTION AND THE CHANGES TO DO BEFORE USING IT.

in the application.properties file give replace the azure endpoints with localhost:3306 and create one database with name bankingdb in the database.
in the angular services replace the azure domain name with your localhost:8080  changes this accordingly if you are using some different port then use that instead.
make sure that first run the backend
for running the angular there can be two ways if you are using vs code then ypu can run from there also by using the run button or u can just type the command (ng serve -o) in the in the frontend directory.

now it will run succesfully 

by chance if you get any error in the application just right click and go to inspect you will find the error there and try to fix it out 
and remember errors give you more teaching than anything else so try to solve it by your own, if you don't have time limit. 


