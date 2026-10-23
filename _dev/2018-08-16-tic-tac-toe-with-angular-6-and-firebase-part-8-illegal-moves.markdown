---
title: "Tic-Tac-Toe with Angular 6 and Firebase – Part 8 – Illegal Moves"
date: 2018-08-16 03:48:33
---

# ![](/assets/images/dev/canva-tic-tac-toe-empty-fields-puzzles-play.jpg)

# Overview

Since the [last](http://billtheconqueror.wordpress.com/2018/08/10/tic-tac-toe-with-angular-6-and-firebase-part-7-join-game/) Tic-Tac-Toe post, I have added a number of small features - and refactored a few things.

	- Prevent illegal moves
	- Disable/Enable buttons based on current game state

# Illegal Moves

## Back-End

I added a couple new Cloud Functions to the backend.  The ` joinGame()` function is straight forward. If a user joins a game, this function is responsible for setting the current turn data to the second user's ID.

` checkTurn()` is a little more complicated. It verifies that the user that played did not play out of turn. If the user did play out of turn, then the data is set back to its previous value. This generates a second call to `checkTurn()`. To protect against processing the function twice, I am checking whether ` context.auth` is defined. Although this check is not ideal, I ended up preventing invalid moves through database rules instead. I have left this function in for now, but it likely can be removed in the future.

[code language="javascript"]
/*
* Performs processing when a second user joins a game.
*/
exports.joinGame = functions.database.ref('/games/{gameId}/user2')
    .onCreate((snapshot, context) => {
        // set the current "turn" to the second user (guest gets first turn)
        return snapshot.ref.parent.update({turn: context.auth.uid});
    });

/*
* Validate and update whose turn it is
* NOTE: Although this method will still be called, there are now
*       rules in the database that should prevent an out of turn move.
*/
exports.checkTurn = functions.database.ref('/games/{gameId}/board/{position}')
    .onUpdate((snapshot, context) => {
        const promises = []

        // If a user attempts to play out of turn, we push the data the way it was.
        // This causes this function to be called again.  The second time it is called,
        // the context.auth data is undefined, but there should be a better way to tell.
        if (context.auth === undefined) {
            return null;
        }

        // set the current "turn" to the other user
        promises.push(snapshot.after.ref.parent.parent.once('value').then(d => {

            // verify that the user playing should be
            if (d.child('turn').val() === context.auth.uid) {
                if (d.child('user1').val() === context.auth.uid) {
                    promises.push(snapshot.after.ref.parent.parent.update({ turn: d.child('user2').val() }));
                } else {
                    promises.push(snapshot.after.ref.parent.parent.update({ turn: d.child('user1').val() }));
                }
            } else {
                // set it back to the previous value
                promises.push(snapshot.after.ref.set(snapshot.before.val()));
            }
        }));

        return Promise.all(promises);
    });
[/code]

## Database Rules

I added a couple database rules to prevent out of turn moves.  The following rules validate:

	- The user playing is user whose turn it is
	- The position on the board has not already been play one

[code language="javascript"]
"board": {
   ".validate": "!data.parent().child('turn').exists() ||
                 (data.parent().child('turn').exists() && data.parent().child('turn').val() === auth.uid)",
   "$pos": {
      ".validate": "!data.exists() || data.val().length == 0"
}
[/code]

# UI Changes

Lastly, I added functionality to enabled/disable buttons based on the current game state, and I added a new label to indicate whose turn it is.

![](/assets/images/dev/screenshot-from-2018-08-15-22-45-51.png)

# Conclusion

All the source code up to this point for the Angular application can be found on [GitHub](https://github.com/gitwilliam/tic-tac-toe/tree/Part8).  Likewise, the source for the Cloud Function up to this point can be found on [GitHub](https://github.com/gitwilliam/tic-tac-toe-backend/tree/Part8).  As this is a project in which I am learning, please comment with any suggestions or constructive feedback that you may have.
