module.exports = {
  title: "一个小前端",
  base: "/note/",
  // description: "Just playing around",
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    nav: [
      // 右上角的导航
      { text: "Home", link: "/" },
      { text: "进阶", link: "/best/" },
      { text: "Typescript", link: "/Typescript/" },
      { text: "Vue", link: "/vue/" }
      // { text: "External", link: "https://baidu.com" },
    ],
    // sidebar: ["/", "/bar/", ["/foo/", "Explicit link text"]], // 侧边栏导航
    // sidebar: ['/', "/async"], // 侧边栏导航
    sidebar: {
      "/vue/": [""],
      "/Typescript/": ["", "htmlAndEvent"],
      "/best/": ["", "webApi", "css.initial", "lint"],
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
