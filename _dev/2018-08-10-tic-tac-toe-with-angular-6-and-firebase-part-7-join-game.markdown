---
title: "Tic-Tac-Toe with Angular 6 and Firebase – Part 7 – Join Game"
date: 2018-08-10 01:41:08
---

# ![](/assets/images/dev/canva-tic-tac-toe-empty-fields-puzzles-play.jpg)

# Overview

In this short article I will add the ability for a user to end the game that they are in.  In the [previous](http://billtheconqueror.wordpress.com/2018/08/04/tic-tac-toe-with-angular-6-and-firebase-part-6-join-game/) Tic-Tac-Toe article I added the ability for a user to join a game.  Between the last post and this one I have also refactored how the state of the game is managed.  I am making using of [Observables](http://reactivex.io/documentation/observable.html) more.  I investigated using [ngrx/store](https://github.com/ngrx/store), but have decided to keep the application simple - and not try to bite off more than I can chew at this time.  I also refactored the layout to give the UI a *little* more appeal.

# End Game

## Front-End

Adding basic "End Game" functionality was straightforward on the front-end.  After placing a new button on the UI, it was simple call to the GameService, and in turn a simple call to delete the GameID and all its children from the database.

[code language="javascript"]
  // in game.service.ts
  deleteGame(): void {
    this.db.object(`games/${this.gameId}`).remove();
  }
[/code]

## Back-End

I also took this as an opportunity to add in a [Cloud Function](https://firebase.google.com/docs/functions/).  I created a simple function that watches for a game deletion.  Upon deletion, the function grabs the User IDs of the game participants and removes them both from the game (deleting the Game ID from their user space in the database).

[code language="javascript"]
exports.endGame = functions.database.ref('/games/{gameId}')
    .onDelete((snapshot, context) => {
        let promises = []
        if (snapshot.hasChild('user1')) {
            promises.push(snapshot.ref.root.child('users').child(snapshot.child('user1').val()).child('game').remove());
        }
        if (snapshot.hasChild('user2')) {
            promises.push(snapshot.ref.root.child('users').child(snapshot.child('user2').val()).child('game').remove());
        }
        return Promise.all(promises);
    });
[/code]

The above function checks to see if a user1 or user2 exists in the game, if they do then it attempts to delete the game reference for their user space.  I have been impressed with how easy it has been to create and deploy Cloud Functions.

# UI Changes

Here is a screen capture of the UI up to this point.

![](/assets/images/dev/screenshot-from-2018-08-09-20-22-23.png)

# Conclusion

All the source code up to this point for the Angular application can be found on [GitHub](https://github.com/gitwilliam/tic-tac-toe/tree/Part7).  Likewise, the source for the Cloud Function up to this point can be found on [GitHub](https://github.com/gitwilliam/tic-tac-toe-backend/tree/Part7).
