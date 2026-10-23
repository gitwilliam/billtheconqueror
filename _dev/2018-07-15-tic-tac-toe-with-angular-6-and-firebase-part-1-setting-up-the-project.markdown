---
title: "Tic-Tac-Toe with Angular 6 and Firebase - Part 1 - Setting Up The Project"
date: 2018-07-15 04:13:38
---

# Overview

In this project I will develop a simple multiplayer tic-tac-toe game using Angular 6 and Google Firebase.  I have played around quite a lot with both Angular and Firebase, but have never brought a project to completion and deployment.  I plan to bring this to deployment, with some very simple features.

	- A user that is currently logged out should be able to login
	- A user that is currently logged in should be able to logout
	- A user that is logged in should be able to create a new game
	- A user that is in a game should be able to invite another user to play
	- A user should be notified when they have won or lost a game
	- A user

The features could change of course, as I learn more.  And, per the [Agile Manifesto Principles](http://agilemanifesto.org/principles.html), that would be welcome.

For development I am using [Visual Studio Code.](https://code.visualstudio.com/)

For tips on installing and setting up a new Angular project, visit the [Angular Quick Start Guide](https://angular.io/guide/quickstart).  You will also need [Node.js and npm](https://nodejs.org/en/download/).

# Create a New Project

The `new` command in the Angular CLI generates a new project with a default structure.

`> ng new tic-tac-toe`
`> ng serve --open `

The `serve --open` command should open a tab in your default browser to `localhost:4200`.

Executing `ng test` runs the tests (in Angular the tests are written in the *.spec.ts files).

At the time of creating this project, the version of the Angular CLI that I was using (6.0.8) generated default unit tests that failed. The test expected static content with the words "Welcome to tic-tac-toe!", but the application actually rendered "Welcome to app!".  I corrected this by changing the test. After executing the tests again, they passed.

# Install Bootstrap 4

I decided to use [Bootstrap 4](https://getbootstrap.com/docs/4.0/getting-started/introduction/) for styling.

`> npm install --save bootstrap`

After installing bootstrap, add a reference to the bootstrap.min.css file into angular.json.

`"styles": [
"node_modules/bootstrap/dist/css/bootstrap.min.css",
"src/styles.css"
]`

# Install and Setup [Firebase](https://github.com/angular/angularfire2)

Create a new Firebase Project in the [Firebase Console](https://console.firebase.google.com/), and set the authentication method to basic e-mail/password.  Under the Authentication tab select WebSetup and copy the Firebase parameters into the environment/environment.ts file in the Angular app.

Using npm install the necessary dependencies for Firebase.

`> npm install --save firebase angularfire2`

No we are ready to start modifying the application!  All source code up to this point can be found [here](https://github.com/gitwilliam/tic-tac-toe/tree/Part1).

In the [next](http://billtheconqueror.wordpress.com/2018/07/17/tic-tac-toe-with-angular-6-and-firebase-part-2-adding-login/) part of this series, I add authentication.
