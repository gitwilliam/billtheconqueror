---
title: "Tic-Tac-Toe with Angular 6 and Firebase – Part 3 – Add Routing"
date: 2018-07-18 03:10:19
---

# Overview

In [Part 2](http://billtheconqueror.wordpress.com/2018/07/17/tic-tac-toe-with-angular-6-and-firebase-part-2-adding-login/) of this series I added basic e-mail/password authentication with Firebase.  In this post I will add a router to the application.  I will first create the router, and then a new component that should only be accessible to a user who is authenticated.  This can be accomplished through the use of a router guard.

# Adding the Router

As in many of the features that Angular provides, create a new routing module can be done through the Angular CLI.

`> ng generate module app-routing --flat --module=app `

The --flat flag forces the file generated to be place in the root of the src/app tree, and --module=app tells the CLI to add registration to the App's top level module imports.  The official Angular [tutorial](https://angular.io/tutorial/toh-pt5) provides excellent documentation on adding routes to the new AppRouting module, and including a routing outlet in a template.  Check out [GitHub](https://github.com/gitwilliam/tic-tac-toe/tree/Part3) for the full source up to Part 3.

In the AppRouting module I created the default (empty string) route as the LoginComponent.

# Route Guard

Using the Angular CLI, I created a dashboard component and added a simple route to the routes array in the AppRouting module.

`{ path: 'dashboard', component: DashboardComponent }`

If a user has not authenticated, I would like to prevent them from being able to access the dashboard.  In order to accomplish this, I added a route guard to the dashboard route.

`> ng generate guard is-authenticated`

The IsAthenticatedGuard will extend the [canActivate](https://angular.io/api/router/CanActivate) interface, and this is actually what the CLI does by default.  The guard should return true if the current user is authenticated, therefore the guard depends on the AuthService.  I also added a dependency on the Router so that we can easily route the user to the login page if they attempt to access a restricted page without being authenticated.

Opening a new incognito Chrome browser, and navigating to localhost:4200/dashboard now forces me to the login screen.  After logging in, I am now able to get to the localhost:4200/dashboard.

# Conclusion

In this post I described at a high level the addition of a router, and a route guard to the Angular application.  The full source can be found [here](https://github.com/gitwilliam/tic-tac-toe/tree/Part3). For additional, and most assuredly better, reading go [here](https://angular.io/tutorial/toh-pt5) and [here](https://angular.io/guide/router).
