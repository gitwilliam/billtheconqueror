---
title: "Tic-Tac-Toe with Angular 6 and Firebase – Part 6 – Join Game"
date: 2018-08-04 03:41:41
---

# Overview

In this short article I will add the ability for a user to join a game given a game ID.  In the [previous](http://billtheconqueror.wordpress.com/2018/07/26/tic-tac-toe-with-angular-6-and-firebase-part-5-new-game/) Tic-Tac-Toe article I added the ability for a user to create a new game.  At this point these are basic features, and future development will be needed to build them up more.  In this post I will also add an initial game-board on the dashboard.

# Gameboard

To manage the visualization of the game-board I created a new component, *game-board.component.ts *using the Angular CLI.  For a quick and dirty board I added 9 Bootstrap buttons in a grid and bound them to a *play() *method.  The text in the button will be the current state of that board location (i.e. "X" or "O").

Here is the *playPiece()* method added to the games service.

[code language="javascript"]
playPiece(pos: number, piece: string): Promise {
    return new Promise((res, rej) => {
      this.getBoard().then(o1 => {
        this.getGame().then(o2 => {
          let newBoard = o1;
          newBoard[pos] = piece;
          this.db.object(`games/${o2}/board`).set(newBoard);
          res(newBoard);
        });
      });
    });
  }
[/code]

# Join a Game

To join a game the user needs to provide the game ID.  I added a new *Join Game* button with a text field.  The *joinGame() *method added to the game service simply writes the game ID to the users space in the database.  I am also writing the users' ID to a turn object inside the game object in the database, to indicate whose turn it is.

[code language="javascript"]
  joinGame(id: string) {
    const uid = this.auth.getUserId();
    this.db.object(`users/${uid}`).update({
      game: id
    });

    this.db.object(`games/${id}/turn`).set(uid);
  }
[/code]

# Conclusion

In this post I added an initial attempt at displaying/interacting with a game-board and a join game option.  All the source code up to this point can be found on [GitHub](https://github.com/gitwilliam/tic-tac-toe/tree/Part6).
