---
title: "Tic-Tac-Toe with Angular 6 and Firebase – Part 4 – Logout"
date: 2018-07-23 18:44:59
---

#  Overview

In this short article I will add the logout feature to the tic-tac-toe Angular/Firebase application.  Once the user authenticates, I will also automatically route the user to the dashboard.  In the [previous](http://billtheconqueror.wordpress.com/2018/07/18/tic-tac-toe-with-angular-6-and-firebase-part-3-add-routing/) post, I added routing and a route-guard.

# Route to Dashboard on Login

A simple change to the login component will allow the user to land in the dashboard upon successfully login.  The login component will now depend on the router (as a constructor parameter).  I updated the successful path of the `signInWithEmail` method of our auth service to route to the dashboard.

[code language="javascript"]

signInWithEmail() {
   this.auth.signInWithEmail(this.email, this.password)
      .then(u => this.router.navigate(["dashboard"]))
      .catch(err => console.log(err));
}

[/code]

# Logout

I added a logout button to the dashboard.  I added a method to AuthService  called `signOut` which wraps the Firebase authentication service call `signOut`. The dashboard will now depend on the AuthService.

After logging out the dashboard component will route the user back to the login screen.

# Conclusion

As in previous posts, the code snippets are not exhaustive, but the full source up to this point can be found [here](https://github.com/gitwilliam/tic-tac-toe/tree/Part4).
