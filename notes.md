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