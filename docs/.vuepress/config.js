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
      { text: "Vue3", link: "/vue3/" },
      { text: "React", link: "/react/" },
      {
        text: "other",
        items: [
          { text: "Linux", link: "/other/linux/" },
          { text: "MacOs", link: "/other/macos/" },
          { text: "Webpack", link: "/other/webpack/" },
          { text: "组件开发", link: "/other/components/" },
          { text: "设计模式", link: "/other/设计模式/" }
        ]
      }
    ],
    sidebar: {
      "/vue/": [""],
      "/vue3/": [
        {
          title: "vue3 整体架构",
          collapsable: false,
          children: [["/vue3/", "vue3架构介绍"]]
        }
      ],
      "/react/": [""],
      "/Typescript/": ["", "htmlAndEvent"],
      "/best/": ["", "webApi", "css.initial", "scc2", "lint"],
      "/other/linux/": ["", "vi", "auto", "shell", "linux-install", "docker"],
      "/other/macos/": [""],
      "/other/webpack/": [""],
      "/other/components/": [""],
      "/other/设计模式/": ["", "如何降低前端业务复杂度"],
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
