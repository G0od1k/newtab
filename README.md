# What's this?

`newtab` is a simple start page for the browser.

![Screenshot](img/screenshot.png)

# What is special

A hotkey is automatically set for **each** link

## Multilevel

You can set sublinks to links, which in one way or another will complement the parent link

For example:

```
[{
    name: `YouTube`,
    url: `https://youtube.com`,
    sub: [
        {
            type: `after`,
            url: `/feed/subscriptions`,
            name: `Subs`,
        },
        {
            type: `after`,
            url: `/feed/library`,
            name: `Library`,
        },
        {
            type: `after`,
            url: `/playlist?list=WL`,
            name: `Watch Later`,
        },
        {
            type: `after`,
            url: `/playlist?list=LL`,
            name: `Liked`,
        },
    ],
},
{
    name: `Twitch`,
    url: `https://twitch.tv`,
},
...
```

result:

```
1. YouTube              # https://youtube.com
    1.1 Subs            # https://youtube.com/feed/subscriptions
    1.2 Library         # https://youtube.com/feed/library
    1.3 Watch Later     # https://youtube.com/playlist?list=WL
    1.4 Liked           # https://youtube.com/playlist?list=LL
2. Twitch               # https://twitch.tv
...
```
