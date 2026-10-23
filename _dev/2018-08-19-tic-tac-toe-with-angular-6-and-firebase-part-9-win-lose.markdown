---
title: "Tic-Tac-Toe with Angular 6 and Firebase – Part 9 – Win/Lose/Deploy"
date: 2018-08-19 02:28:46
---

# ![](/assets/images/dev/canva-tic-tac-toe-empty-fields-puzzles-play.jpg)

# Overview

In the first Tic-Tac-Toe using Angular/Firebase post, I had listed the following basic requirements,

	- A user that is currently logged out should be able to login
	- A user that is currently logged in should be able to logout
	- A user that is logged in should be able to create a new game
	- A user that is in a game should be able to invite another user to play
	- A user should be notified when they have won or lost a game

After, implementing all of the above features, I now recognize that I should have added more to the list.  These are features which I also implemented,

	- A user's move should be rejected if it is out of turn
	- A user should be able to end a current game
	- A user should be able to register as a new user

This post described some of the last tasks, including checking for a win/loss and allowing a user to register.  I also deployed the application (it can be found [here](https://test-tic-tac-toe-6cf88.firebaseapp.com)).

# Win/Loss

## Back-End

I added a couple new Cloud Functions to the backend.  The ` checkWin()` function currently takes a brute force approach to determining if the current move should result in a win (or a cat's scratch).

[code language="javascript"]
/*
* Check for a Win or Draw
*/
exports.checkWin = functions.database.ref('/games/{gameId}/board/{position}')
    .onUpdate((snapshot, context) => {
        const promises = []
        promises.push(snapshot.after.ref.parent.once('value').then(b => {
            let win = false;
            const board = b.val();

            // check for a horizontal win
            if (board[0] === board[1] && board [1] === board[2] && board[0] !== "") {
                win = true;
            } else if (board[3] === board[4] && board [4] === board[5] && board[3] !== "") {
                win = true;
            } else if (board[6] === board[7] && board [7] === board[8] && board[6] !== "") {
                win = true;

            // check for a veritcal win
            } else if (board[0] === board[3] && board[3] === board[6] && board[0] !== "") {
                win = true;
            } else if (board[1] === board[4] && board[4] === board[7] && board[1] !== "") {
                win = true;
            } else if (board[2] === board[5] && board[5] === board[8] && board[2] !== "") {
                win = true;

            // check for a diagonal win
            } else if (board[0] === board[4] && board[4] === board[8] && board[0] !== "") {
                win = true;
            } else if (board[2] === board[4] && board[4] === board[6] && board[2] !== "") {
                win = true;
            }

            let cat = !win;
            if (cat) {
                // check for Cat's Scratch
                board.forEach(element => {
                    if (element === "") {
                        cat = false;
                    }
                });
            }

            if (win || cat) {
                // delete turn, so that nobody can play
                promises.push(snapshot.after.ref.parent.parent.child('turn').remove());

                // add winner
                if (cat) {
                    promises.push(snapshot.after.ref.parent.parent.child('winner').set('cat'));
                } else {
                    promises.push(snapshot.after.ref.parent.parent.child('winner').set(context.auth.uid));
                }
            }
        }));

        return Promise.all(promises);
    });
[/code]

# Register

To register a new user I created a new component.  It looks much like the login component, only it requires a new user to enter their password twice, for verification.  After selecting register, the user is taken directly to the Dashboard.

# Firebase Deployment

I was amazed at how easy it is to deploy the front-end in Firebase.  I followed the official Firebase [directions](https://firebase.google.com/docs/hosting/deploying).  The app can be found [here](https://test-tic-tac-toe-6cf88.firebaseapp.com).  Additionally, I added my database rules to my back-end Cloud Function repository, and they are now configured to deploy.

# Conclusion

All the source code up to this point for the Angular application can be found on [GitHub](https://github.com/gitwilliam/tic-tac-toe/tree/Part9).  Likewise, the source for the Cloud Functions and Datbase Rules up to this point can be found on [GitHub](https://github.com/gitwilliam/tic-tac-toe-functions/tree/Part9).
