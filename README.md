# Automating Photoshop via JavaScript

Let a potentially unattended instance of Photoshop do work for you.


## Scripting Photoshop

Adobe provides extensive scripting capabilities via ExtendScript in most of its Creative Suite applications (namely Acrobat, After Effects, Bridge, Device Central, Dreamweaver, Fireworks, Flash Professional, Illustrator, InDesign and Photoshop). ExtendScript is Adobe's implementation of JavaScript offering most standard features plus additional functions, commands, constants and DOM objects.  
You can find more details (also including scripting via AppleScript and VBScript) on [Adobe Developer Connection](http://www.adobe.com/devnet/photoshop/scripting.html).

For debugging ExtendScript while running in an Adobe application (e.g. Photoshop), use the ExtendScript Toolkit. You can also use it for editing, but any JavaScript IDE will suit as well. The preferred file extension is ".jsx".

For running a jsx file in Photoshop via command line, type
```Bash
open -b com.adobe.Photoshop --args "$PWD/js/actions/textAction.jsx"
```

## Folder watching

A simple nodejs script is watching a folder via the [Stalker](https://github.com/jslatts/stalker) node module. Newly dropped-in Photoshop files (PSDs) are queued and subsequently processed in order by calls to the processing script.

Watching is started by typing:
```Bash
node js/watch.js
```

## Processing

There is a main processing script ("process.jsx") that is copied alongside the Photoshop file by the watch script. It takes care of starting the action specific processing script and passing required settings. Two example actions can be found in the "js/actions" folder.

[![githalytics.com alpha](https://cruel-carlota.gopagoda.com/f52f925326e8b956d57ea7313949e5db "githalytics.com")](http://githalytics.com/olihel/ps-scripting)

<sub>**Credits**</sub>  
<sub>Thanks to [SinnerSchrader](http://www.sinnerschrader.com/) for support and the time to work on this project.</sub>

<sub>**License**</sub>  
<sub>The MIT License (MIT)</sub>  
<sub>Copyright (c) 2013 Oliver Hellebusch</sub>

<sub>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</sub>

<sub>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</sub>

<sub>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</sub>
