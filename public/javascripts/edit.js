import { Element, ajax } from './lib/common'
import { default as markdown } from 'markdown-it'
import * as hljs from 'highlightjs'
let md = new markdown({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }
    return '';
  }
})

const styleTop = 'top: -20px; z-index:3;';
const styleBottom =  'top: 20px;';

class Edit extends Element {
  constructor(props){
    super(props)
    this.rootDOM = props
    this.data = {
      content:'',
      styleTop: styleTop,
      styleBottom: styleBottom,
      isAlertShow: false
    }
    this.renderer()
  }

  getInput(val){
    this.data.content = val.target.value
    this.setState();
  }

  setState(){
    let oldTree = this.element;
    this.setElement();
    let newTree = this.element;
    this.diff(oldTree, newTree, this.dom);
  }

  setElement(){
    let alertBox = [
      {
        tagName:'div',
        props: {
          class: 'mask',
          style: `display:${this.data.isAlertShow ? 'block' : 'none'}`
        },
        children:[
          {
            tagName: 'div',
            props: {
              class: 'alert'
            },
            children:[
              {
                tagName:'div',
                props: {
                  class: 'cancel ball-img'
                },
                events: {
                  click: function(){
                    this.data.isAlertShow = false;
                    this.setState();
                  }.bind(this)
                }
              },
              {
                tagName:'div',
                children:[
                  {
                    tagName:'span',
                    children:['标题']
                  },
                  {
                    tagName:'input'
                  }
                ]
              },
              {
                tagName:'div',
                children:[
                  {
                    tagName:'span',
                    children:['标签']
                  },
                  {
                    tagName:'input'
                  }
                ]
              },
              {
                tagName:'div',
                props: {
                  class: 'sure ball-img'
                }
              }
            ]
          }
        ]
      }
    ];
    let header = [
      {
        tagName:'div',
        props: {
          class: 'edit-header'
        },
        children:[
          {
            tagName:'p',
            children:['在线编辑']
          },
          {
            tagName:'button',
            children: ['添加'],
            events: {
              click: function(){
                this.data.isAlertShow = true;
                this.setState();
              }.bind(this)
            }
          }
        ]
      }
    ];
    let edit_wrap = [
      {
        tagName: 'div',
        props: {
          class: 'edit-wrap'
        },
        children:[
          {
            tageName:'div',
            props: {
              class:'edit-box edit-box-left',
              style: this.data.styleBottom
            },
            events: {
              click:function(){
                this.data.styleTop = styleBottom;
                this.data.styleBottom = styleTop;
                this.setState();
              }.bind(this)
            },
            children:[
              {
                tagName:'div',
                props:{
                  class: 'box'
                },
                innerHTML:{
                  position: 'afterbegin',
                  content:md.render(this.data.content)
                }
              }
            ]
          },
          {
            tageName:'div',
            props: {
              class:'edit-box edit-box-right',
              style: this.data.styleTop
            },
            events: {
              click:function(){
                this.data.styleTop = styleTop;
                this.data.styleBottom = styleBottom;
                this.setState();
              }.bind(this)
            },
            children: [
              {
                tagName: 'textarea',
                events: {
                  input: this.getInput.bind(this)
                }
              }
            ]
          }
        ]
      }
    ];
    let e = [...header, ...edit_wrap, ...alertBox];
    this.element = e; 
  }

  renderer(){
    this.setElement();
    this.render(this.rootDOM)
  }
}

new Edit(document.getElementById('container'));