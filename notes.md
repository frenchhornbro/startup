> [!NOTE]
> *_myfinancialbudgie.click_*

# Terminating a Website:
* https://learn.cs260.click/page/webFrameworks/wrapUp/wrapUp_md

- Terminate EC2 instance
- Disassociate elastic IP address
- Release elastic IP address
- Ensure auto renew is not set for your domain name
- Delete Route 53 hosted zone for domain name
- Clean up security group and key pair

# Final Exam Notes

22 = ssh port
80 = HTTP port
443 = HTTPS port

`npm install <moduleName>`
- Adds a dependency to your package.json file
- Adds the source code of the module to the `node_modules` directory
- Locks the version of the package for your application

Linux daemon:
- Something that just runs in the background
- Usually starts when the computer is rebooted
- Executes independent of a user
- PM2 is an example of a daemon (this stands for Process Manager 2)
  - `npm install pm2@latest -g`
- It's able to fork other processes

Common HTTP Headers:
- Authorization
- Accept
- Content-Type
- Cookie
- Host
- Origin
- Access-Control-Allow-Origin
- Content-Length
- Cache-Control
- User-Agent

HTTP Status Codes:
- 100s - Service is working on the request
- 200s - Success
- 300s - Redirect
- 400s - Client-side error
- 500s - Server-side error

JSX is used for
- Rendering HTML from JavaScript
- Componentizing your HTML
- Allowing for composability of your HTML

Example of a MongoDB query (they are case-sensitive):

`{$or: [{name:/J.*/}, {score: {$lt:3}}]}`

The following would call a delete app/fav/* endpoint:
```
const r = await fetch('/fav/ringo', {
  method: DELETE
});
```

To store passwords in Bcrypt:
```
const bcrypt = require('bcrypt');
const uuid = require('uuid');

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4()
  };
  await collection.insertOne(user); //This is inserting it into the DB

  return user
}
```
To compare passwords in Bcrypt:
```
if (await bcrypt.compare(inputtedPassword, storedPassword)) {
  /* They're authorized */
}
```

The middleware handler `app.use()` will always get called

In the following, `next()` will go to the next block and see if it matches. Wherever it matches, it will execute and just keep going so long as there is `next()` in the block
```
app.put('/whatever/:params', (req, res, next) => {
  next();
});
```

You can use fetch in both front-end and back-end code

WebSocket is peer to peer instead of client to server
WebSocket provides support for keeping a connection open, but it still has to be open (it just calls ping and pong)

# React
React example:

```
const i = 3;
const list = (
  <ol class='big'>
  <li> Item {i}</li>
  <li> Item {3 + i}</li>
  </ol>
);

```

React variables (such as className) must be specified as you would in in JavaScript, not in HTML

You can call a function when rendering something in React.:
```
function GetReactComponent() {
  return (
    <ol>
      <li onClick={() => console.log("TACO")}>Item</li>
    </ol>
  );
}

ReactDOM.render(<GetReactComponent />, document.getElementByID('root'));
```

## Vite
Vite bundles code quickly, has good debugging support, and allows you to easily support JSX, TypeScript, and different types of CSS.

Create a new React-based web application using Vite:
```
npm create vite@latest demoVite -- --template react
cd demoVite
npm install
npm run dev
```

`npm run dev` opens up a menu. Press h for help and o to open the page (functions similar to Go Live extension). 
This bundles the code into a temporary directory.

To deploy to a proudction environment, run `npm run build`

## Router
```
root.render(
<BrowserRouter>
    <div className='app'>
      <nav>
        <NavLink to='/'>Home</Link>
        <NavLink to='/about'>About</Link>
        <NavLink to='/users'>Users</Link>
      </nav>

      <main>
        <Routes>
          <Route path='/' element={<Home />} exact />
          <Route path='/about' element={<About />} />
          <Route path='/users' element={<Users />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
)
```

How to make something match exactly in a Router:
`<Route path='/' element={<A />} exact />`

## Props, State, Render
- Render: Will make the component appear / reappear: `ReactDOM.render(<Survey />, document.getElementByID('root'));`
- Props: properties that can be given to a functional component (`color` in the following example):
```
const Survey = () => {
  const [color, updateColor] = React.useState('#848BC1');
  return <Question answer={color}/>;
};

const Question = ({answer}) => {
  return (
    <div>Your answer: {answer}</div>
  );
};
```
- State: This is the `count` in the expression `const [count, updateCount] = React.useState(0)`. This is performed asynchronously, so you can't count on it being completed by the next line of code after it is called.

```
const Survey = () => {
  const [color, updateColor] = React.useState('#737AB0');

  // When the color changes update the state
  const onChange = (e) => {
    updateColor(e.target.value);
  };

  return (
    <div>
      <h1>Survey</h1>

      {/* Pass the Survey color  as a parameter to the Question.
          When the color changes the Question parameter will also be updated and rendered. */}
      <Question answer={color} />

      <p>
        <span>Pick a color: </span>
        {/* Set the Survey color state as a the value of the color picker.
            When the color changes, the value will also be updated and rendered. */}
        <input type='color' onChange={(e) => onChange(e)} value={color} />
      </p>
    </div>
  );
};

// The Question component
const Question = ({ answer }) => {
  return (
    <div>
      {/* Answer rerendered whenever the parameter changes */}
      <p>Your answer: {answer}</p>
    </div>
  );
};

ReactDOM.render(<Survey />, document.getElementById('root'));
```

## React Hooks
The `useState` hook will declare and update state in a function component.

```
function Clicker({initialCount}) {
  const [count, updateCount] = React.useState(initialCount);
  return <div onClick={() => updateCount(count + 1)}>Click count: {count}</div>;
}

ReactDOM.render(<Clicker initialCount={3} />, document.getElementById('root'));
```

The `useEffect` hook allows you to run a function every time a component complete rendering. Place it in the function component being rendered. You can pass in a second parameter to make it only be triggered by specified dependencies. If no dependencies are given (an empty array), it is only called when the component is first rendered.


# Databases
## MongoDB
Instruction: https://learn.cs260.click/page/webServices/dataServices/dataServices_md

Collection: A large array of JavaScript objects, each with a unique ID

`db.house.find();` // find all houses

`db.house.find({beds: {$gte: 2}});` // find houses with two or more bedrooms

`db.house.find({ $or: [(beds: { $lt: 3 }), (price: { $lt: 1000 })] });`
// find houses with either less than three beds or less than $1000 a night

Can also use `.findOne` to just get one each time

To use MongoDB in an application, use `npm install mongodb`

More ways to affect the output:
```
const query = {property_type: 'Condo', beds: {$lt: 2}};
const option = {
  sort: {price: -1},
  limit: 10
};
collection.find(query, options);
```

For inserting into the database, can use `.insertMany` or `.insertOne`

For updating an already-created resource, can use `updateMany` or `updateOne`

Atlas will be our managed service. Allows us to not actually physically install MongoDB on our development server.

Setting up Atlas: https://www.youtube.com/watch?v=daIH4o75KE8&ab_channel=LeeJensen

# JavaScript notes
## Express
Install NVM: https://github.com/coreybutler/nvm-windows#installation--upgrades > Latest Installer > Assets > nvm-setup.exe

Install the long term support (LTS) of Node:

`nvm install lts`

`nvm use lts`

Check that node is installed:

`node -v`

Initialize node:

`npm init -y`

Install express:

`npm install express`

```
app.get('/store/:storeName', (req, res, next) => {
  res.send({name: req.params.storeName});
});
```
Running `curl localhost:8080/store/orem` will return the response `{"name":"orem"}`

How to serve up static files:

`app.use(express.static('public'));`

How to do a GET request:
```
const express = require('express');
const app = express();
let port = 3000
app.listen(port);

app.get('/store/:storeName', (req, res, next) => {
  res.send({name: req.params.storeName});
});
```

You can use a router as an organizational tool (according to my understanding). In this example this would tack on "/api" before each path specified by the GET requests:
```
const apiRouter = express.Router();
app.use(`/api`, apiRouter);
apiRouter.get('/store/:storeName', (req, res) => {
  res.send({name: req.params.storeName});
});
```

To call the endpoint you created, do the following:
```
const response = await fetch(‘/api/endpointName’, {
	method: ‘POST’,
	headers: {},
	body: JSON.stringify(myClassOrArray)
});
```
^^^ Put this inside of a `try` `catch` block in case an error is thrown

### Middleware
A middleware function looks similar to a routing function (probably because a routing function is an example of middleware).
However, routing functions are only called if the pattern matches.
Middleware functions are called for each HTTP request unless a preceding middleware function does not call `next`

Middleware can perform routing, authentication, CORS, sessions, serving static web files, cookies, and logging.

Use middleware with `app.use((req, res, next) => {});`

## Fetch
Fetch creates a promise, which can be decoded from json.

GET Example:
```
fetch('https://api.quotable.io/random')
  .then((response) => response.json())
  .then((jsonResponse) => {
    console.log(jsonResponse);
  });
```

POST Example:
```
fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: 'test title',
    body: 'test body',
    userId: 1,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((jsonResponse) => {
    console.log(jsonResponse);
  });
```

## Promises
<u>standard promise syntax:</u>
```
const myPromise = new Promise((resolveFunction, rejectFunction) => {
  if () resolveFunction();
  else rejectFunction();
});
```
In this example, if `resolveFunction` is called then the promise is successful, and if `rejectFunction` is called then the promise fails

- The state is fulfilled when the code completes correctly
- The state is pending when the code is still running
- The state is rejected when an error occurs

`console.log(myPromise)` will output the state of the promise

<u>then/catch syntax:</u>
```
newPromise
  .then((result) => console.log("Result = ${result}"))
  .catch((error) => console.log("Error = ${error}"))
  .finally(() => console.log("completed"));
```

<u>async try/catch syntax:</u>
```
try {
	const result = await myPromise();
	console.log(“Result: ${result}”);
} catch (error) {
	console.error(“Error: ${error}”);
} finally {
	console.log(“Finished”);
}
```

`async` declares that a function will return a promise

You cannot call await unless it is called at the top level of your JS, or in an async function

`await` will wrap a call to the async function, block execution until the promise has resolved, and then returns the result of the promise.
Essentially it will take all the code after it and put it in a giant `then` box.

## Cookies
Cookies can be set and read fully from the backend without any frontend indication.

Use `npm install cookie-parser`

In your code, do the following:

```
const cookieParser = require('cookie-parser');
const ap = express();

app.use(cookieParser())'
```

To set a cookie:
```
const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/setCookie', (req, res) => {
  res.cookie('myField', 'myValue', {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 900000)
  })
  res.send();
});
```

To get a cookie:
```
apiRouter.post('/getCookie', (req, res) => {
  const userCookie = req.cookies['myField'];
});
```

To remove a cookie:

`res.clearCookie('myField');`

When an authToken expires, it will be read as `undefined`.

Cookies are handled in the Header, but this format allows Express to handle cookies for you in a simpler way

## Loops
`for in` iterates over an object's property names (gives the index number for arrays, the key for maps)
`for of` iterates over an iterable's property values (gives the value for arrays and maps)

## Document Object Model (DOM)
### Accessing the DOM
- `document` is a global variable used to access the DOM
- `querySelectorAll` allows you to select elements from the DOM
- `textContent` contains all the element's text
- `innerHTML` allows you to access an element's HTML content

### Modifying the DOM

Adding an element:
```
const newChild = document.createElement('div');
newChild.textContent = "Text inside div";
const parentElement = document.querySelector('#thisID');
parentElement.appendChild(newChild);
```
Removing an Element:
```
const element = document.querySelector('#thisID div');
element.parentElement.removeChild(element);
```
Injecting HTML
```
const element = document.querySelector('div');
element.innerHTML = '<div class="injected">Greetings</div>';
```
> [!WARNING]
> Make sure the HTML being injected can't be manipulated by the user -- this can be a vulnerability they can exploit

### Event Listeners

```
document.querySelector('#thisID').addEventListener('click', () => {console.log("Clicked the element with id #thisID")});
```
Events:
- clipboard
- focus
- keyboard
- mouse
- text selection

## WebSocket
Example of creating a WebSocket server:
```
const {WebSocketServer} = require('ws');
const wss = new WebSocketServer({port: 9900});

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const msg = String.fromCharCode(...data);
    ws.send(`Server received this message: ${msg}`);
  });
});
```

Example of creating a WebSocket client:
```
const socket = new WebSocket('ws://localhost:9900'); //Need to do wss instead of ws for HTTPS

socket.onmessage = (event) => {
  console.log(`Client received this message: ${event.data}`);
};
```

To send a message, call .send():
`const socket = new WebSocket('ws://localhost:9900');`
`socket.send('Hi server!');`

## Local Storage
Local storage provides a way to store key value pairs in a web browser. Don't store sensitive information here.

Get:
```
localStorage.getItem("variableName");
```
Set:
```
localStorage.setItem("variableName", "value");
```
Delete:
```
localStorage.removeItem("variableName");
```
Clear:
```
localStorage.clear();
```

### JSON
You can use JSON.stringify() and JSON.parse() to store objects in localStorage
```
localStorage.setItem('array', JSON.stringify(myArray));
console.log(JSON.parse(localStorage.getItem('array')));
```

### Objects
Objects can be created with `new`. Any function that returns an object is considered a constructor and can be invoked with `new`.

Inheritance is implemented using `extends`.

Example:
```
class Person {
  constructor(name) {
    this.name = name;
  }

  print() {
    return 'My name is ' + this.name;
  }
}

class Employee extends Person {
  constructor(name, position) {
    super(name);
    this.position = position;
  }

  print() {
    return super.print() + '. I am a ' + this.position;
  }
}
```

Another example of the syntax of an object:
```
let myObject = {
  name: 'Bob',
  info: {
    favoriteClass: 'CS 260',
    likesCS: true,
  },
};

const obj = {
  x: 'object',
  make: function () {
    return () => console.log(this.x);
  },
};
```

## Equality
```
(0 ==  '0') // true
('' ==  0 ) // true, the string will implicitly be converted to an integer
(null == undefined) //true
('' == false) //true

(0 === '0') // false
('' === 0 ) // false, no implicit cast is being made
(null === undefined) // false
('' === false) // false
```

## Dates
`new Date('1995-12-17)`

## String methods
`toUpperCase()` - capitalize

`toLowerCase()` - lowercase

`split()` - creates an array with the specified delimiter

`endsWith()` - boolean

`replace()` - replace text in a string

`slice()` - select a portion of the string

## Array methods
`array.push(element)` - adds element to array

`array.pop()` - returns array's last element and removes it from the array

`array.slice(1,3)` - returns an array containing the second and third elements of original array

`array.length` - returns the length of array (this is a property, not a function)

`array.map((n) => n * 100)` - alters every number in array

`array.reduce((p,c) => p+c)` - sets each number in array based on previous and current

`array.forEach()` - applies a function to each value

`array.filter()` - creates a new array containing elements that match the value

`array.some()` - returns true if any of the elements match the conditional expression given, otherwise returns false

## Closure:
A function and its surrounding state.

## Regex:
asdfa
```
const objRegex = new RegExp('ab*', 'i');
const literalRegex = /ab*/i;
const text = "abtaco is not a word i think";

text.match(literalRegex);         //returns [abtaco, i]
text.replace(literalRegex, idk);  //returns "idk is not a word idk think"
literalRegex.test(text);          //returns true
```

# CSS notes:
## Bootstrap:
Code for including bootstrap in your application using NPM (Node Package Manager)

```npm install bootstrap@5.2.3```

Remember to put ```<link rel="stylesheet" href="styles.css" />``` in your html to include your CSS (doesn't apply to CodePen)

## CSS Syntax:
Here's an example of the syntax:
```
elementname {
  font-family: sans-serif;
  padding: 10px;
  margin: 5px;
  background-color: white;
  color: green;
  font-style: italic;
}
```
^^^ You can replace elementname with .classname

Order for CSS: margin, border, padding, content

## Animations:
For animations, either of the following is acceptable:
```
elementname {
  animation-name: my-animation;
  animation-duration: 10s;
  animation-timing-function: ease-out;
}
```
or
```
elementname {
  animation: my-animation 10s ease-out;
}
```

With an animation, you'll want to have keyframes to determine what happens at what point in the animation:
```
@keyframes my-animation {
  from {
    transform: translateX(-200%);
  }
  30% {
    transform: translateX(-50%);
  }
  75% {
    transform: translateX(40%);
  }
  to {
    transform: translateX(100%);
  }
}
```

## CSS Flex
If you want your body to fill the entire screen, you'll want to use ```vh``` -- this is viewport height.
100vh means the entire screen is filled.

```flex: 0 100px;```       <-- 0 means it won't grow, 100px means it has a starting height of 100 pixels

```flex: 1;```             <-- 1 means it will get one fractional unit of growth

Making main a flexbox container for the controls and content:
```
display: flex;
flex-direction: row;
```

To switch an element from being viewed as columns in flex to being viewed as rows when the screen is too skinny:
```
@media (orientation: portrait) {
  main {
    flex-direction: column;
  }
}
```

To hide the headers and footers when the screen is too short:
```
@media (max-height: 700px) {
  header {
    display: none;
  }
  footer {
    display: none;
  }
}
```

> [!NOTE]
> ```./deployFiles.sh -k <yourpemkey> -h <yourdomain> -s simon```
> 
> ```./deployFiles.sh -k "C:\Users\htdur\.ssh\cs-260-aws\Startup - BYU CS260.pem" -h myfinancialbudgie.click -s simon```
>
> ```./deployFiles.sh -k "C:\Users\htdur\.ssh\cs-260-aws\Startup - BYU CS260.pem" -h myfinancialbudgie.click -s startup```
>
> ```./deployService.sh -k "C:\Users\htdur\.ssh\cs-260-aws\Startup - BYU CS260.pem" -h myfinancialbudgie.click -s simon```
>
> ```./deployService.sh -k "C:\Users\htdur\.ssh\cs-260-aws\Startup - BYU CS260.pem" -h myfinancialbudgie.click -s startup```

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

## HTML Media
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

# The Console
`echo` - Output the parameters of the command

`cd` - Change directory

`mkdir` - Make directory

`rmdir` - Remove directory

`rm` - Remove file(s)

`mv` - Move file(s)

`cp` - Copy files

`ls` - List files

`curl` - Command line client URL browser

`grep` - Regular expression search

`find` - Find files

`top` - View running processes with CPU and memory usage

`df` - View disk statistics

`cat` - Output the contents of a file

`less` - Interactively output the contents of a file

`wc` - Count the words in a file

`ps` - View the currently running processes

`kill` - Kill a currently running process

`sudo` - Execute a command as a super user (admin)

`ssh` - Create a secure shell on a remote computer

`scp` - Securely copy files to a remote computer

`history` - Show the history of commands

`ping` - Check if a website is up

`tracert` - Trace the connections to a website

`dig` - Show the DNS information for a domain

`man` - Look up a command in the manual


`|` - Take the output from the command on the left and pipe, or pass, it to the command on the right

`>` - Redirect output to a file. Overwrites the file if it exists

`>>` - Redirect output to a file. Appends if the file exists

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
> [!NOTE]
> ```ssh -i "C:\Users\htdur\.ssh\cs-260-aws\Startup - BYU CS260.pem" ubuntu@18.207.28.91```

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