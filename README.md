# Budgie
## Elevator pitch:
When you're finally out of the house on your own, it's important to make sure your finances are straight to avoid getting yourself into trouble. Budgie, the budgeting application, is a simple tool for helping you keep track of your income and expenses in an organized manner. Budgie allows you to set a plan of your projected income and expenses as well as functionality to track how you're doing at keeping up to your plan. Have kids that want to learn to manage their money? You can see their plan and how well they're keeping up at it. No more manually making spreadsheets -- get that peace of mind of a budget that is simple to create and accessible from anywhere.


## Design
**Login Page:**

![Login](readme_imgs/Login.png)

**Projected Page:**

![Projected](readme_imgs/Projected.png)

**Actual Page:**

![Actual](readme_imgs/Actual.png)

**Family Page:**

![Family](readme_imgs/Family.png)


## Key Features
- Create an account / login
- Two Budgets: Projected budget and actual budget
- Add sources of income / expenses
- Edit each category in the table
- Change the view to see from a month to a year at a time
- Net Gain/Loss and Total Savings calculated and displayed
- See budgets of other users (if they accept)
- Budgets are persistently stored for each user


## Technology
Here's how the technology will be used:
- **HTML** - HTML will provide structuer for the pages. 4 HTML pages: Login, Projected Budget, Actual Budget, and Family page
- **CSS** - Make application work with different screen sizes, use of color, decorating login screen
- **JavaScript** - Adds functionality to buttons, performs calculations, calls APIs, provides login
- **Web Service** - Login service, Bird images inserted through an API for the login screen, if I can get it to work (and if it's legal) I'll try to pull info directly from the user's bank to auto-populate the Actual Budget
- **Database/Login** - Store users, potential budgets, and actual budgets in database. Create an account and login users. Store credentials securely in database. Can't proceed to budget pages without logging in.
- **WebSocket** - Access to other accounts and chatting
- **React** - React will be used for web framework