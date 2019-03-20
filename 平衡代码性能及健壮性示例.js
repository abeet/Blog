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
function loader(source) {
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
