/** 
题目：在vue文件第一个标签上标记源文件位置
**/

/** 
1：最简实现
**/
var source = `<style>
</style>
<template>
<div>
asdf
</div>
</template>
<script>
export default {
}
</` + `script>`
var sourcePath = ` data-source="src\\views\\app.vue"`
var loader = function (source) {
  return source.replace(/<template>\s+<div/m, '<template>\n<div'+sourcePath)
}
alert(['处理前代码:', source, '\n处理后代码:', loader(source)].join('\n'))

/** 
2：考虑性能，并考虑非div标签
**/
var source = `<style>
</style>
<template>
<span>
asdf
</span>
</template>
<script>
export default {
}
</` + `script>`
var sourcePath = ` data-source="src\\views\\app.vue"`
var loader = function (source) {
  const templateStartIndex = source.indexOf('<template>')
  if (templateStartIndex !== -1) {
    const rootIndex = source.indexOf('>', templateStartIndex + '<template>'.length)
    return source.substring(0, rootIndex) + sourcePath + source.substring(rootIndex)
  } else {
    return source
  }
}
alert(['处理前代码:', source, '\n处理后代码:', loader(source)].join('\n'))

/** 
3：考虑性能，考虑有注释干扰的情况，考虑标签属性中有尖括号的情况
**/
var source = `<style>
</style>
<template>
<!-- -->
<!--<div></div>-->
<span v-show="index > 0">
asdf
</span>
</template>
<script>
export default {
}
</` + `script>`
var sourcePath = ` data-source="src\\views\\app.vue"`
var loader = function (source) {
  const match = source.match(/(<template[^>]*>)\s*(\s*<!--[\s\S]*-->\s*)*<([\w-]+)(\s|>)/)
  if (match?.[3]) {
    const start = source.slice(0, source.indexOf(match[0]) + match[0].length - 1)
    const end = source.slice(source.indexOf(match[0]) + match[0].length - 1)
    return = `${start}${sourcePath}${end}`
  } else {
    return source
  }
}
alert(['处理前代码:', source, '\n处理后代码:', loader(source)].join('\n'))

/** 
4：考虑性能，考虑有注释干扰的情况，考虑标签属性中有尖括号的情况
**/
var source = `<style>
</style>
<template>
<!-- -->
<!--<div></div>-->
<span v-show="index > 0">
asdf
</span>
</template>
<script>
export default {
}
</` + `script>`
var loader = function (source) {
  let pos
  let templateStartIndex = source.indexOf('<template>');
  let templateEndIndex = source.indexOf('</template>');
  if (templateStartIndex != -1 && templateEndIndex > templateStartIndex) {
    pos = templateStartIndex + '<template>'.length;
    pos = findNextElemPos();
    return source.substring(0, pos) + ' data-source="src\\views\\app.vue"' + source.substring(pos)
  } else {
    return source
  }
  function findNextElemPos() {
    let inElement = false;
    let inComment = false;
    while (pos < templateEndIndex) {
      if (inComment) {
        if (source.charAt(pos) == '-' && source.charAt(pos + 1) == '-' && source.charAt(pos + 2) == '>') {
          inComment = false;
          pos += 3
        } else {
          pos++
        }
        continue
      } else if (inElement) {
        if (source.charAt(pos) == '>' || source.charAt(pos) == ' ') {
          inElement = false;
          return pos
        }
        pos++
        continue
      }
      if (source.charAt(pos) == '<') {
        if (source.charAt(pos + 1) == '!' && source.charAt(pos + 2) == '-' && source.charAt(pos + 3) == '-') {
          pos += 3;
          inComment = true
        } else if (source.charAt(pos + 1).match(/\w/)) {
          inElement = true
        }
      }
      pos++
    }
  }
}
alert(['处理前代码:', source, '\n处理后代码:', loader(source)].join('\n'))
