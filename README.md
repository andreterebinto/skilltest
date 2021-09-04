# Platform skillTest

## Example

Platform developed to perform API consumption tests with demo in Dashboard.

#### Frameworks and tools used

As requested, openSources tools were used based on javascript, HTML and CSS described below:
- Bootstrap (Layout);
- Angular 9 (Framework Javascript);
- OpenLayers (Maps OpenSource);
- AMCharts (Javascript Dashboards);
- Docker (Container development)

#### API OpenWeather https://openweathermap.org/api

API that consists of returning JSON data of general weather from cities, countries and states.

## Installation

There are two ways to implement the demo application, as it was created to be started on the local machine, or by Docker container instance.

Access to the platform in both installations is:
**USER:** admin **PASSWORD:** 123456

#### First way

1- Install [Docker](https://www.docker.com/products/docker-desktop "Docker Download") locally or use environments that contain docker.
2- After installing docker create a file called docker-compose.yml on your local machine.
3- Copy and paste the code below into the file.
```json
version: '3'
services:
    server:
        image: andreterebinto/testapp:latest
        ports:
            - "80:80"
        tty: true
        expose:
            - "80" 
        stdin_open: true
        environment:
            - MODE=dev

```

4- Access your machine's terminal, and enter the folder where you saved the docker-compose.yml file
5- type the command "docker-compose up", with that the project will be executed.
6- Access the browser http://localhost
7- **USER:** admin **PASSWORD:** 123456

###### NOTE: If you can't create the file, it exists here in the project's repository, in the root folder.
-----

#### Second way

Requirements:
- Install nodejs - https://nodejs.org/en/
- Install Angular CLI - https://angular.io/


1- Download the project repository through Git Clone;
2- After cloning the project, access the page and give the command "npm install";
3- The command will install all project dependencies locally;
4- With the framework installed, give the command "ng serve";
5- Access the browser http://localhost:4200
6- **USER:** admin **PASSWORD:** 123456

## Helper

Caso não seja possível nenhuma maneira acima é possível baixar a imagem docker diretamente no dockerHub, com o seguinte comando.
```json
docker pull andreterebinto/testapp:latest
```




## Author

Andre Terebinto, andreterebinto@hotmail.com
