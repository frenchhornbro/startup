# (notes.md)[/notes.md]
Startup specification: an elevator pitch, key features, a description of how you will use each technology, and design images.

## Elevator pitch:
When you're out on your own at college, it's important to make sure your finances are straight to avoid getting yourself into trouble. Budgie, the budgeting application, is a simple tool for helping you keep track of your income and expenses in an organized manner. Budgie allows you to set a plan of your projected income and expenses as well as functionality to track how you're actually doing at it. Have kids that want to learn to manage their money? You can see their plan and how well they're keeping up at it. No more making spreadsheets -- get that peace of mind of a budget that is simple to create and accessible from anywhere.

## Design
![Projected](readme_imgs/Projected.png)

![Actual](readme_imgs/Actual.png)

## Key Features
- Create an account / login
- Two Budgets: Projected budget and actual budget
- Add sources of income / expenses
- Edit each category in the table
- Change the view to see from a month to a year at a time
- Net Gain/Loss and Total Savings calculated and displayed
- See budgets of other users (if permission is given)
- Budgets are persistently stored for each user

## Technology
Here's how the technology will be used:
- **HTML** - HTML will provide structuer for the pages. 4 HTML pages: Login, Projected Budget, Actual Budget, and Family tab
- **CSS** - 
- **JavaScript** - 
- **Service** - 
- **Database/Login** - Store users, potential budgets, and actual budgets in database. Create an account and login users. Store credentials securely in database. Can't procedd to budget pages without logging in.
- **WebSocket** - Access to other accounts
- **React** - Application ported to use the React web framework.    <--! This is copied, should I say anything else? -->

### (Include how you'll use technology)

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