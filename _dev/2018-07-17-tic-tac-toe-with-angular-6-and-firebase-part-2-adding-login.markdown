---
title: "Tic-Tac-Toe with Angular 6 and Firebase - Part 2 - Adding Login"
date: 2018-07-17 02:15:47
---

# Overview

In [Part 1](http://billtheconqueror.wordpress.com/2018/07/15/tic-tac-toe-with-angular-6-and-firebase-part-1-setting-up-the-project/) of this series, I installed Bootstrap and Firebase into the tic-tac-toe app.  Adding basic authentication with Firebase is straight forward.  To add the login feature we will generate a new login component and a new authentication service.  For additional reading, [here](https://firebase.google.com/docs/reference/js/firebase.auth.Auth) is the Firebase documentation on the authentication service.

# Authentication Service

Using the Angular CLI, we can generate a new service.

`> ng generate service auth`

This will generate two files,

	- auth.service.ts
	- auth.service.spec.ts

Inside AuthService I am using an `Observable` to keep track of whether a user is authenticated.  The service uses the Firebase `onAuthStateChanged` to update the authenticated Observable with the next value.  Later we will see how the `isAuthenticated` method in AuthService is used to create a route-guard for allowing or denying access to certain routes. Additionally, I added a method to AuthService which takes an e-mail address and password as strings. This is a straight pass through to the Firebase `signInWithEmailAndPassword` method.  You can find the full source code for AuthService up to this point on [GitHub](https://github.com/gitwilliam/tic-tac-toe/tree/Part2).

# Login Component

Again, using the Angular CLI, we can quickly generate the new Login component.

`> ng generate component login`

I grabbed the [example login form](https://getbootstrap.com/docs/4.0/components/forms/) for Bootstrap, and bound the e-mail and password forms to members in the login component class.  For the data binding to work I had to add the FormsModule from @angular/forms to the imports of my main AppModule.  The LoginComponent consumes our previously created AuthService as a dependency in the constructor.  I added a single method, `signInWithEmail` which will in turn use the AuthService.  This will be called when the user selects the "Submit" button on the form, using the `(click)="signInWithEmail()"` construct in the template (*.html) file.  For now I am simply printing to the the console when a user is successfully authenticated (i.e. "<user-id> is authenticated!").

Trying out the login form with a test user I created in Firebase printed `5uv8QjYfDENrKDRtIcJQMI8ErFr2 is authenticated!`

Note, not all of the implementation details are described in these posts, but the full source code up to this point can be found [here](https://github.com/gitwilliam/tic-tac-toe/tree/Part2).  In the [next](http://billtheconqueror.wordpress.com/2018/07/18/tic-tac-toe-with-angular-6-and-firebase-part-3-add-routing/) post I add routing to the application.
