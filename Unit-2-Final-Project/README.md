# Calorie Counter Application
Have you ever wanted to have the ability to track your calories without any of the ads? With this Calorie Tracker application, you have the ability to track your dietary needs, calculate your daily logged food items, and see
all of your previously logged food items on one screen. Most importantly, it's easy to use and there are no ads! You can create multiple user's for each person that uses the application and alway's have information on your own database.
We are continuing to work on the application to create a full scale fitness app for all of your fitness needs. A fitness app made by a fitness nerd, who want's more from a fitness application.

---

## 🛠️ Tech Stack

**Frontend**:  
- JavaScript  
- React.js  
- Tailwind CSS  

**Backend**:  
- Java  
- Spring Boot  

**Database**:  
- PostgreSQL

---



# How to download the application:

1) Ensure the following technology stack is downloaded. 
2) On PostGresSQL, create your database/server. Remember the username, password, and the server url. 
3) On your Java IDE, download the "Finished-Back-End" branch and create a application.properties file. Within the application.properties file, add your Postgres detail's as such:
    1) spring.application.name
    2) spring.datasource.url= {postgresserverlink}
    3) spring.datasource.username={Username}
    4) spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
    5) Type the below exactly like this:
        spring.jpa.hibernate.ddl-auto=update
        spring.jpa.show-sql=true
        spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

    HERE IS AN EXAMPLE OF THE application.properties file: 
     spring.application.name=Final-Project

   UPDATE URL TO MATCH DATABASE URL AND NAME.
    spring.datasource.url=jdbc:postgresql://localhost:5432/Final_Project_2
    spring.datasource.username=username12345
    spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
    
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

4) On your Java IDE, make sure the nessessary dependancies are added for SpringBoot Web.
   SpringBoot Web Dependancy:
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
4) On your JavaScript + React IDE, download the "Finished-Front-End" branch, download react and/or fix react.
   For further information regarding downloading React on the Finished-Front-End branch go to the following link or React's website for more information: https://react.dev/learn/creating-a-react-app
5)  Run the PostGresSQL server, the FinalProjectApplication.java (under the Finished-Back-End branch), and type npm run dev in the terminal of your front-end IDE to start the front-end application
     (After running the front-end React application make sure to open the local-host link!).
7)  The application will be running and you will be brought to a login page. Since there are no current user's created, you will have to create an account.
     If you would like additional information how the application works, you can click on the How It Works page for further information.


# Want to see how the Models are connected on the backend? Click on this link:
https://dbdiagram.io/d/Copy-of-Final-Project-2-68924f78dd90d1786593b7ba

# Want to see our wire frames while creating the app? Click on this link: 
https://excalidraw.com/#json=6s2UiUNDbJDC_IdT-QUyD,TWNTMLp1cLXP5hj51yNgdQ


# We want to keep working on this application until it is every fitness user's dream app. 
Future features: 
- Adding API's for fast and easy logging
- Adding a workout portion to track your lifts
- Adding a dark mode (Everyone loves dark mode!)
- Adding an AI to assist in logging user's items for recipes that may not currently exsist in an API or manual tracking.
- And many more! (Want to see what we are currently working on? Try out our application and click on the "About Us" page to learn more!)
