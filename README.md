# PetFinder

[![(CI) PetFinder - FE](https://github.com/arturPukhavy/PetFinder-FE/actions/workflows/(CI)%20PetFinder%20-%20FE.yml/badge.svg)](https://github.com/arturPukhavy/PetFinder-FE/actions/workflows/(CI)%20PetFinder%20-%20FE.yml)
[![(CD) PetFinder - FE](https://github.com/arturPukhavy/PetFinder-FE/actions/workflows/(CD)%20PetFinder%20-%20FE.yml/badge.svg)](https://github.com/arturPukhavy/PetFinder-FE/actions/workflows/(CD)%20PetFinder%20-%20FE.yml)

PetFinder is a service for anyone looking to locate a pet using a chip number. This service is accessible on both desktop and mobile platforms, ensuring convenience and ease of use for all users. Whether you're a pet owner or someone who has found a lost pet, PetFinder makes it simple to find the pet's details quickly and efficiently with just the pet identification number.

<img src="https://github.com/user-attachments/assets/348353c5-9b48-4ecb-a772-9101dae09444" alt="Screenshot" width="300" height="500"/>
<img src="https://github.com/user-attachments/assets/0a646737-0798-4be1-87f1-e4e915880944" alt="Screenshot" width="300" height="500"/>

* https://petfinder-app.glitch.me/

### Test data
Use the following ID-numbers for testing:
* `111111111111111`
* `222222222222222`


## Used Technologies
* Capacitor
* Ionic
* Standalone Components
* HTTP Client
* Observable
* Services
* Dependency injection
* Models

## API

PetFinder utilizes a specially developed RESTful API to power its service. The API has been designed to meet the needs of the service. Additionally, an Open API specification has been created and is available here:
https://app.swaggerhub.com/apis/ARTURPUHICE_1/Pet_Finder_API/1.0.0#/default/getPetInfo

## Development environment

Angular allows to configure CLI dev-server proxy. This is an example of `proxy.conf.json` configuration:
```
{
   "/api/v1/**": {
      "target": "http://localhost:3000",
      "secure": false
   }
}
```
Use the following command to run dev-proxy:
```
ng serve --proxy-config proxy.conf.json
```
This configuration is ONLY for a development purpose, it should not be used in a production environment.

## Android

**Install Android Studio**
Install latest version from Android Studio [website](https://developer.android.com/studio).

**Install dependencies**:
```bash
npm install
```

**Build the Angular application**:
```bash
ng build
```

**Synchronize Capacitor with the Android project**:
```bash
npx cap sync android
```

**Open the Android project**:
```bash
npx cap open android
```
## Resourcses
* [About chipnumber](https://chipnummer.nl/over)
