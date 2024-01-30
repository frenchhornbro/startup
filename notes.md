*_myfinancialbudgie.click_*

# HTML notes:
## HTML Structure:
```Body```: has children ```header```, ```main```, and ```footer```
- ```Header```: contains a ```p```aragraph with a ```span```, and a ```navigation``` containing multiple ```div```isions of subcontent
- ```Main```: contains multiple ```section```s that contain an unordered list ```ul``` or a ```table```, and an ```aside``` for content that doesn't fit in with the sections
- ```Footer```: contains content ```div```ision with one ```span```
Example:
```
<body>
  <p>Body</p>
  <header>
    <p>Header - <span>Span</span></p>
    <nav>
      Navigation
      <div>Div</div>
      <div>Div</div>
    </nav>
  </header>

  <main>
    <section>
      <p>Section</p>
      <ul>
        <li>List</li>
        <li>List</li>
        <li>List</li>
      </ul>
    </section>
    <section>
      <p>Section</p>
      <table>
        <tr>
          <th>Table</th>
          <th>Table</th>
          <th>Table</th>
        </tr>
        <tr>
          <td>table</td>
          <td>table</td>
          <td>table</td>
        </tr>
      </table>
    </section>
    <aside>
      <p>Aside</p>
    </aside>
  </main>

  <footer>
    <div>Footer - <span>Span</span></div>
  </footer>
</body>
```
Link text goes _in between_ the tags
- Block element: Distinct block in the structure
- Inline element: Does not distrupt the flow of the block element (such as **bold** or _italics_)

- links: ```<a href="https:familysearch.org" />```
- images: ```<img alt=creeper src="https://upload.wikimedia.org/wikipedia/en/4/49/Creeper_%28Minecraft%29.png" width=250 />```
- newlines: ```<div />```

## HTML Input:
- ```form```: Input container and submission ```<form action="form.html" method="post">```
- ```fieldset```: Labeled input grouping ```<fieldset> ... </fieldset>```
- ```input```: Multiple types of user input ```<input type="" />```
- ```select```: Dropdown ```<select><option>1</option></select>```
- ```optgroup```: Grouped dropdown ```<optgroup><option>1</option></optgroup>```
- ```option```: Selection option ```<option selected>option2</option>```
- ```textarea```: Allows for multiple lines of text ```<textarea></textarea>```
- ```label```: Input label ```<label for="range">Range: </label>```
- ```output```: Output of inpu ```<output for="range">0</output>```
- ```meter```: Display value with a known range ```<meter min="0" max="100" value="50"></meter>```

There's several different input elements, most are intuitively named:
- ```Text```
- ```Password```
- ```Email```
- ```Tel```
- ```URL```
- ```Number```
- ```Checkbox```: Exclusive selection
- ```Radio```: Inclusive selection
- ```Range```: Range limited number
- ```Date```: Year, month, day
- ```Datetime-local```: date and time
- ```Month```: year, month
- ```Week```
- ```Color```
- ```File```
- ```Submit```: Submit button

Common attributes of input elements:
- ```name```: name of the input
- ```disabled```: stops the user from being able to interact with input
- ```value```: initial value of input
- ```required```: determines if a value is required to be valid

* The pattern element will work on some elements, which allows use of regex to determine inputted passwords

Example:
```
<body>
  <h1>Example Form</h1>
  <form action="formSubmit.html" method="post">
    <ul>
      <li>
        <!-- Includes validation-->
        <label for="text">Text: </label>
        <input type="text" id="text" name="varText" placeholder="your name here" required pattern="[Aa].*" />
      </li>
      <li>
        <label for="password">Password: </label>
        <input type="password" id="password" name="varPassword" />
      </li>
      <li>
        <label for="email">Email: </label>
        <input type="email" id="email" name="varEmail" />
      </li>
      <li>
        <label for="textarea">TextArea: </label>
        <textarea id="textarea" name="varTextarea"></textarea>
      </li>
      <li>
        <label for="select">Select: </label>
        <select id="select" name="varSelect">
          <option>option1</option>
          <option selected>option2</option>
          <option>option3</option>
        </select>
      </li>
      <li>
        <label for="optgroup">OptGroup: </label>
        <select id="optgroup" name="varOptGroup">
          <optgroup label="group1">
            <option>option1</option>
            <option selected>option2</option>
          </optgroup>
          <optgroup label="group2">
            <option>option3</option>
            <option>option4</option>
          </optgroup>
          <optgroup label="mygroup">
            <option>myfirstoption</option>
            <option>mysecondoption</option>
          </optgroup>
        </select>
      </li>
      <li>
        <fieldset>
          <legend>checkbox</legend>
          <label for="checkbox1">checkbox1</label>
          <input type="checkbox" id="checkbox1" name="varCheckbox" value="checkbox1" checked />
          <label for="checkbox2">checkbox2</label>
          <input type="checkbox" id="checkbox2" name="varCheckbox" value="checkbox2" />
          <label for="checkbox3">checkbox3</label>
          <input type="checkbox" id="checkbox3" name="varCheckbox" value="checkbox3" />
          <label for="mycheckbox">this is my checkbox</label>
          <input type="checkbox" id="mycheckbox" name="varCheckbox" value="mycheckbox" />
        </fieldset>
      </li>
      <li>
        <fieldset>
          <legend>radio</legend>
          <label for="radio1">radio1</label>
          <input type="radio" id="radio1" name="varRadio" value="radio1" checked />
          <label for="radio2">radio2</label>
          <input type="radio" id="radio2" name="varRadio" value="radio2" />
          <label for="radio3">radio3</label>
          <input type="radio" id="radio3" name="varRadio" value="radio3" />
          <label for="myradio">my radio</label>
          <input type="radio" id="myradio" name="varRadio" value="myradio" />
        </fieldset>
      </li>
      <li>
        <!-- Submit form with POST method and enctype="multipart/form-data" to send file contents. -->
        <label for="file">File: </label>
        <input type="file" id="file" name="varFile" accept="image/*" multiple />
      </li>
      <li>
        <label for="search">Search: </label>
        <input type="search" id="search" name="varSearch" />
      </li>
      <li>
        <label for="tel">Tel: </label>
        <input type="tel" id="tel" name="varTel" placeholder="###-####" pattern="\d{3}-\d{4}" />
      </li>
      <li>
        <label for="url">URL: </label>
        <input type="url" id="url" name="varUrl" />
      </li>
      <li>
        <label for="number">Number: </label>
        <input type="number" name="varNumber" id="number" min="1" max="10" step="1" />
      </li>
      <li>
        <label for="range">Range: </label>
        <input type="range" name="varRange" id="range" min="0" max="100" step="1" value="0" />
        <output id="rangeOutput" for="range">0</output>
        <!-- Range requires some JavaScript in order to make it work. Ignore this for now. -->
        <script>
          const range = document.querySelector('#range');
          const rangeOutput = document.querySelector('#rangeOutput');
          range.addEventListener('input', function() {
            rangeOutput.textContent = range.value;
          });
        </script>
      </li>
      <li>
        <label for="progress">Progress: </label>
        <progress id="progress" max="100" value="75"></progress>
      </li>
      <li>
        <label for="meter">Meter: </label>
        <meter id="meter" min="0" max="100" value="50" low="33" high="66" optimum="50"></meter>
      </li>
      <li>
        <label for="datetime">DateTime: </label>
        <input type="datetime-local" name="varDatetime" id="datetime" />
      </li>
      <li>
        <label for="time">Time: </label>
        <input type="time" name="varTime" id="time" />
      </li>
      <li>
        <label for="month">Month: </label>
        <input type="month" name="varMonth" id="month" />
      </li>
      <li>
        <label for="week">Week: </label>
        <input type="week" name="varWeek" id="week" />
      </li>
      <li>
        <label for="color">Color: </label>
        <input type="color" name="varColor" id="color" value=#ff0000 />
      </li>
      <!-- This doesn't show up to the user, but allows the form to send associated data. -->
      <input type="hidden" id="secretData" name="varSecretData" value="1989 - the web was born" />
    </ul>

    <button type="submit">Submit</button>
  </form>
</body>
```

## HTML Audio
- ```img```: Use the format ```<img alt="mountain landscape" src="https://images.pexels.com/photos/164170/pexels-photo-164170.jpeg" />```
- ```audio```: can use ```controls``` or ```autoplay```. Use the format ```<audio controls src="testAudio.mp3"></audio>```
- ```video```: will need to include ```crossorigin="anonymous``` if the file is not from the same domain as your server. Use the following format
```
<video controls width="300" crossorigin="anonymous">
  <source src="https://URL.mp4" />
</video>
```
Creating images within HTML:
* ```svg```: Renders graphics within HTML - [Read More](https://developer.mozilla.org/en-US/docs/Web/SVG)
* ```canvas```: Allows for 2D drawing and animation - requires JavaScript to draw on it

# HTTPS
Setting up Caddy will allow you to get a certificate from Let's Encrypt, which will allow a secure (https) connection
- ssh into your server
- ```vi Caddyfile```
- Replace ```:80``` with ```myDomainName.com```
- Modify Caddy rules that route traffic to the different associated sites
- Press ```esc``` to move into command mode
- ```:wq``` - _write-quit_ -- save and exit
- ```sudo service caddy restart``` to make changes take effect

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
- HTML - Basic structural and organizational elements
- CSS - Styling and animating
- JavaScript - Interactivity (e.g. What happens when a user presses a button)
- Web service - Remote functions that your application calls on your, or someone else's, web server (e.g. saveScores, getWeather, chatWithFriend)
- Authentication - Creating accounts and logging in
- Database persistence - Storing user data in a database (e.g. Save the high scores and login information)
- WebSocket - Support for pushing data from the server. This can be peer to peer communication (e.g. chatting with friends through the browser), or realtime data from the server (e.g. stock prices or the current game leader).
- Web framework - Using React to add components and request routing

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

```<!--comments, won't appear in Markdown-->```
\*ignore\_markdown\_formating\* using ```\``` before a character

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