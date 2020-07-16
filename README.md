# nodejs-rest-api
A node rest api with several endpoints.http://localhost:3001/login

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

***

## **<ins>App run details</ins>**

### **Get started**

- Clone repo. 
- `npm install` in root
- Have rest application handy(Postman, Insomnia).

note:  The csv data file was converted to json for ease of use and placed in the /data directory.  What is checked in is a small sample file as full file was too huge to push to github.  The full file can be dropped into this directory for fully testing the api.  I provided a share link to this in a separate email.


## **<ins>Available Scripts</ins>**

In the project directory, you can run:</br>

### `npm start`

Runs the application api in the development mode with nodemon for watching changes. (port 3001).  Also starts the auth server for token creation. (port 3000)

### `npm test`

Launches Mocha/Chai testing framework.  Two tests will run.

## **<ins>Rest calls</ins>**

### **Token creation**
rest type: GET</br>
url: http://localhost:3001/login</br>
authorization type:  none (inherit from parent)</br>
body: </br>
{</br>
    "username":"[name]",</br>
    "password":"[password]"</br>

}</br>
example:  </br>

http://localhost:3001/login  </br>
body - {"username":"john","password":"password123admin"}</br>

---

### **Return data for one station given station id**
rest type: GET</br>
url: http://localhost:3001/stations/(stationid)</br>
authorization type:  Authorization Bearer Token (retrieved from login call)</br>
example:  http://localhost:3001/stations/2  (will retrieve info for station 2)</br>

---

### **Stations by age group for given day**
rest type: GET</br>
url: http://localhost:3001/trips/age</br>
query params:  trip_date, station_id</br>
authorization type:  Authorization Bearer Token (retrieved from login call)</br>
example:  http://localhost:3001/trips/age?trip_date=2019-04-01&station_id=54&station_id=56</br>

---

### **Last 20 trips for a given station or stations for a given day**
rest type: GET</br>
url: http://localhost:3001/trips/last</br>
query params:  trip_date, station_id</br>
authorization type:  Authorization Bearer Token (retrieved from login call)</br>
example:  http://localhost:3001/trips/last?trip_date=2019-04-01&station_id=54&station_id=56</br>

---

### **All stations**
rest type: GET</br>
url: http://localhost:3001/stations</br>
authorization type:  Authorization Bearer Token (retrieved from login call)</br>
example: http://localhost:3001/stations</br>

***

## **<ins>Docker</ins>**

Docker file is included at the root of the project.