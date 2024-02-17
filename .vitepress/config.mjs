import { defineConfig } from 'vitepress';
import { set_sidebar } from '../utils/sidebar.mjs';
import { docsAuto } from '@yicode/yidocs-auto';
let { sideBar,navBar } = docsAuto();
// 改成自己的路径

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base:'/docs-demo/',
  head: [["link", { rel: "icon", href: "/docs-demo/改中国龙.png" }]],
  title: "我的项目",
  description: "A VitePress Site",
  lastUpdated: true,
  markdown:{
    theme:'material-theme-palenight',
    lineNumbers:true
  },
  outDir: './dist',
  srcDir: './markdown',
  themeConfig: {
    logo:"首页logo.svg",
    // https://vitepress.dev/reference/default-theme-config

       // 设置搜索框的样式
       search: {
        provider: "local",
        options: {
          translations: {
            button: {
              buttonText: "搜索文档",
              buttonAriaLabel: "搜索文档",
            },
            modal: {
              noResultsText: "无法找到相关结果",
              resetButtonTitle: "清除查询条件",
              footer: {
                selectText: "选择",
                navigateText: "切换",
              },
            },
          },
        },
      },


    // nav: [
    //   { text: '首页', link: '/' },
    //   {text:'环境搭建', link:'/momo/'},
    //   {text:'其他', link:"/front-end/"},
    //   { text: '示例', items: [
    //     { text: 'Markdown 示例', link: '/markdown-examples' },
    //     { text: 'API 示例', link: '/api-examples' }
    //   ] },
      
    // ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   },
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown 演示', link: '/markdown-examples' },
    //       { text: 'Runtime API 示例', link: '/api-examples' },
    //       { text: '配置IPv6公网地址DDNS并开放外网访问端口', link: '/momo/配置IPv6公网地址DDNS并开放外网访问端口' }
    //     ]
    //   }
    // ],
    // sidebar: 
    // // false, // 关闭侧边栏
    // // aside: "left", // 设置右侧侧边栏在左侧显示
    // //右侧边栏自动生成
    // {
    //    '/momo/': set_sidebar('momo'),
    //    "/front-end/": set_sidebar("front-end"),
       
    // },
    nav: navBar,
    sidebar: sideBar,
    
     

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
      { 
        icon: {
        svg:'<svg t="1707825545612" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19706" width="200" height="200"><path d="M512 512m-400 0a400 400 0 1 0 800 0 400 400 0 1 0-800 0Z" fill="#FFFFFF" p-id="19707"></path><path d="M512 1012.87c-276.63 0-500.87-224.24-500.87-500.87S235.37 11.13 512 11.13 1012.87 235.37 1012.87 512 788.63 1012.87 512 1012.87z m253.515-556.516h-284.42a24.743 24.743 0 0 0-24.741 24.743l-0.026 61.832c0 13.648 11.07 24.743 24.718 24.743h173.176c13.674 0 24.743 11.069 24.743 24.718v12.37a74.204 74.204 0 0 1-74.204 74.205H369.753a24.743 24.743 0 0 1-24.718-24.743V419.264a74.204 74.204 0 0 1 74.179-74.204h346.251a24.743 24.743 0 0 0 24.718-24.742l0.075-61.833a24.743 24.743 0 0 0-24.718-24.743H419.214a185.498 185.498 0 0 0-185.498 185.522v346.252c0 13.673 11.07 24.743 24.744 24.743h364.833a166.94 166.94 0 0 0 166.94-166.94V481.071a24.743 24.743 0 0 0-24.743-24.717z" fill="#C71D23" p-id="19708"></path></svg>'
      }, 
        link: 'https://gitee.com/'
       }
    ],
    footer:{
      copyright:'© 2024 momo',
    }
  }
})


