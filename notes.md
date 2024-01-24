myfinancialbudgie.click
# Route 53
## Getting a domain name:
- AWS console > log in
- Navigate to Route 53
- ```Domains > Registered domains```
- Input the name you want
- Make the purchase (select whether or not you want to auto-renew)
- Respond to the email if one is sent
Afterwards you can use the ```whois``` command to see your information (unless you turned on privacy protection)

## Tie domain name to your IP address:
- AWS console > login
- Navigate to Route 53
- ```Hosted zones``` (should see your domain there, unless it's still pending)
- Click on your domain
- ```Create record```
- Keep subdomain blank
- Record Type A
- Put public IP address in Value box
- ```Create records```
To map subdomains, go from this point and continue with the following:
- ```Create record```
- \* for Record name
- Record type A
- Put public IP address in Value box
- ```Create records```

# Starting a Server:
## Creating an AWS server instance:
- AWS console > log in
- Navigate to EC2
- Change location (top right) to N Virginia
- ```Launch instance```
- Name the instance
- Use a provided image (AMI for this class: ```ami-0b009f6c56cdd83ed```)
- Select t2.micro (free) or something else with more computing power
- Create new key pair (or use pre-existing one) -- this functions as a password to be able to ssh into your server
- ```auto-assign public IP```
- ```Create security group```, allow SSH, HTTP, and HTTPS (or can select existing one)
- Unlimited credit specification allows server to be up even with higher traffic (includes small fine)
- ```Launch instance```

## Command to ssh into the server:
```ssh -i "C:\Users\htdur\.ssh\cs-260-aws\Startup - BYU CS260.pem" ubuntu@18.207.28.91```

## Creating an Elastic IP address:
This allows you to stop your server without the IP address changing (charges per hour it's not running)
- AWS console > log in
- Navigate to EC2
- Left Menu > ```Network & Security | Elastic IPs```
- ```Allocate Elastic IP address```
- ```Allocate```
- Select new address > ```Actions``` > ```Associate Elastic IP address```
- Select server in ```Instance```
- ```Associate```

# Technologies
HTML - Basic structural and organizational elements
CSS - Styling and animating
JavaScript - Interactivity (e.g. What happens when a user presses a button)
Web service - Remote functions that your application calls on your, or someone else's, web server (e.g. saveScores, getWeather, chatWithFriend)
Authentication - Creating accounts and logging in
Database persistence - Storing user data in a database (e.g. Save the high scores and login information)
WebSocket - Support for pushing data from the server. This can be peer to peer communication (e.g. chatting with friends through the browser), or realtime data from the server (e.g. stock prices or the current game leader).
Web framework - Using React to add components and request routing

# Solving Merge Conflicts
Merge conflicts: Person A pulls, Person B pulls, Person A changes line 1, commits, pushes. Person B changes line 1, commits, pushes. This will cause an error.
**Solution:** Person B must pull and resolve the lines that are overlapping (which will be clearly highlighted), then commit and push.

# Markdown notes
Hashtags are headings (1-6). GitHub makes a table of contents for multiple headings. The following are examples of possible formatting in Markdown (see Code to view how they're done):

**Bold**, __Also Bold__, *Italic*, _Also Italic_, **_Bold + italic_**
~~Strikethrough~~, <sub>Subscript</sub>, <sup>Superscript</sup>

> quote

`git status`    <-- call out code, can be used to call out colors such as `#ffe021`

```code in it's own block```

[link](learn.cs260.click)

![image](https://upload.wikimedia.org/wikipedia/en/4/49/Creeper_%28Minecraft%29.png)

<!--comments, won't appear in Markdown--> <-- this comment doesn't appear in markdown
\*ignore\_markdown\_formating\*

## Lists
+ List element 1
+ List element 2
- List element 3
- List element 4
* List element 5
* List element 6
- This
  - Is
    - A
      - Nested
        - List
- [ ] task list
- [x] completed item
- [ ] incomplete item

Here's a footnote[^1]
[^1]: Reference

## Special blockquotes:
> [!NOTE]
> This is a note

> [!TIP]
> This is a tip

> [!IMPORTANT]
> This is important

> [!WARNING]
> This is a warning

> [!CAUTION]
> Caution