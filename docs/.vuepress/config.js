module.exports = {
  title: "一个小前端",
  base: "/note/",
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Tx", link: "/best/" },
      { text: "Typescript", link: "/Typescript/" },
      { text: "Vue", link: "/vue/" },
      {
        text: "other",
        items: [
          { text: "Linux", link: "/other/linux/" },
          { text: "MacOs", link: "/other/macos/" }
        ]
      }
    ],
    sidebar: {
      "/vue/": [""],
      "/Typescript/": ["", "htmlAndEvent"],
      "/best/": ["", "webApi", "css.initial", "lint"],
      "/other/linux/": ["", "vi", "auto", "shell"],
      "/other/macos/": [""],
      "/": [
        "",
        "async",
        "Module",
        "Npm",
        "Buffer",
        "Link",
        "Tree",
        "Http-1",
        "Http-2",
        "Cookie-Session",
        "Express",
        "Process"
      ]
    }
  }
}
