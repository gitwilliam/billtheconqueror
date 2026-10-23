---
title: "HuddleSync - a coordination app in Ruby on Rails"
date: 2022-03-24 12:47:43
---

I developed and deployed my first Ruby on Rails app the other day.  The result can be found at [https://huddlesync.com](https://huddlesync.com).  I have experience in other MVC frameworks (i.e. Laravel), but very little to none in RoR prior to this.

I deployed the application on both Heroku and Fly.io.  Although Heroku ended up being slightly easier to deploy, I settled on Fly.io due to them allowing a custom domain on their free-tier.

The idea behind the app (which is by no means unique), is to allow a group of people to find a convenient time to meet.  It is really just a voting app, but specific to meeting times.  After creating a new *Sync* the creator/admin can populate it with any number of time/date ranges.  The creator sends a "share" URL to the other interested parties.  They can enter their name, and vote on which times work for them.  The app keeps track of available attendees for each time.  An administrative URL is also created which the creator can keep to go back and add/remove time slots at a later date.

The app can be used for finding a good time for any reason a group (larger than 2 people) might be meeting.  It could be a board meeting, committee meeting, group of friends, school meeting, etc.

Work still needs to be done on it to prevent duplicate votes.  And there are a lot of additional features that could be added in the future.

[Check it out at https://huddlesync.com.](https://huddlesync.com)
