# (notes.md)[/notes.md]
Startup specification: an elevator pitch, key features, a description of how you will use each technology, and design images.

## Elevator pitch (something that would sound cool to your friends) - 1 paragraph


## Sketch what the application looks like


## Include how you'll use technology

Technology: HTML, CSS, JavaScript, calling web services, providing web services, authentication, persistent data storage, and WebSocket

(listed required technology)
HTML: used for structure
CSS: used for style
JavaScript: used for interaction
Web Services: providing to(?) and accessing APIs
Authentication: login
Persistent Data Storage: ???	<-- maybe just storing user credentials and other data? Is this a database?
WebSocket: used for users interacting with each other

### From class page on technology
Authentication: An input for your user to create an account and login. You will want to display the user's name after they login.
Database data: A rendering of application data that is stored in the database. For Simon, this is the high scores of all players.
WebSocket data: A rendering of data that is received from your server. This may be realtime data sent from other users (e.g. chat or scoring data), or realtime data that your service is generating (e.g. stock prices or latest high scores). For Simon, this represents every time another user creates or ends a game.