import { basicSetup } from "codemirror"
import { EditorView } from "@codemirror/view"
import { javascript } from "@codemirror/lang-javascript"

const view = new EditorView({
	doc: "Start document",
	parent: document.body,
	extensions: [
		basicSetup,
		javascript()
	],
})