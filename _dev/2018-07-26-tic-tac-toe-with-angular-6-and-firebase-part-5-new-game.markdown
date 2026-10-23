---
title: "Tic-Tac-Toe with Angular 6 and Firebase – Part 5 – New Game"
date: 2018-07-26 03:49:35
---

# Overview

In this short article I will add the ability for a user to create a new game.  The main feature that will be demonstrated is writing to the Firebase real-time database.

# New Game

I added a button on the dashboard to allow a user to initiate a new game.  In a later effort I will make the UI look better, but for now I am focusing on the functionality.  The New Game button is bound to the newGame() method added to the dashboard component.  I created a new service for game management, and added it as a dependency to the dashboard.

[code language="javascript"]
  // from game service
  newGame(): void {
    const uid = this.auth.getUserId()
    let gameId = "";

    this.db.database.ref(`users/${uid}/game`).once('value').then(s => {
      if (!s.exists()) {
        gameId = require('shortid').generate();

        // writing to database
        this.db.object(`games/${gameId}`).update({
          0: "", 1: "", 2: "",
          3: "", 4: "", 5: "",
          6: "", 7: "", 8: ""
        });

        this.db.object(`users/${uid}`).update({
          game: gameId
        });
      }
    });
  }
[/code]

The method above first checks to see if the user is currently in a game.  It will only create a new game if they are not.  Later this may be changed to include deleting a current game.

I also added a method to get the current game ID that a user is in.  The method returns an Observable string that is the ID of the current game (if it exists).

[code language="javascript"]
// from game service
getGame(user: string): Observable {
  return new Observable(obs => {
    this.db.database.ref(`users/${user}/game`).once('value').then(s => {
      if (!s.exists()) {
        obs.next("");
      } else {
        obs.next(s.val());
      }
    });
  });
}
[/code]

I am using the npm [shortid](https://www.npmjs.com/package/shortid) package to generate an identifier for each new game.  I also added a new field to the UI to display the unique ID.  In the future, a player can share the game ID with a friend as a method for setting up multi-player.  The interpolation in the dashboard template for the Game ID was not consistently working.  I applied one of the methods found [here](https://stackoverflow.com/questions/36919399/angular-2-view-not-updating-after-model-changes) and [here](https://stackoverflow.com/questions/34827334/triggering-change-detection-manually-in-angular).  I will need to try and figure out why the (click) event on New Game is not triggering a change detection.

[code language="javascript"]

// from dashboard
newGame(): void {
  this.games.newGame();
  this.games.getGame(this.auth.getUserId()).subscribe(o => {
    this.gameId = o;
     // For some reason this code is breaking outside of Angular change detection
    this.change.detectChanges();
  });
}
[/code]

Selecting the "New Game" button puts a new entry in the Firebase Real-Time database, and updates the dashboard with the Game ID.

![](/assets/images/dev/datatictactoe1.png)

# Conclusion

The code snippets are not complete, but the full source code up to this point can be found on [GitHub](https://github.com/gitwilliam/tic-tac-toe/tree/Part5).  Keep in mind that as I learn, how the data and code is structured could drastically change.

[Here](https://blog.thoughtram.io/angular/2016/02/01/zones-in-angular-2.html) is an article on when Angular decides to update the view.
